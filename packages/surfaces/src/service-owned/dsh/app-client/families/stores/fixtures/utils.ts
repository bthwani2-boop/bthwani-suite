export function createFixtureImageUrl(background: string, foreground: string, label: string) {
  const bg = background.replace('#', '');
  const fg = foreground.replace('#', '');
  return `https://placehold.co/900x700/${bg}/${fg}.png?text=${encodeURIComponent(label)}`;
}
