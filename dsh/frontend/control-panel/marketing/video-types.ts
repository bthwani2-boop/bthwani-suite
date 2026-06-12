import type {
  MarketingVideoStatus,
  MarketingVideoAudience,
  MarketingVideoSource,
  MarketingVideoTargetType,
} from '../../data/legacy-preview/marketing.preview-data';

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

export type EditorWorkspaceTab = 'content' | 'media' | 'target' | 'publish';

export const TARGET_TYPE_OPTIONS: Array<{
  value: MarketingVideoTargetType;
  label: string;
  description: string;
}> = [
  { value: 'home', label: 'الرئيسية', description: 'يعيد المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح قائمة المتاجر أو تجربة التصفح العامة.' },
  { value: 'store', label: 'متجر', description: 'يربط الفيديو بمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يربط الفيديو بفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يربط الفيديو بمنتج داخل متجر المحدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض متجرًا فيه عرض نشط وملفت.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح وجهة حملات عامة ضمن القناة الحالية.' },
  { value: 'search', label: 'بحث', description: 'يفتح واجهة البحث.' },
  { value: 'custom', label: 'مخصص', description: 'مسار محدود ومضبوط عندما لا تكفي الخيارات المنظمة.' },
];
