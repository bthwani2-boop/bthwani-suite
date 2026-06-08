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
      let d = '';
      res.on('data', c => d += c);
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
        const cb = pending[msg.id];
        delete pending[msg.id];
        if (msg.error) cb.reject(new Error(JSON.stringify(msg.error)));
        else cb.resolve(msg.result);
      }
    } catch {}
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending[id] = { resolve, reject };
      setTimeout(() => {
        if (pending[id]) { delete pending[id]; reject(new Error('timeout: ' + method)); }
      }, 15000);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function clickByText(text) {
    const expr = `
      (function() {
        const els = Array.from(document.querySelectorAll('button, [role="tab"]'));
        const target = els.find(el => el.textContent.trim() === ${JSON.stringify(text)});
        if (target) { target.click(); return 'clicked: ' + target.textContent.trim(); }
        return 'not_found';
      })()
    `;
    const result = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return result.result?.value ?? 'no result';
  }

  async function screenshot(filename) {
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const buf = Buffer.from(result.data, 'base64');
    const outPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(outPath, buf);
    console.log('  Saved:', outPath, `(${buf.length}b)`);
    return outPath;
  }

  async function run() {
    await send('Page.enable');

    // --- Step 1: Navigate to /catalogs ---
    console.log('1. Navigating to /catalogs...');
    await send('Page.navigate', { url: BASE_URL + '/catalogs' });
    await sleep(4500);

    // --- Step 2: Click approvals tab ---
    const tabClick = await clickByText('الاعتمادات والجودة');
    console.log('2. Approvals tab click:', tabClick);
    await sleep(1500);

    // --- Step 3: Click quality subtab ---
    const qualityClick = await clickByText('جودة');
    console.log('3. Quality subtab click:', qualityClick);
    await sleep(1500);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
    await sleep(400);

    console.log('4. Screenshotting VR-L2-008 (quality)...');
    await screenshot('P2__control-panel__ops.dsh.catalog.approvals.quality__success__web__rtl__VISUAL_REVIEW.png');

    // --- Step 4: Click pricing subtab ---
    const pricingClick = await clickByText('تعارض أسعار');
    console.log('5. Pricing subtab click:', pricingClick);
    await sleep(1500);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
    await sleep(400);

    console.log('6. Screenshotting VR-L2-009 (pricing)...');
    await screenshot('P2__control-panel__ops.dsh.catalog.approvals.pricing__success__web__rtl__VISUAL_REVIEW.png');

    ws.close();
    console.log('\nDone.');
  }

  ws.addEventListener('open', () => run().catch(e => { console.error('RUN ERROR:', e.message); ws.close(); }));
  ws.addEventListener('error', e => console.error('WS ERROR:', e.type));
}

const target = await cdpPut('/json/new');
console.log('New CDP target:', target.id);
connectAndRun(target.webSocketDebuggerUrl);
