/**
 * gen-category-images.mjs
 * Generates small colored PNG images with context-appropriate minimalist icons for DSH categories.
 * Uses only Node.js built-ins (zlib, fs) — no external packages needed.
 * Output: ~3–5 KB per image (200×200 px).
 */

import { deflateRaw as zlibDeflateRaw } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('Script loaded successfully. DIRNAME:', __dirname);
const ROOT = path.resolve(__dirname, '../../dsh/frontend/media-fixtures/categories');

const deflateRaw = promisify(zlibDeflateRaw);

// ── CRC32 & Chunk Helpers ──────────────────────────────────────────────────────

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crcBuf]);
}

// ── Drawing Canvas Class ───────────────────────────────────────────────────────

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = Buffer.alloc(width * height * 3);
  }

  setPixel(x, y, r, g, b, alpha = 255) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (y * this.width + x) * 3;
    if (alpha === 255) {
      this.buffer[idx] = r;
      this.buffer[idx + 1] = g;
      this.buffer[idx + 2] = b;
    } else {
      const a = alpha / 255;
      this.buffer[idx] = Math.round(a * r + (1 - a) * this.buffer[idx]);
      this.buffer[idx + 1] = Math.round(a * g + (1 - a) * this.buffer[idx + 1]);
      this.buffer[idx + 2] = Math.round(a * b + (1 - a) * this.buffer[idx + 2]);
    }
  }

  fillGradient(r, g, b) {
    const W = this.width;
    const H = this.height;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dx = (x - W / 2) / (W / 2);
        const dy = (y - H / 2) / (H / 2);
        const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy));
        const lighten = Math.round((1 - dist) * 45);
        this.setPixel(x, y, Math.min(255, r + lighten), Math.min(255, g + lighten), Math.min(255, b + lighten));
      }
    }
  }

  drawCircle(cx, cy, radius, r, g, b, alpha = 255, fill = true) {
    const rSq = radius * radius;
    for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
      for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
        const dx = x - cx;
        const dy = y - cy;
        const distSq = dx * dx + dy * dy;
        if (fill) {
          if (distSq <= rSq) {
            this.setPixel(x, y, r, g, b, alpha);
          }
        } else {
          // Outline
          if (Math.abs(distSq - rSq) < radius * 1.5) {
            this.setPixel(x, y, r, g, b, alpha);
          }
        }
      }
    }
  }

  drawRect(x, y, w, h, r, g, b, alpha = 255) {
    for (let py = Math.floor(y); py < Math.floor(y + h); py++) {
      for (let px = Math.floor(x); px < Math.floor(x + w); px++) {
        this.setPixel(px, py, r, g, b, alpha);
      }
    }
  }

  drawLine(x1, y1, x2, y2, thickness, r, g, b, alpha = 255) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    if (steps === 0) return;
    const xInc = dx / steps;
    const yInc = dy / steps;
    let x = x1;
    let y = y1;
    for (let i = 0; i <= steps; i++) {
      if (thickness <= 1) {
        this.setPixel(Math.round(x), Math.round(y), r, g, b, alpha);
      } else {
        const half = thickness / 2;
        this.drawCircle(x, y, half, r, g, b, alpha, true);
      }
      x += xInc;
      y += yInc;
    }
  }
}

class ScaledCanvas extends Canvas {
  constructor(width, height, scale = 4) {
    super(width * scale, height * scale);
    this.virtualWidth = width;
    this.virtualHeight = height;
    this.scale = scale;
  }

  drawCircle(cx, cy, radius, r, g, b, alpha = 255, fill = true) {
    super.drawCircle(cx * this.scale, cy * this.scale, radius * this.scale, r, g, b, alpha, fill);
  }

  drawRect(x, y, w, h, r, g, b, alpha = 255) {
    super.drawRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale, r, g, b, alpha);
  }

  drawLine(x1, y1, x2, y2, thickness, r, g, b, alpha = 255) {
    super.drawLine(x1 * this.scale, y1 * this.scale, x2 * this.scale, y2 * this.scale, thickness * this.scale, r, g, b, alpha);
  }
}

// ── Draw Icon Helper ───────────────────────────────────────────────────────────

function drawIcon(canvas, type) {
  const cx = 100;
  const cy = 100;
  const col = { r: 255, g: 255, b: 255, a: 235 }; // Crisp white
  const accent = { r: 255, g: 255, b: 255, a: 110 }; // Soft glassmorphic white
  const detail = { r: 255, g: 255, b: 255, a: 180 };

  const drawShadowCircle = (scx, scy, sr) => {
    canvas.drawCircle(scx + 2, scy + 4, sr + 2, 0, 0, 0, 25, true);
    canvas.drawCircle(scx + 1, scy + 2, sr + 1, 0, 0, 0, 40, true);
  };
  const drawShadowRect = (sx, sy, sw, sh) => {
    canvas.drawRect(sx + 2, sy + 4, sw + 2, sh + 2, 0, 0, 0, 25);
    canvas.drawRect(sx + 1, sy + 2, sw + 1, sh + 1, 0, 0, 0, 40);
  };

  switch (type) {
    case 'grocery_deals_bundle':
      // Shadow
      drawShadowRect(cx - 24, cy - 15, 48, 44);
      // Main Gift Box
      canvas.drawRect(cx - 24, cy - 15, 48, 44, col.r, col.g, col.b, accent.a);
      // Box Lid
      canvas.drawRect(cx - 27, cy - 22, 54, 8, col.r, col.g, col.b, col.a);
      // Ribbon cross
      canvas.drawRect(cx - 5, cy - 22, 10, 51, 255, 230, 100, col.a); // Golden Ribbon
      canvas.drawRect(cx - 24, cy + 2, 48, 8, 255, 230, 100, col.a);
      // Ribbon Bow (left and right loops)
      canvas.drawCircle(cx - 10, cy - 28, 8, 255, 220, 90, col.a, false);
      canvas.drawCircle(cx + 10, cy - 28, 8, 255, 220, 90, col.a, false);
      canvas.drawCircle(cx - 10, cy - 28, 6, 255, 230, 100, accent.a, true);
      canvas.drawCircle(cx + 10, cy - 28, 6, 255, 230, 100, accent.a, true);
      break;

    case 'sweets_juices_fresh':
      // Juice Cup
      drawShadowCircle(cx, cy, 32);
      // Outer glass walls
      canvas.drawLine(cx - 22, cy - 25, cx - 12, cy + 30, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 22, cy - 25, cx + 12, cy + 30, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 14, cy + 30, cx + 14, cy + 30, 4, col.r, col.g, col.b, col.a);
      // Liquid content (Vibrant orange glow)
      canvas.drawRect(cx - 15, cy - 5, 30, 32, 255, 240, 200, accent.a);
      canvas.drawRect(cx - 15, cy + 10, 30, 18, 255, 210, 100, col.a);
      // Citrus Wheel slice on rim
      canvas.drawCircle(cx - 22, cy - 25, 14, 255, 225, 100, col.a, true);
      canvas.drawCircle(cx - 22, cy - 25, 14, col.r, col.g, col.b, col.a, false);
      canvas.drawCircle(cx - 22, cy - 25, 10, 255, 200, 50, col.a, true);
      // Straw
      canvas.drawLine(cx - 4, cy + 15, cx + 15, cy - 38, 4, 255, 120, 120, col.a); // Striped straw
      canvas.drawLine(cx + 15, cy - 38, cx + 25, cy - 38, 4, 255, 120, 120, col.a);
      break;

    case 'sweets_juices_sweets':
      // Cupcake
      drawShadowCircle(cx, cy + 15, 22);
      // Wrapper base
      canvas.drawLine(cx - 20, cy + 8, cx - 12, cy + 32, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 20, cy + 8, cx + 12, cy + 32, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 12, cy + 32, cx + 12, cy + 32, 3, col.r, col.g, col.b, col.a);
      canvas.drawRect(cx - 14, cy + 8, 28, 22, col.r, col.g, col.b, accent.a);
      // Wrapper pleats
      canvas.drawLine(cx - 8, cy + 8, cx - 6, cy + 32, 2, col.r, col.g, col.b, detail.a);
      canvas.drawLine(cx, cy + 8, cx, cy + 32, 2, col.r, col.g, col.b, detail.a);
      canvas.drawLine(cx + 8, cy + 8, cx + 6, cy + 32, 2, col.r, col.g, col.b, detail.a);
      // Cupcake frosting swirls
      canvas.drawCircle(cx - 12, cy + 2, 14, 255, 235, 240, col.a, true);
      canvas.drawCircle(cx + 12, cy + 2, 14, 255, 235, 240, col.a, true);
      canvas.drawCircle(cx, cy - 6, 16, 255, 210, 230, col.a, true);
      // Sparkles/sprinkles
      canvas.drawCircle(cx - 10, cy - 4, 2, 255, 100, 150, col.a, true);
      canvas.drawCircle(cx + 10, cy - 4, 2, 100, 200, 255, col.a, true);
      canvas.drawCircle(cx, cy + 2, 2.5, 255, 220, 100, col.a, true);
      // Cherry on top
      canvas.drawCircle(cx, cy - 20, 6, 255, 80, 80, col.a, true);
      canvas.drawLine(cx, cy - 20, cx + 10, cy - 32, 2, col.r, col.g, col.b, col.a);
      break;

    case 'sweets_juices_icecream':
      // Waffle cone
      drawShadowCircle(cx, cy + 10, 24);
      canvas.drawLine(cx - 20, cy + 2, cx, cy + 38, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 20, cy + 2, cx, cy + 38, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 20, cy + 2, cx + 20, cy + 2, 4, col.r, col.g, col.b, col.a);
      // Waffle hatch
      canvas.drawLine(cx - 10, cy + 11, cx + 5, cy + 28, 2, col.r, col.g, col.b, accent.a);
      canvas.drawLine(cx + 10, cy + 11, cx - 5, cy + 28, 2, col.r, col.g, col.b, accent.a);
      // Triple Ice Cream Scoops
      canvas.drawCircle(cx - 10, cy - 10, 16, 255, 235, 200, col.a, true); // Vanilla scoop
      canvas.drawCircle(cx + 10, cy - 10, 16, 200, 130, 100, col.a, true); // Chocolate scoop
      canvas.drawCircle(cx, cy - 22, 18, 255, 170, 190, col.a, true); // Strawberry scoop
      // Syrup drizzle
      canvas.drawCircle(cx, cy - 22, 18, 255, 80, 120, accent.a, false);
      // Top Cherry
      canvas.drawCircle(cx, cy - 36, 6, 255, 80, 80, col.a, true);
      canvas.drawLine(cx, cy - 36, cx + 8, cy - 46, 2, col.r, col.g, col.b, col.a);
      break;

    case 'anaqati_perfumes':
      // Elegant glass body shadow
      drawShadowRect(cx - 20, cy - 12, 40, 46);
      // Outer glass contour
      canvas.drawRect(cx - 20, cy - 12, 40, 46, col.r, col.g, col.b, accent.a);
      canvas.drawLine(cx - 20, cy - 12, cx - 20, cy + 34, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 20, cy - 12, cx + 20, cy + 34, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 20, cy - 12, cx + 20, cy - 12, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 20, cy + 34, cx + 20, cy + 34, 3, col.r, col.g, col.b, col.a);
      // Inner luxury perfume fluid (glowing amethyst)
      canvas.drawRect(cx - 15, cy - 7, 30, 36, 240, 200, 255, col.a);
      // Luxury branding label
      canvas.drawRect(cx - 10, cy + 3, 20, 14, 255, 235, 180, col.a);
      canvas.drawLine(cx - 6, cy + 10, cx + 6, cy + 10, 2, 100, 80, 120, col.a);
      // Shiny Gold Sprayer & Cap
      canvas.drawRect(cx - 6, cy - 20, 12, 8, 255, 220, 100, col.a);
      canvas.drawCircle(cx, cy - 25, 6, 255, 220, 100, col.a, true);
      break;

    case 'anaqati_accessories_beauty':
      // Lipstick shadow
      drawShadowRect(cx - 22, cy - 8, 16, 40);
      // Lipstick casing (Luxury Black/Gold)
      canvas.drawRect(cx - 22, cy - 8, 16, 40, col.r, col.g, col.b, col.a);
      canvas.drawRect(cx - 20, cy + 8, 12, 4, 255, 220, 100, col.a); // Gold band
      // Red lipstick tip protruding
      canvas.drawRect(cx - 18, cy - 24, 8, 16, 255, 100, 120, col.a);
      canvas.drawLine(cx - 18, cy - 24, cx - 10, cy - 16, 3, 255, 50, 80, col.a);
      // Premium Compact Mirror (Rose gold accent)
      drawShadowCircle(cx + 18, cy + 12, 18);
      canvas.drawCircle(cx + 18, cy + 12, 18, 255, 210, 210, col.a, true);
      canvas.drawCircle(cx + 18, cy + 12, 14, 220, 240, 255, col.a, true); // Shiny glass surface
      canvas.drawCircle(cx + 18, cy + 12, 14, col.r, col.g, col.b, col.a, false);
      break;

    case 'anaqati_clothing':
      // Coat hanger shape shadow
      canvas.drawLine(cx - 38, cy - 13, cx + 38, cy - 13, 6, 0, 0, 0, 20);
      // Coat hanger (Premium Wooden gold)
      canvas.drawLine(cx, cy - 25, cx - 35, cy - 5, 4, 230, 170, 90, col.a);
      canvas.drawLine(cx, cy - 25, cx + 35, cy - 5, 4, 230, 170, 90, col.a);
      canvas.drawLine(cx - 35, cy - 5, cx + 35, cy - 5, 4, 230, 170, 90, col.a);
      // Shiny Metallic Hook
      canvas.drawCircle(cx + 4, cy - 31, 7, col.r, col.g, col.b, col.a, false);
      // Soft hanging designer fabric overlay (representing fashion clothing)
      canvas.drawRect(cx - 25, cy - 5, 50, 40, col.r, col.g, col.b, accent.a);
      canvas.drawLine(cx - 20, cy - 5, cx - 20, cy + 35, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 20, cy - 5, cx + 20, cy + 35, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 20, cy + 35, cx + 20, cy + 35, 3, col.r, col.g, col.b, col.a);
      break;

    case 'gas_refill_refill':
      // Gas cylinder shadow
      drawShadowRect(cx - 18, cy - 20, 36, 48);
      // Highly-detailed gas cylinder body
      canvas.drawRect(cx - 18, cy - 20, 36, 48, col.r, col.g, col.b, accent.a);
      canvas.drawLine(cx - 18, cy - 20, cx - 18, cy + 28, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 18, cy - 20, cx + 18, cy + 28, 4, col.r, col.g, col.b, col.a);
      canvas.drawCircle(cx, cy - 20, 18, col.r, col.g, col.b, col.a, false);
      canvas.drawCircle(cx, cy + 28, 18, col.r, col.g, col.b, col.a, false);
      // Cylinder valve collar guard
      canvas.drawRect(cx - 10, cy - 32, 20, 12, col.r, col.g, col.b, col.a);
      canvas.drawRect(cx - 6, cy - 28, 12, 8, 0, 0, 0, 100);
      // Brass valve wheel
      canvas.drawRect(cx - 5, cy - 36, 10, 4, 255, 220, 100, col.a);
      // Glowing gas flame emblem on cylinder
      canvas.drawCircle(cx, cy + 4, 10, 100, 200, 255, col.a, true);
      canvas.drawLine(cx, cy - 3, cx - 6, cy + 8, 3, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx, cy - 3, cx + 6, cy + 8, 3, col.r, col.g, col.b, col.a);
      break;

    case 'gas_refill_repair':
      // Gear wheel shadow
      drawShadowCircle(cx - 10, cy - 10, 20);
      // Gear outline & core
      canvas.drawCircle(cx - 10, cy - 10, 20, col.r, col.g, col.b, col.a, false);
      canvas.drawCircle(cx - 10, cy - 10, 16, col.r, col.g, col.b, accent.a, true);
      canvas.drawCircle(cx - 10, cy - 10, 6, col.r, col.g, col.b, col.a, false);
      // Gear teeth
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const tx = cx - 10 + Math.cos(angle) * 22;
        const ty = cy - 10 + Math.sin(angle) * 22;
        canvas.drawCircle(tx, ty, 4.5, col.r, col.g, col.b, col.a, true);
      }
      // Overlapping shiny metallic spanner/wrench
      canvas.drawLine(cx - 26, cy + 26, cx + 22, cy - 22, 6, 240, 240, 245, col.a); // Wrench shaft
      canvas.drawCircle(cx + 22, cy - 22, 10, 240, 240, 245, col.a, true); // Head
      canvas.drawCircle(cx + 22, cy - 22, 5, 0, 0, 0, 120, true); // Head open cut
      break;

    case 'gas_refill_buy':
      // Shopping cart chassis shadow
      drawShadowRect(cx - 22, cy - 12, 44, 28);
      // Cart basket
      canvas.drawRect(cx - 22, cy - 12, 44, 28, col.r, col.g, col.b, accent.a);
      canvas.drawLine(cx - 22, cy - 12, cx + 22, cy - 12, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 22, cy - 12, cx - 16, cy + 16, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx + 22, cy - 12, cx + 16, cy + 16, 4, col.r, col.g, col.b, col.a);
      canvas.drawLine(cx - 16, cy + 16, cx + 16, cy + 16, 4, col.r, col.g, col.b, col.a);
      // Basket wire grids
      canvas.drawLine(cx - 10, cy - 12, cx - 6, cy + 16, 2, col.r, col.g, col.b, detail.a);
      canvas.drawLine(cx, cy - 12, cx, cy + 16, 2, col.r, col.g, col.b, detail.a);
      canvas.drawLine(cx + 10, cy - 12, cx + 6, cy + 16, 2, col.r, col.g, col.b, detail.a);
      // Wheels
      canvas.drawCircle(cx - 10, cy + 24, 6, col.r, col.g, col.b, col.a, true);
      canvas.drawCircle(cx + 10, cy + 24, 6, col.r, col.g, col.b, col.a, true);
      // Tiny gas cylinder inside the cart
      canvas.drawRect(cx - 8, cy - 8, 16, 20, 255, 235, 180, col.a);
      canvas.drawCircle(cx, cy - 8, 8, 255, 235, 180, col.a, false);
      break;

    default:
      // Premium Star Shape
      drawShadowCircle(cx, cy, 20);
      canvas.drawCircle(cx, cy, 20, col.r, col.g, col.b, col.a, false);
      canvas.drawCircle(cx, cy, 17, col.r, col.g, col.b, accent.a, true);
      break;
  }
}

// ── Image Builder ─────────────────────────────────────────────────────────────

async function makePng(r, g, b, type) {
  const W_target = 200, H_target = 200;
  const scale = 4;
  const W = W_target * scale;
  const H = H_target * scale;

  // Render to scaled canvas (Supersampling / SSAA for gorgeous anti-aliasing)
  const canvas = new ScaledCanvas(W_target, H_target, scale);
  canvas.fillGradient(r, g, b);
  drawIcon(canvas, type);

  // Downsample high-res buffer to target 200x200
  const downsampled = Buffer.alloc(W_target * H_target * 3);
  for (let y = 0; y < H_target; y++) {
    for (let x = 0; x < W_target; x++) {
      let rSum = 0, gSum = 0, bSum = 0;
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const px = x * scale + sx;
          const py = y * scale + sy;
          const idx = (py * W + px) * 3;
          rSum += canvas.buffer[idx];
          gSum += canvas.buffer[idx + 1];
          bSum += canvas.buffer[idx + 2];
        }
      }
      const destIdx = (y * W_target + x) * 3;
      downsampled[destIdx] = Math.round(rSum / (scale * scale));
      downsampled[destIdx + 1] = Math.round(gSum / (scale * scale));
      downsampled[destIdx + 2] = Math.round(bSum / (scale * scale));
    }
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W_target, 0);
  ihdr.writeUInt32BE(H_target, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw image data — filter byte 0 (None) + RGB per row
  const raw = Buffer.alloc(H_target * (1 + W_target * 3));
  for (let y = 0; y < H_target; y++) {
    raw[y * (1 + W_target * 3)] = 0; // filter None
    const offsetDest = y * (1 + W_target * 3) + 1;
    const offsetSrc = y * W_target * 3;
    downsampled.copy(raw, offsetDest, offsetSrc, offsetSrc + W_target * 3);
  }

  const compressed = await deflateRaw(raw, { level: 9 });

  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Category definitions ───────────────────────────────────────────────────────

const MAIN = [
  ['restaurants',    220, 100,  60],  // warm orange-red — food
  ['grocery',         70, 160,  80],  // fresh green — vegetables
  ['sweets_juices',  240, 140,  60],  // amber-orange — juice/sweets
  ['anaqati',        180,  90, 160],  // soft purple — fashion/beauty
  ['wani_store',      50, 130, 200],  // brand blue — store
  ['home_projects',  140, 100,  60],  // earthy brown — home
  ['cloud_kitchens', 200,  80,  80],  // deep red — kitchen
  ['awnak',           80, 170, 160],  // teal — services/help
  ['gas_refill',      90,  90, 110],  // slate blue-grey — gas
  ['shein',          220,  80, 120],  // pink — fashion/shein
  ['spare_parts',    110, 110, 110],  // neutral grey — parts
  ['honey_dates',    200, 150,  40],  // golden amber — honey
  ['electronics',     60,  80, 180],  // blue — electronics
];

const SUB = [
  ['grocery_deals_bundle',         60, 150, 120],  // teal-green
  ['sweets_juices_fresh',         240, 160,  50],  // orange juice
  ['sweets_juices_sweets',        200,  80, 140],  // pink sweets
  ['sweets_juices_icecream',      120, 190, 220],  // ice blue
  ['anaqati_perfumes',            170,  80, 160],  // purple perfume
  ['anaqati_accessories_beauty',  220, 110, 150],  // rose beauty
  ['anaqati_clothing',            100,  80, 180],  // indigo clothing
  ['gas_refill_refill',            80,  90, 110],  // dark slate
  ['gas_refill_repair',           100, 100,  80],  // olive-grey
  ['gas_refill_buy',               60, 120, 160],  // steel blue
];

// ── Generate ──────────────────────────────────────────────────────────────────

async function run() {
  console.log('run() started - generating remaining subcategories');
  const subDir  = path.join(ROOT, 'sub');
  mkdirSync(subDir,  { recursive: true });

  let count = 0;

  for (const [id, r, g, b] of SUB) {
    const filename = `dsh-category-sub-${id}-v1.png`;
    const buf = await makePng(r, g, b, id);
    writeFileSync(path.join(subDir, filename), buf);
    console.log(`  ✓ sub/${filename}  (${(buf.length / 1024).toFixed(1)} KB)`);
    count++;
  }

  console.log(`\nDone — ${count} subcategory images generated.`);
}

run().catch(err => { console.error(err); process.exit(1); });
