/**
 * DSH Catalog Approvals Screenshot Script
 * Captures VR-L2-008 (quality) and VR-L2-009 (pricing) via Chrome CDP.
 * Output: tools/registry/runs/DSH_SLICE001_REALITY_SYNC-20260603/screenshots/control-panel/
 */
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'node:net'; // use raw ws below

const CDP_PORT = 9333;
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = 'tools/registry/runs/DSH_SLICE001_REALITY_SYNC-20260603/screenshots/control-panel';

function cdpGet(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: CDP_PORT, path }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const handler = (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.id === id) {
          ws.removeListener('message', handler);
          if (msg.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      } catch {}
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { ws.removeListener('message', handler); reject(new Error(`timeout: ${method}`)); }, 15000);
  });
}

function connectWS(wsUrl) {
  return new Promise((resolve, reject) => {
    // Use built-in WebSocket (Node 22 has it globally)
    const ws = new globalThis.WebSocket(wsUrl);
    ws.onopen = () => resolve(ws);
    ws.onerror = (e) => reject(e);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function screenshot(ws, filename) {
  const result = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const buffer = Buffer.from(result.data, 'base64');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✅ Saved: ${outPath} (${buffer.length} bytes)`);
  return outPath;
}

async function main() {
  console.log('Getting CDP target list...');
  const targets = await cdpGet('/json/list');

  // Find or create a page target
  let target = targets.find(t => t.type === 'page');
  if (!target) {
    const newTarget = await cdpGet('/json/new');
    target = newTarget;
  }
  console.log('Using target:', target.id, target.url);

  const ws = await connectWS(target.webSocketDebuggerUrl);
  console.log('WebSocket connected');

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Network.enable');

  const captures = [
    {
      url: `${BASE_URL}/catalogs?tab=approvals&subTab=quality`,
      filename: 'P2__control-panel__ops.dsh.catalog.approvals.quality__success__web__rtl__VISUAL_REVIEW.png',
      label: 'VR-L2-008 catalog approvals quality',
    },
    {
      url: `${BASE_URL}/catalogs?tab=approvals&subTab=pricing`,
      filename: 'P2__control-panel__ops.dsh.catalog.approvals.pricing__success__web__rtl__VISUAL_REVIEW.png',
      label: 'VR-L2-009 catalog approvals pricing',
    },
  ];

  const results = [];

  for (const { url, filename, label } of captures) {
    console.log(`\nNavigating to: ${url}`);

    const navDone = new Promise((resolve) => {
      const handler = (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.method === 'Page.loadEventFired') {
            ws.removeEventListener?.('message', handler);
            ws.removeListener?.('message', handler);
            resolve();
          }
        } catch {}
      };
      ws.addEventListener?.('message', handler) ?? ws.on('message', handler);
      setTimeout(resolve, 8000); // fallback
    });

    await sendCDP(ws, 'Page.navigate', { url });
    await navDone;
    await sleep(2500); // allow React hydration + lazy-loaded chunks

    // Scroll to top to ensure consistent viewport
    await sendCDP(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
    await sleep(300);

    const savedPath = await screenshot(ws, filename);
    results.push({ label, url, path: savedPath });
    console.log(`  Label: ${label}`);
  }

  ws.close?.();
  console.log('\n=== Screenshot summary ===');
  for (const r of results) {
    console.log(`  ${r.label}: ${r.path}`);
  }
  console.log('Done.');
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
