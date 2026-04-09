/**
 * DSH PromoBox admin model — SSoT for CONTROL PANEL promo box screens.
 * Aligned with auto_dsh_home_get DshPromoBox.
 * صندوق ترويجي دوار واحد في صف الفئات — يعرض حتى 4 إعلانات بالتناوب.
 */

export type DshPromoBoxActionType = 'screen' | 'url' | 'deeplink' | 'subscription';

export type DshPromoBoxStatus = 'draft' | 'published';

export interface DshPromoBoxAdmin {
  id: string;
  /** إيموجي أو رمز الأيقونة */
  icon: string;
  /** نص الشارة (مثل: برو، جديد، تخفيضات) */
  badge: string;
  /** لون خلفية الشارة */
  badge_color: string;
  /** العنوان الرئيسي */
  title: string;
  /** العنوان الفرعي */
  subtitle: string;
  /** نوع الإجراء عند النقر */
  action_type: DshPromoBoxActionType;
  /** هدف الإجراء: اسم الشاشة أو الرابط */
  action_target: string;
  /** لون خلفية الصندوق */
  bg_color: string;
  /** لون النص */
  text_color: string;
  /** حالة التفعيل */
  is_active: boolean;
  /** ترتيب الظهور (الأقل = الأولوية الأعلى) */
  priority: number;
  /** حالة النشر */
  status: DshPromoBoxStatus;
  /** بداية فترة العرض (ISO datetime) - اختياري */
  starts_at?: string;
  /** نهاية فترة العرض (ISO datetime) - اختياري */
  ends_at?: string;
  /** عدد النقرات */
  click_count?: number;
  /** عدد المشاهدات */
  view_count?: number;
  /** تاريخ الإنشاء */
  created_at?: string;
  /** تاريخ آخر تعديل */
  updated_at?: string;
}

export const PROMO_BOX_ACTION_TYPES: DshPromoBoxActionType[] = [
  'screen',
  'url',
  'deeplink',
  'subscription',
];

export const PROMO_BOX_STATUSES: DshPromoBoxStatus[] = ['draft', 'published'];

/** الحد الأقصى للإعلانات النشطة في الصندوق الدوار */
export const MAX_ACTIVE_PROMO_BOXES = 4;

/** ألوان مقترحة للخلفية */
export const SUGGESTED_BG_COLORS = [
  { value: '#0A2F5C', label: 'Navy' },
  { value: '#EF4444', label: 'Red' },
  { value: '#10B981', label: 'Green' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#14B8A6', label: 'Teal' },
];

/** ألوان مقترحة للشارة */
export const SUGGESTED_BADGE_COLORS = [
  { value: '#FF500D', label: 'BTHWANI Orange' },
  { value: '#EF4444', label: 'Red' },
  { value: '#10B981', label: 'Green' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#F59E0B', label: 'Amber' },
];

/** شاشات DSH المتاحة للربط */
export const DSH_SCREENS = [
  { value: 'DshSubscriptionGet', label: 'اشتراك برو' },
  { value: 'DshOffersGet', label: 'العروض' },
  { value: 'DshStoresList', label: 'قائمة المتاجر' },
  { value: 'DshCategoriesList', label: 'قائمة الفئات' },
  { value: 'DshOrdersHistory', label: 'سجل الطلبات' },
  { value: 'DshCartGet', label: 'السلة' },
  { value: 'DshProfileGet', label: 'الملف الشخصي' },
];

/** إيموجيات مقترحة */
export const SUGGESTED_ICONS = [
  '👑', '🔥', '🎉', '🌙', '⭐', '💎', '🚀', '🎁',
  '💰', '🏷️', '🛒', '❤️', '✨', '🎯', '🎪', '🌟',
];

