'use client';

/**
 * ShortsApprovalsPage — مراجعة واعتماد الفيديوهات المرفوعة من الشركاء.
 * الفيديوهات تظهر في تطبيق العميل فقط بعد الموافقة من فريق التسويق.
 */
import { useI18n } from '@bthwani/ui-kit';
import { SkeletonScreen } from '../../components/SkeletonScreen';
import { CheckCircle } from 'lucide-react';

export function ShortsApprovalsPage() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('marketing.sec_shorts_approvals')}
      subtitle={t('marketing.sec_shorts_approvals_desc')}
      icon={CheckCircle}
      showComingSoon={true}
      sections={[]}
    />
  );
}
