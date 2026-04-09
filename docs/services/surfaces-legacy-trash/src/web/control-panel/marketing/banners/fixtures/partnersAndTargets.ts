/**
 * Fixtures for smart banner inputs: partners and action targets.
 * مصدر اقتراحات الإدخال الذكي — أسماء شركاء، فئات، متاجر (حتى ربط API).
 */

export interface PartnerSuggestion {
  id: string;
  name: string;
  logo_url?: string;
  /** لون تمييز افتراضي للشريك — يُطبَّق عند اختياره (Autofill) */
  accent_color?: string;
}

/** قائمة شركاء للاقتراح التلقائي عند ربط البنر بشريك. الشعار واللون يُملآن تلقائياً عند الاختيار. */
export function getPartnerSuggestions(): PartnerSuggestion[] {
  return [
    { id: 'p1', name: 'برجر داش', logo_url: 'https://picsum.photos/64?random=logo1', accent_color: '#E85D04' },
    { id: 'p2', name: 'مطعم الشرق', logo_url: 'https://picsum.photos/64?random=logo2', accent_color: '#D4A373' },
    { id: 'p3', name: 'بقالة الوفاء', logo_url: 'https://picsum.photos/64?random=logo3', accent_color: '#2D6A4F' },
    { id: 'p4', name: 'كافيه النخيل', logo_url: 'https://picsum.photos/64?random=logo4', accent_color: '#5C4D3D' },
    { id: 'p5', name: 'BURGERDASH', logo_url: 'https://picsum.photos/64?random=logo5', accent_color: '#FF5A1F' },
    { id: 'p6', name: 'متجر الإلكترونيات', accent_color: '#4361EE' },
    { id: 'p7', name: 'عروض المطاعم', accent_color: '#E85D04' },
  ];
}

/** إرجاع بيانات الشريك بالاسم للملء التلقائي (شعار، لون) */
export function getPartnerByName(name: string): PartnerSuggestion | undefined {
  const q = (name || '').trim().toLowerCase();
  if (!q) return undefined;
  return getPartnerSuggestions().find((p) => p.name.toLowerCase() === q || p.name.toLowerCase().includes(q));
}

/** اقتراحات لـ action_target حسب النوع (فئات رئيسية/فرعية، متجر، فئة داخل متجر، منتج، فيديو، أخرى) */
export function getActionTargetSuggestions(
  type: 'category' | 'store' | 'store_category' | 'main_category' | 'sub_category' | 'product' | 'video' | 'other'
): string[] {
  const byType: Record<string, string[]> = {
    main_category: ['مطاعم', 'بقالة', 'صيدلية', 'توصيل', 'تسوق', 'restaurants', 'grocery', 'pharmacy'],
    category: ['مطاعم', 'بقالة', 'صيدلية', 'تسوق', 'جمال', 'رياضة'],
    sub_category: ['مطاعم عربية', 'برجر', 'بيتزا', 'خضروات وفواكه', 'grocery_vegetables_fruits', 'restaurants_fast_food'],
    store: ['متجر ١', 'متجر ٢', 'BURGERDASH', 'مطعم الشرق', 'بقالة الوفاء'],
    store_category: ['برجر', 'بيتزا', 'مشروبات', 'حلويات'],
    product: ['منتج مميز', 'عرض الأسبوع'],
    video: [],
    other: [],
  };
  return byType[type] ?? [];
}
