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

    // Navigate
    console.log('1. Navigating to /catalogs...');
    await send('Page.navigate', { url: BASE_URL + '/catalogs' });
    await sleep(5000);

    // Dump all clickable elements with their text
    const buttonTexts = await evalJS(`
      JSON.stringify(
        Array.from(document.querySelectorAll('button')).map(b => ({
          text: b.textContent.trim().replace(/\\s+/g, ' ').slice(0, 60),
          tag: b.tagName,
          class: b.className.slice(0, 80)
        })).filter(b => b.text.length > 0)
      )
    `);
    console.log('\n=== All buttons ===');
    JSON.parse(buttonTexts).forEach((b, i) => console.log(`  [${i}] "${b.text}" — ${b.class.slice(0, 50)}`));

    // Find the approvals tab by checking which button has "اعتماد" in its text
    const clickResult = await evalJS(`
      (function() {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent.includes('الاعتمادات'));
        if (target) {
          target.click();
          return 'clicked: ' + target.textContent.trim().slice(0, 40);
        }
        return 'NOT FOUND';
      })()
    `);
    console.log('\n2. Approvals tab:', clickResult);
    await sleep(1800);

    // After clicking approvals tab, dump buttons again to see subtabs
    const afterApprovalButtons = await evalJS(`
      JSON.stringify(
        Array.from(document.querySelectorAll('button')).map(b => ({
          text: b.textContent.trim().replace(/\\s+/g, ' ').slice(0, 60)
        })).filter(b => b.text.length > 0)
      )
    `);
    console.log('\n=== Buttons after approvals click ===');
    JSON.parse(afterApprovalButtons).forEach((b, i) => console.log(`  [${i}] "${b.text}"`));

    // Click جودة subtab
    const qualityClick = await evalJS(`
      (function() {
        const btns = Array.from(document.querySelectorAll('button'));
        const t = btns.find(b => b.textContent.trim() === 'جودة');
        if (t) { t.click(); return 'clicked جودة'; }
        // fallback: find containing 'جودة'
        const t2 = btns.find(b => b.textContent.includes('جودة'));
        if (t2) { t2.click(); return 'clicked via includes: ' + t2.textContent.trim().slice(0, 30); }
        return 'جودة NOT FOUND';
      })()
    `);
    console.log('\n3. Quality subtab:', qualityClick);
    await sleep(1800);
    await evalJS('window.scrollTo(0,0)');
    await sleep(400);

    console.log('\n4. Screenshot VR-L2-008 (quality)...');
    await screenshot('P2__control-panel__ops.dsh.catalog.approvals.quality__success__web__rtl__VISUAL_REVIEW.png');

    // Click pricing subtab
    const pricingClick = await evalJS(`
      (function() {
        const btns = Array.from(document.querySelectorAll('button'));
        const t = btns.find(b => b.textContent.trim() === 'تعارض أسعار');
        if (t) { t.click(); return 'clicked تعارض أسعار'; }
        const t2 = btns.find(b => b.textContent.includes('تعارض'));
        if (t2) { t2.click(); return 'clicked via includes: ' + t2.textContent.trim().slice(0, 30); }
        return 'pricing NOT FOUND';
      })()
    `);
    console.log('\n5. Pricing subtab:', pricingClick);
    await sleep(1800);
    await evalJS('window.scrollTo(0,0)');
    await sleep(400);

    console.log('\n6. Screenshot VR-L2-009 (pricing)...');
    await screenshot('P2__control-panel__ops.dsh.catalog.approvals.pricing__success__web__rtl__VISUAL_REVIEW.png');

    ws.close();
    console.log('\nDone.');
  }

  ws.addEventListener('open', () => run().catch(e => { console.error('RUN ERROR:', e.message, e.stack); ws.close(); }));
  ws.addEventListener('error', e => console.error('WS ERROR:', e.type));
}

const target = await cdpPut('/json/new');
console.log('New CDP target:', target.id);
connectAndRun(target.webSocketDebuggerUrl);
