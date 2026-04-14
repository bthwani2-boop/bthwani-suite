export type MarketingNewsTickerLocale = 'ar' | 'en';

export type MarketingNewsTickerFixture = {
  id: string;
  openHour: number;
  closeHour: number;
  openStatusLabelAr: string;
  closedStatusLabelAr: string;
  openStatusLabelEn: string;
  closedStatusLabelEn: string;
  openMessageAr: string;
  closedMessageAr: string;
  openMessageEn: string;
  closedMessageEn: string;
};

export type MarketingNewsTickerPreview = {
  fixture: MarketingNewsTickerFixture;
  isOpen: boolean;
  statusLabel: string;
  message: string;
  windowLabel: string;
};

export const marketingNewsTickerFixture: MarketingNewsTickerFixture = {
  id: 'dsh-marketing-news-ticker',
  openHour: 8,
  closeHour: 23,
  openStatusLabelAr: 'مباشر',
  closedStatusLabelAr: 'مغلق',
  openStatusLabelEn: 'Live',
  closedStatusLabelEn: 'Closed',
  openMessageAr: 'المساحة مخصصة للشريط الإخباري • عدّل النص هنا ثم راقب المعاينة في التطبيق',
  closedMessageAr: 'خارج الدوام تظهر المساحة مغلقة مع بقاء المسارات محفوظة للعودة لاحقًا',
  openMessageEn: 'This space is reserved for the news ticker • edit the copy here and preview it in the app',
  closedMessageEn: 'Outside operating hours the space stays closed while the routes remain preserved for later return',
};

function isWithinOperatingHours(now: Date, openHour: number, closeHour: number) {
  const currentHour = now.getHours();

  if (openHour === closeHour) {
    return true;
  }

  if (openHour < closeHour) {
    return currentHour >= openHour && currentHour < closeHour;
  }

  return currentHour >= openHour || currentHour < closeHour;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function resolveMarketingTickerPreview(
  now: Date,
  locale: MarketingNewsTickerLocale,
  fixture: MarketingNewsTickerFixture = marketingNewsTickerFixture,
): MarketingNewsTickerPreview {
  const isOpen = isWithinOperatingHours(now, fixture.openHour, fixture.closeHour);
  const isEnglish = locale === 'en';

  return {
    fixture,
    isOpen,
    statusLabel: isOpen
      ? isEnglish
        ? fixture.openStatusLabelEn
        : fixture.openStatusLabelAr
      : isEnglish
        ? fixture.closedStatusLabelEn
        : fixture.closedStatusLabelAr,
    message: isOpen
      ? isEnglish
        ? fixture.openMessageEn
        : fixture.openMessageAr
      : isEnglish
        ? fixture.closedMessageEn
        : fixture.closedMessageAr,
    windowLabel: `${formatHour(fixture.openHour)} - ${formatHour(fixture.closeHour)}`,
  };
}