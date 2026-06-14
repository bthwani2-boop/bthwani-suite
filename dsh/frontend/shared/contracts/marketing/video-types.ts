// Canonical location: dsh/frontend/shared/contracts/marketing/video-types.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/video-types.ts

type MarketingVideoStatus = 'published' | 'draft' | 'review' | 'paused';
type MarketingVideoAudience = 'all' | 'client' | 'operations';
type MarketingVideoSource = 'marketing' | 'partner';
type MarketingVideoTargetType = 'home' | 'stores' | 'store' | 'category' | 'subcategory' | 'product' | 'offer' | 'campaign' | 'search' | 'custom' | 'loyalty';

export type VideoDraft = Record<
  | 'title'
  | 'subtitle'
  | 'videoUrl'
  | 'posterUrl'
  | 'durationSeconds'
  | 'ctaLabel'
  | 'highlight'
  | 'targetId'
  | 'targetExtra'
  | 'order',
  string
> & {
  id?: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  targetType: MarketingVideoTargetType;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

export type VideoEditorWorkspaceTab = 'content' | 'media' | 'target' | 'publish';

export const VIDEO_TARGET_TYPE_OPTIONS: Array<{
  value: MarketingVideoTargetType;
  label: string;
  description: string;
}> = [
  { value: 'home', label: 'الرئيسية', description: 'يُوجه المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح لائحة المتاجر من صفحة التصفح الرئيسية.' },
  { value: 'store', label: 'متجر', description: 'يُوجه الفيديو لمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يُوجه الفيديو لفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يُوجه الفيديو لمنتج داخل المتجر المحدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض مستواها قيد عرض غير ملزم.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح واجهة حملة رابحة ذمن اللوحة الحالية.' },
  { value: 'search', label: 'بحث', description: 'يفتح واجهة البحث.' },
  { value: 'custom', label: 'مخصص', description: 'مساق محدد ومأخوذ رابطها لا يعكس الخيارات الملزمة.' },
];
