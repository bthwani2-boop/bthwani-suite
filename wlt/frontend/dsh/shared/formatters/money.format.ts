export { formatWltYer } from '../boundary/dshFinance.types';

export function formatYerAmount(amountYer: number): string {
  return `${amountYer.toLocaleString('ar-YE')} ر.ي`;
}
