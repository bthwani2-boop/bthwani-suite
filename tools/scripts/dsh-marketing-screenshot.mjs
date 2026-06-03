/**
 * DSH Marketing Visibility Screenshot — GAP-003 / VR-L2-012 candidate
 * Captures the control-panel marketing visibility screen (VisibilityCommandDeckScreen)
 * and the main marketing hub to prove store visibility controls exist.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CDP_PORT = 9333;
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = 'tools/registry/runs/DSH_SLICE001_REALITY_SYNC-20260603/screenshots/control-panel';
fs.mkdirSync(OUT_DIR, { recursive: true });

function cdpPut(p) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: CDP_PORT, path: p, method: 'PUT' }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.end();
  });
}

function connectAndRun(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const pending = {};

  ws.addEventListener('message', evt => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.id && pending[msg.id]) {
        const cb = pending[msg.id]; delete pending[msg.id];
        if (msg.error) cb.reject(new Error(JSON.stringify(msg.error)));
        else cb.resolve(msg.result);
      }
    } catch {}
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending[id] = { resolve, reject };
      setTimeout(() => { if (pending[id]) { delete pending[id]; reject(new Error('timeout: ' + method)); } }, 15000);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function evalJS(expr) {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return r.result?.value;
  }

  async function screenshot(filename) {
    const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const buf = Buffer.from(r.data, 'base64');
    const outPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(outPath, buf);
    console.log('  Saved:', outPath, `(${buf.length}b)`);
    return outPath;
  }

  async function run() {
    await send('Page.enable');

    // Navigate to /marketing — the main marketing hub
    console.log('1. Navigating to /marketing...');
    await send('Page.navigate', { url: BASE_URL + '/marketing' });
    await sleep(4500);
    await evalJS('window.scrollTo(0,0)');
    await sleep(400);

    console.log('2. Screenshot marketing hub (VR-L2-012 candidate)...');
    await screenshot('P2__control-panel__ops.dsh.marketing.visibility.hub__success__web__rtl__VISUAL_REVIEW.png');

    // Try to navigate to visibility workspace specifically
    console.log('3. Navigating to /marketing?workspace=visibility...');
    await send('Page.navigate', { url: BASE_URL + '/marketing?workspace=visibility' });
    await sleep(4000);
    await evalJS('window.scrollTo(0,0)');
    await sleep(400);

    console.log('4. Screenshot visibility workspace...');
    await screenshot('P2__control-panel__ops.dsh.marketing.visibility__success__web__rtl__VISUAL_REVIEW.png');

    // Dump current URL and title for verification
    const url = await evalJS('window.location.href');
    const title = await evalJS('document.title');
    const h1 = await evalJS('document.querySelector("h1")?.textContent?.trim() || "no h1"');
    console.log('  URL:', url);
    console.log('  Title:', title);
    console.log('  H1:', h1);

    ws.close();
    console.log('\nDone.');
  }

  ws.addEventListener('open', () => run().catch(e => { console.error('RUN ERROR:', e.message); ws.close(); }));
  ws.addEventListener('error', e => console.error('WS ERROR:', e.type));
}

const target = await cdpPut('/json/new');
console.log('New CDP target:', target.id);
connectAndRun(target.webSocketDebuggerUrl);
