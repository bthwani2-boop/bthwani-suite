/**
 * Fixture for CONTROL PANEL DSH banners (list/form).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 * مصدر وحيد للبيانات التجريبية؛ لا مووكاب داخل الشاشات أو المخزن.
 */
import type { DshBannerAdmin } from '../types';

/** بذرة بنرات للتجريب في لوحة التحكم. للاستخدام من mockBannersStore فقط حتى ربط API. */
export function getDshBannersAdminSeed(): DshBannerAdmin[] {
  return [
    {
      id: 'b1',
      title: 'عرض المطاعم',
      image_url: 'https://picsum.photos/400/220?random=1',
      action_type: 'main_category',
      action_target: 'restaurants',
      position: 1,
      status: 'published',
      schedule_type: 'always',
      click_count: 0,
      view_count: 0,
    },
    {
      id: 'b2',
      title: 'تسوق البقالة',
      image_url: 'https://picsum.photos/400/220?random=2',
      action_type: 'sub_category',
      action_target: 'grocery',
      action_extra: 'grocery_vegetables_fruits',
      position: 2,
      status: 'draft',
      schedule_type: 'scheduled',
      schedule_start: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      schedule_end: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
      schedule_time_start: '09:00',
      schedule_time_end: '22:00',
      click_count: 0,
      view_count: 0,
    },
  ];
}

