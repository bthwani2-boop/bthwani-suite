'use client';

/**
 * PartnerShortsPage — رفع الفيديوهات (شورتات) من الشريك.
 * الفيديوهات تحتاج موافقة فريق التسويق قبل الظهور في تطبيق العميل.
 */
import React, { useCallback, useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { SectionScreenTemplate } from '../../components/SectionScreenTemplate';
import { Video, Upload, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type PartnerShortStatus = 'pending' | 'approved' | 'rejected';

export interface PartnerShortItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  status: PartnerShortStatus;
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function PartnerShortsPage() {
  const { t } = useI18n();
  const [shorts, setShorts] = useState<PartnerShortItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = useCallback(() => {
    setUploading(true);
    // Deferred: multipart upload via partner media endpoint when available.
    setTimeout(() => {
      setUploading(false);
      alert(t('web.control panel.partner.shorts.uploadComingSoon'));
    }, 500);
  }, [t]);

  const getStatusBadge = (status: PartnerShortStatus) => {
    const config = {
      pending: {
        icon: Clock,
        label: t('web.control panel.partner.shorts.statusPending'),
        bg: semanticRoles.stateInfo.background,
        color: semanticRoles.stateInfo.icon,
      },
      approved: {
        icon: CheckCircle,
        label: t('web.control panel.partner.shorts.statusApproved'),
        bg: semanticRoles.stateSuccess.background,
        color: semanticRoles.stateSuccess.icon,
      },
      rejected: {
        icon: XCircle,
        label: t('web.control panel.partner.shorts.statusRejected'),
        bg: semanticRoles.stateError.background,
        color: semanticRoles.stateError.icon,
      },
    };
    const c = config[status];
    const Icon = c.icon;
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: c.bg, color: c.color }}
      >
        <Icon className="h-3.5 w-3.5" />
        {c.label}
      </span>
    );
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <SectionScreenTemplate
      title={t('web.control panel.partner.shorts.title')}
      subtitle={t('web.control panel.partner.shorts.subtitle')}
      icon={Video}
      primaryAction={
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
          style={{
            backgroundColor: semanticRoles.accent,
            color: semanticRoles.accentContrast,
          }}
        >
          <Upload className="h-4 w-4" />
          {uploading ? t('web.control panel.partner.shorts.uploading') : t('web.control panel.partner.shorts.upload')}
        </button>
      }
    >
      {/* Approval workflow notice */}
      <div
        className="mb-6 rounded-lg p-4 flex gap-3"
        style={{
          backgroundColor: semanticRoles.stateInfo.background,
          borderColor: semanticRoles.border,
          border: '1px solid',
        }}
      >
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: semanticRoles.stateInfo.icon }} />
        <div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: semanticRoles.text }}>
            {t('web.control panel.partner.shorts.approvalNoticeTitle')}
          </h3>
          <p className="text-sm" style={{ color: semanticRoles.textSecondary }}>
            {t('web.control panel.partner.shorts.approvalNoticeDesc')}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {shorts.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center border"
            style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
          >
            <Video className="h-12 w-12 mx-auto mb-4 opacity-40" style={{ color: semanticRoles.textSecondary }} />
            <p className="font-medium mb-2" style={{ color: semanticRoles.text }}>
              {t('web.control panel.partner.shorts.emptyTitle')}
            </p>
            <p className="text-sm mb-4" style={{ color: semanticRoles.textSecondary }}>
              {t('web.control panel.partner.shorts.emptyDesc')}
            </p>
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
              style={{
                backgroundColor: semanticRoles.accent,
                color: semanticRoles.accentContrast,
              }}
            >
              <Upload className="h-4 w-4" />
              {t('web.control panel.partner.shorts.upload')}
            </button>
          </div>
        ) : (
          shorts.map((s) => (
            <div
              key={s.id}
              className="rounded-lg p-4 border flex flex-wrap items-center justify-between gap-4"
              style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-20 h-12 rounded shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: semanticRoles.border }}
                >
                  {s.thumbnailUrl ? (
                    <img src={s.thumbnailUrl} alt="" className="w-full h-full object-cover rounded" />
                  ) : (
                    <Video className="h-6 w-6" style={{ color: semanticRoles.textSecondary }} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: semanticRoles.text }}>
                    {s.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: semanticRoles.textSecondary }}>
                    {t('web.control panel.partner.shorts.uploadedAt')}: {formatDate(s.uploadedAt)}
                    {s.reviewedAt && ` • ${t('web.control panel.partner.shorts.reviewedAt')}: ${formatDate(s.reviewedAt)}`}
                  </p>
                  {s.rejectionReason && (
                    <p className="text-xs mt-1" style={{ color: semanticRoles.stateError.icon }}>
                      {t('web.control panel.partner.shorts.rejectionReason')}: {s.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
              <div className="shrink-0">{getStatusBadge(s.status)}</div>
            </div>
          ))
        )}
      </div>
    </SectionScreenTemplate>
  );
}

