function normalizeFixtureHexColor(value: string, fallback: string) {
  const raw = (value || fallback).trim().replace('#', '');
  const isValid = /^[0-9a-fA-F]{6}$/.test(raw);

  return `#${isValid ? raw.toUpperCase() : fallback.replace('#', '').toUpperCase()}`;
}

function escapeFixtureSvgText(value: string) {
  return (value || 'BTHWANI')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .slice(0, 24)
    .toUpperCase();
}

export function createFixtureImageUrl(background: string, foreground: string, label: string) {
  const bg = normalizeFixtureHexColor(background, '#F97316');
  const fg = normalizeFixtureHexColor(foreground, '#FFFFFF');
  const safeLabel = escapeFixtureSvgText(label);

  const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 700'>
  <rect width='900' height='700' rx='52' fill='${bg}'/>
  <text x='50%' y='53%' font-family='Inter, Arial, Helvetica, sans-serif' font-size='96' font-weight='800' fill='${fg}' text-anchor='middle' dominant-baseline='middle'>${safeLabel}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
