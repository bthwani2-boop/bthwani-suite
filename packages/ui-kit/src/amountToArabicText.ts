export function amountToArabicText(n: number, t: (key: string) => string): string {
  if (n <= 0) return t('surfaces.صفر');
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  const andStr = t('surfaces.and') || ' و ';
  const hundredStr = t('surfaces.hundred') || ' مائة ';

  function inner(x: number): string {
    if (x >= 1000) {
      const k = Math.floor(x / 1000);
      const rest = x % 1000;
      const kStr = k <= 19 ? (k === 10 ? 'عشرة' : k === 11 ? 'أحد عشر' : k < 10 ? ones[k] : ones[k % 10] + ' عشر') : k < 100 ? (tens[Math.floor(k / 10)] + (k % 10 ? andStr + ones[k % 10] : '')) : hundreds[Math.floor(k / 100)] + (k % 100 ? andStr + inner(k % 100) : '');
      const thousandWord = k === 2 ? t('surfaces.ألفان') : k >= 3 && k <= 10 ? ones[k] + ' آلاف' : kStr + ' ألف';
      return rest > 0 ? thousandWord + andStr + inner(rest) : thousandWord;
    }
    if (x >= 100) {
      const h = Math.floor(x / 100);
      const r = x % 100;
      return (hundreds[h] || inner(h) + hundredStr) + (r > 0 ? andStr + inner(r) : '');
    }
    if (x >= 20) return (x % 10 ? ones[x % 10] + andStr : '') + tens[Math.floor(x / 10)];
    if (x >= 10) return x === 10 ? t('surfaces.عشرة') : ones[x % 10] + ' عشر';
    return ones[x] || String(x);
  }

  return inner(n);
}

export default amountToArabicText;