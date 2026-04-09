/**
 * DSH Banner admin model — SSoT for CONTROL PANEL banner screens.
 * Aligned with auto_dsh_home_get DshBanner and DSH_BANNERS_FORENSIC_ANALYSIS.md.
 */
export type DshBannerActionType =
  | 'offer'
  | 'main_category'
  | 'sub_category'
  | 'store'
  | 'external'
  | 'store_category'
  | 'product'
  | 'subscription'
  | 'category'
  | 'support'
  | 'cart'
  | 'orders'
  | 'addresses'
  | 'video'   /** عند النقر يفتح الفيديو في ريلز الفيديوهات */
  | 'other';  /** أخرى — إدخال مخصص يظهر في القائمة لاحقاً */

/** شكل البنر في العرض */
export type DshBannerAspectRatio = 'rectangle' | 'square' | '16:9' | '4:3';

/** حركة/أنيميشن البنر في الكاروسيل */
export type DshBannerAnimationType = 'none' | 'slide' | 'fade';

/** حالة البنر: مسودة (لا تُعرض) أو منشور */
export type DshBannerStatus = 'draft' | 'published';

/** نوع الجدولة: دائم أو ضمن أوقات محددة */
export type DshBannerScheduleType = 'always' | 'scheduled';

export interface DshBannerAdmin {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  action_type?: DshBannerActionType;
  action_target?: string;
  action_extra?: string;
  accent_color?: string;
  action_url?: string;
  position?: number;
  /** إعدادات العرض: مربع أم مستطيل ونسبة العرض */
  aspect_ratio?: DshBannerAspectRatio;
  /** حركة البنر في الكاروسيل */
  animation_type?: DshBannerAnimationType;
  /** اسم الشريك (للربط والاقتراح الذكي) */
  partner_name?: string;
  /** رابط صورة شعار الشريك — تُعرض داخل البنر كطبقة */
  partner_logo_url?: string;
  /** نص شارة العرض (مثل: 50% OFF) — تُعرض داخل البنر */
  offer_badge_text?: string;
  /** تفاصيل العرض (مثل: CODE: DASH50) — داخل البنر */
  offer_detail_text?: string;
  /** عدد النقرات على البنر (تحليلات) */
  click_count?: number;
  /** تفعيل منطقة مظللة على جزء من الصورة لظهور الشعار وتفاصيل العرض */
  overlay_enabled?: boolean;
  /** جهة المنطقة المظللة: start = بداية الاتجاه، end = نهاية الاتجاه */
  overlay_side?: 'start' | 'end';
  /** عرض المنطقة المظللة كنسبة مئوية (مثلاً 40 = نحو 40٪ من البنر) */
  overlay_width_percent?: number;
  /** لون التظليل (مثلاً #000000) */
  overlay_color?: string;
  /** شفافية التظليل 0–1 (مثلاً 0.6) */
  overlay_opacity?: number;
  /** حالة النشر: مسودة أو منشور */
  status?: DshBannerStatus;
  /** جدولة العرض: دائم أو مجدول */
  schedule_type?: DshBannerScheduleType;
  /** بداية فترة العرض (ISO datetime) */
  schedule_start?: string;
  /** نهاية فترة العرض (ISO datetime) */
  schedule_end?: string;
  /** أيام العرض 0=الأحد..6=السبت (فارغ = كل الأيام) */
  schedule_days?: number[];
  /** بداية وقت العرض يومياً (مثل 09:00) */
  schedule_time_start?: string;
  /** نهاية وقت العرض يومياً (مثل 22:00) */
  schedule_time_end?: string;
  /** حد أقصى للكمية — عند استهلاكه يتوقف عرض البنر */
  cap_quantity?: number;
  /** كمية مستهلكة حتى الآن (نقرات أو وحدات) */
  cap_used?: number;
  /** عدد المشاهدات (للاعتماد على API لاحقاً) */
  view_count?: number;
}

export const ASPECT_RATIOS: DshBannerAspectRatio[] = ['rectangle', 'square', '16:9', '4:3'];
export const ANIMATION_TYPES: DshBannerAnimationType[] = ['none', 'slide', 'fade'];
export const BANNER_STATUSES: DshBannerStatus[] = ['draft', 'published'];
export const SCHEDULE_TYPES: DshBannerScheduleType[] = ['always', 'scheduled'];
/** أيام الأسبوع 0=الأحد .. 6=السبت */
export const WEEKDAY_KEYS = [0, 1, 2, 3, 4, 5, 6] as const;

/** action_type values that require action_target and/or action_extra in the form */
export const ACTION_TYPES_WITH_TARGET: DshBannerActionType[] = [
  'main_category',
  'category',
  'sub_category',
  'store',
  'external',
  'store_category',
  'product',
  'video',  /** action_extra = رابط الفيديو */
  'other', /** action_extra = تسمية مخصصة */
];

export const ACTION_TYPES: DshBannerActionType[] = [
  'offer',
  'main_category',
  'sub_category',
  'store',
  'external',
  'store_category',
  'product',
  'subscription',
  'category',
  'support',
  'cart',
  'orders',
  'addresses',
  'video',
  'other',
];

