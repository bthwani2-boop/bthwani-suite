'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import type {
  DshBannerAdmin,
  DshBannerActionType,
  DshBannerAspectRatio,
  DshBannerAnimationType,
  DshBannerStatus,
  DshBannerScheduleType,
} from '../types';
import {
  ACTION_TYPES,
  ACTION_TYPES_WITH_TARGET,
  ASPECT_RATIOS,
  ANIMATION_TYPES,
  BANNER_STATUSES,
  SCHEDULE_TYPES,
  WEEKDAY_KEYS,
} from '../types';
import { getPartnerSuggestions, getPartnerByName } from '../fixtures/partnersAndTargets';
import { getActionTargetSuggestions } from '../fixtures/partnersAndTargets';
import {
  getCustomTargets,
  addCustomTarget,
  getCustomActionTypes,
  addCustomActionType,
} from '../customBannerTargetsStore';
import { BANNER_TEMPLATES, type BannerTemplate } from '../fixtures/bannerTemplates';
import { getCustomTemplates } from '../customBannerTemplatesStore';
import { SmartCombobox } from './SmartCombobox';

interface BannerFormProps {
  initialValues: Partial<DshBannerAdmin>;
  onSubmit: (values: DshBannerAdmin) => void;
  onCancel: () => void;
  isEdit: boolean;
  nextPosition?: number;
  saving?: boolean;
  /** عند التغيير يُستدعى لربط المعاينة الحية (اختياري) */
  onValuesChange?: (values: Partial<DshBannerAdmin>) => void;
  /** يحدّث عند إضافة قالب مخصص ليعيد النموذج تحميل قائمة القوالب */
  customTemplatesVersion?: number;
}

export function BannerForm({
  initialValues,
  onSubmit,
  onCancel,
  isEdit,
  nextPosition = 1,
  saving = false,
  onValuesChange,
  customTemplatesVersion = 0,
}: BannerFormProps) {
  const { t } = useI18n();
  const [image_url, setImage_url] = useState(initialValues.image_url ?? '');
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [action_type, setAction_type] = useState<DshBannerActionType>(
    (initialValues.action_type as DshBannerActionType) ?? 'offer'
  );
  const [action_target, setAction_target] = useState(initialValues.action_target ?? '');
  const [action_extra, setAction_extra] = useState(initialValues.action_extra ?? '');
  const [accent_color, setAccent_color] = useState(initialValues.accent_color ?? '');
  const [position, setPosition] = useState(
    initialValues.position ?? nextPosition
  );
  const [aspect_ratio, setAspect_ratio] = useState<DshBannerAspectRatio>(
    initialValues.aspect_ratio ?? 'rectangle'
  );
  const [animation_type, setAnimation_type] = useState<DshBannerAnimationType>(
    initialValues.animation_type ?? 'slide'
  );
  const [partner_name, setPartner_name] = useState(initialValues.partner_name ?? '');
  const [partner_logo_url, setPartner_logo_url] = useState(initialValues.partner_logo_url ?? '');
  const [offer_badge_text, setOffer_badge_text] = useState(initialValues.offer_badge_text ?? '');
  const [offer_detail_text, setOffer_detail_text] = useState(initialValues.offer_detail_text ?? '');
  const [overlay_enabled, setOverlay_enabled] = useState(initialValues.overlay_enabled ?? false);
  const [overlay_side, setOverlay_side] = useState<'start' | 'end'>(
    initialValues.overlay_side ?? 'end'
  );
  const [overlay_width_percent, setOverlay_width_percent] = useState(
    initialValues.overlay_width_percent ?? 40
  );
  const [overlay_color, setOverlay_color] = useState(initialValues.overlay_color ?? '#000000');
  const [overlay_opacity, setOverlay_opacity] = useState(
    initialValues.overlay_opacity ?? 0.65
  );
  const [status, setStatus] = useState<DshBannerStatus>(initialValues.status ?? 'draft');
  const [schedule_type, setSchedule_type] = useState<DshBannerScheduleType>(
    initialValues.schedule_type ?? 'always'
  );
  const [schedule_start, setSchedule_start] = useState(initialValues.schedule_start ?? '');
  const [schedule_end, setSchedule_end] = useState(initialValues.schedule_end ?? '');
  const [schedule_days, setSchedule_days] = useState<number[]>(initialValues.schedule_days ?? []);
  const [schedule_time_start, setSchedule_time_start] = useState(
    initialValues.schedule_time_start ?? '09:00'
  );
  const [schedule_time_end, setSchedule_time_end] = useState(
    initialValues.schedule_time_end ?? '22:00'
  );
  const [cap_quantity, setCap_quantity] = useState<string>(
    initialValues.cap_quantity != null ? String(initialValues.cap_quantity) : ''
  );

  const emit = useCallback(
    (partial: Partial<DshBannerAdmin>) => {
      onValuesChange?.(partial);
    },
    [onValuesChange]
  );

  const showTarget = useMemo(
    () => ACTION_TYPES_WITH_TARGET.includes(action_type),
    [action_type]
  );
  const showExtra = useMemo(
    () =>
      ['sub_category', 'store_category', 'product', 'video', 'other'].includes(action_type),
    [action_type]
  );

  const showVideoUrl = action_type === 'video';
  const showOtherTypeLabel = action_type === 'other';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | undefined;
    const saveAs = submitter?.getAttribute('value');
    const newStatus: DshBannerStatus = saveAs === 'publish' ? 'published' : 'draft';
    const capNum = cap_quantity.trim() ? parseInt(cap_quantity.trim(), 10) : undefined;
    const capValid = capNum != null && !Number.isNaN(capNum) && capNum > 0 ? capNum : undefined;
    onSubmit({
      id: initialValues.id ?? '',
      image_url: image_url.trim() || undefined,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      action_type,
      action_target: action_target.trim() || undefined,
      action_extra: action_extra.trim() || undefined,
      accent_color: accent_color.trim() || undefined,
      position: position || undefined,
      aspect_ratio,
      animation_type,
      partner_name: partner_name.trim() || undefined,
      partner_logo_url: partner_logo_url.trim() || undefined,
      offer_badge_text: offer_badge_text.trim() || undefined,
      offer_detail_text: offer_detail_text.trim() || undefined,
      overlay_enabled: overlay_enabled || undefined,
      overlay_side: overlay_enabled ? overlay_side : undefined,
      overlay_width_percent: overlay_enabled ? overlay_width_percent : undefined,
      overlay_color: overlay_enabled ? overlay_color.trim() || undefined : undefined,
      overlay_opacity: overlay_enabled ? overlay_opacity : undefined,
      status: newStatus,
      schedule_type: schedule_type,
      schedule_start: schedule_type === 'scheduled' && schedule_start.trim() ? schedule_start.trim() : undefined,
      schedule_end: schedule_type === 'scheduled' && schedule_end.trim() ? schedule_end.trim() : undefined,
      schedule_days: schedule_type === 'scheduled' && schedule_days.length > 0 ? schedule_days : undefined,
      schedule_time_start: schedule_type === 'scheduled' && schedule_time_start ? schedule_time_start : undefined,
      schedule_time_end: schedule_type === 'scheduled' && schedule_time_end ? schedule_time_end : undefined,
      cap_quantity: capValid,
      cap_used: initialValues.cap_used,
      click_count: initialValues.click_count,
      view_count: initialValues.view_count,
    });
  };

  const partnerOptions = useMemo(
    () => getPartnerSuggestions().map((p) => ({ id: p.id, label: p.name })),
    []
  );
  const fixtureTargetType = useMemo(
    () =>
      action_type === 'main_category'
        ? 'main_category'
        : action_type === 'sub_category'
          ? 'sub_category'
          : action_type === 'store'
            ? 'store'
            : action_type === 'store_category'
              ? 'store_category'
              : action_type === 'product'
                ? 'product'
                : action_type === 'video'
                  ? 'video'
                  : action_type === 'other'
                    ? 'other'
                    : 'category',
    [action_type]
  );

  const targetOptions = useMemo(() => {
    const fromFixtures = getActionTargetSuggestions(fixtureTargetType);
    const fromCustom = getCustomTargets(action_type);
    const combined = Array.from(new Set([...fromFixtures, ...fromCustom]));
    return combined.map((s) => ({ id: s, label: s }));
  }, [action_type, fixtureTargetType]);

  const allTemplates = useMemo(
    () => [
      ...BANNER_TEMPLATES,
      ...getCustomTemplates().map((t) => ({ id: t.id, name: t.name, apply: t.apply })),
    ],
    [customTemplatesVersion]
  );

  const applyTemplate = useCallback(
    (template: BannerTemplate) => {
      const a = template.apply;
      const merged: Partial<DshBannerAdmin> = {
        image_url: (a.image_url ?? image_url) || undefined,
        title: (a.title ?? title) || undefined,
        description: (a.description ?? description) || undefined,
        action_type: a.action_type ?? action_type,
        action_target: (a.action_target ?? action_target) || undefined,
        action_extra: (a.action_extra ?? action_extra) || undefined,
        accent_color: (a.accent_color ?? accent_color) || undefined,
        position: a.position ?? position,
        aspect_ratio: a.aspect_ratio ?? aspect_ratio,
        animation_type: a.animation_type ?? animation_type,
        partner_name: (a.partner_name ?? partner_name) || undefined,
        partner_logo_url: (a.partner_logo_url ?? partner_logo_url) || undefined,
        offer_badge_text: (a.offer_badge_text ?? offer_badge_text) || undefined,
        offer_detail_text: (a.offer_detail_text ?? offer_detail_text) || undefined,
        overlay_enabled: a.overlay_enabled ?? overlay_enabled,
        overlay_side: a.overlay_side ?? overlay_side,
        overlay_width_percent: a.overlay_width_percent ?? overlay_width_percent,
        overlay_color: a.overlay_color ?? overlay_color,
        overlay_opacity: a.overlay_opacity ?? overlay_opacity,
        status: a.status ?? status,
        schedule_type: a.schedule_type ?? schedule_type,
        schedule_start: a.schedule_start ?? schedule_start,
        schedule_end: a.schedule_end ?? schedule_end,
        schedule_days: a.schedule_days ?? schedule_days,
        schedule_time_start: a.schedule_time_start ?? schedule_time_start,
        schedule_time_end: a.schedule_time_end ?? schedule_time_end,
        cap_quantity: a.cap_quantity ?? (cap_quantity.trim() ? parseInt(cap_quantity, 10) : undefined),
      };
      setImage_url(merged.image_url ?? '');
      setTitle(merged.title ?? '');
      setDescription(merged.description ?? '');
      setAction_type((merged.action_type as DshBannerActionType) ?? 'offer');
      setAction_target(merged.action_target ?? '');
      setAction_extra(merged.action_extra ?? '');
      setAccent_color(merged.accent_color ?? '');
      if (merged.position !== undefined) setPosition(merged.position);
      setAspect_ratio(merged.aspect_ratio ?? 'rectangle');
      setAnimation_type(merged.animation_type ?? 'slide');
      setPartner_name(merged.partner_name ?? '');
      setPartner_logo_url(merged.partner_logo_url ?? '');
      setOffer_badge_text(merged.offer_badge_text ?? '');
      setOffer_detail_text(merged.offer_detail_text ?? '');
      setOverlay_enabled(merged.overlay_enabled ?? false);
      setOverlay_side(merged.overlay_side ?? 'end');
      setOverlay_width_percent(merged.overlay_width_percent ?? 40);
      setOverlay_color(merged.overlay_color ?? '#000000');
      setOverlay_opacity(merged.overlay_opacity ?? 0.65);
      setStatus(merged.status ?? 'draft');
      setSchedule_type(merged.schedule_type ?? 'always');
      setSchedule_start(merged.schedule_start ?? '');
      setSchedule_end(merged.schedule_end ?? '');
      setSchedule_days(merged.schedule_days ?? []);
      setSchedule_time_start(merged.schedule_time_start ?? '09:00');
      setSchedule_time_end(merged.schedule_time_end ?? '22:00');
      setCap_quantity(merged.cap_quantity != null ? String(merged.cap_quantity) : '');
      onValuesChange?.(merged);
    },
    [
      image_url,
      title,
      description,
      action_type,
      action_target,
      action_extra,
      accent_color,
      position,
      aspect_ratio,
      animation_type,
      partner_name,
      partner_logo_url,
      offer_badge_text,
      offer_detail_text,
      overlay_enabled,
      overlay_side,
      overlay_width_percent,
      overlay_color,
      overlay_opacity,
      status,
      schedule_type,
      schedule_start,
      schedule_end,
      schedule_days,
      schedule_time_start,
      schedule_time_end,
      cap_quantity,
      onValuesChange,
    ]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isEdit && (
        <div className="rounded-lg border p-3" style={{ borderColor: semanticRoles.border }}>
          <p className="mb-2 text-xs font-semibold" style={{ color: semanticRoles.textSecondary }}>
            {t('marketing.banners_templates_section')}
          </p>
          <div className="flex flex-wrap gap-2">
            {allTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template)}
                className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                style={{
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                  backgroundColor: semanticRoles.surface,
                }}
              >
                {template.name ?? t(`marketing.banners_template_${template.id}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_form_image_url')} <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={image_url}
          onChange={(e) => {
            const v = e.target.value;
            setImage_url(v);
            emit({ image_url: v || undefined });
          }}
          placeholder={t('marketing.banners_form_image_url_placeholder')}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_form_title_label')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            const v = e.target.value;
            setTitle(v);
            emit({ title: v || undefined });
          }}
          placeholder={t('marketing.banners_form_title_placeholder')}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_form_description')}
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            const v = e.target.value;
            setDescription(v);
            emit({ description: v || undefined });
          }}
          placeholder={t('marketing.banners_form_description_placeholder')}
          rows={2}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        />
      </div>

      <details
        className="rounded-lg border group"
        style={{ borderColor: semanticRoles.border }}
        open
      >
        <summary
          className="cursor-pointer list-none px-4 py-3 text-sm font-semibold select-none rounded-lg"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_overlay_section')}
        </summary>
        <div className="px-4 pb-4 pt-0 space-y-4">
        <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>
          {t('marketing.banners_type_to_search')}
        </p>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_partner_name')}
            </label>
            <SmartCombobox
              value={partner_name}
              onChange={(v) => {
                setPartner_name(v);
                const partner = v ? getPartnerByName(v) : undefined;
                if (partner) {
                  setPartner_logo_url(partner.logo_url ?? '');
                  setAccent_color(partner.accent_color ?? '');
                  emit({
                    partner_name: v || undefined,
                    partner_logo_url: partner.logo_url,
                    accent_color: partner.accent_color,
                  });
                } else {
                  emit({ partner_name: v || undefined });
                }
              }}
              options={partnerOptions}
              placeholder={t('marketing.banners_partner_name_placeholder')}
              searchPlaceholder={t('marketing.banners_type_to_search')}
              aria-label={t('marketing.banners_partner_name')}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_partner_logo_url')}
            </label>
            <input
              type="url"
              value={partner_logo_url}
              onChange={(e) => {
                const v = e.target.value;
                setPartner_logo_url(v);
                emit({ partner_logo_url: v || undefined });
              }}
              placeholder={t('marketing.banners_partner_logo_placeholder')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
                backgroundColor: semanticRoles.surface,
              }}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_offer_badge')}
            </label>
            <input
              type="text"
              value={offer_badge_text}
              onChange={(e) => {
                const v = e.target.value;
                setOffer_badge_text(v);
                emit({ offer_badge_text: v || undefined });
              }}
              placeholder={t('marketing.banners_offer_badge_placeholder')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
                backgroundColor: semanticRoles.surface,
              }}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_offer_detail')}
            </label>
            <input
              type="text"
              value={offer_detail_text}
              onChange={(e) => {
                const v = e.target.value;
                setOffer_detail_text(v);
                emit({ offer_detail_text: v || undefined });
              }}
              placeholder={t('marketing.banners_offer_detail_placeholder')}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
                backgroundColor: semanticRoles.surface,
              }}
            />
          </div>
        </div>
      </details>

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_form_action_type')} <span className="text-red-500">*</span>
        </label>
        <select
          value={action_type}
          onChange={(e) => {
            const v = e.target.value as DshBannerActionType;
            setAction_type(v);
            emit({ action_type: v });
          }}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        >
          {ACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`marketing.banners_action_type_${type}`)}
            </option>
          ))}
        </select>
      </div>

      {showTarget && showVideoUrl && (
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: semanticRoles.text }}
          >
            {t('marketing.banners_video_url_label')}
          </label>
          <SmartCombobox
            value={action_extra}
            onChange={(v) => {
              setAction_extra(v);
              emit({ action_extra: v || undefined });
              if ((v || '').trim()) addCustomTarget('video', (v || '').trim());
            }}
            options={getCustomTargets('video').map((s) => ({ id: s, label: s }))}
            placeholder={t('marketing.banners_video_url_placeholder')}
            searchPlaceholder={t('marketing.banners_type_to_search')}
            aria-label={t('marketing.banners_video_url_label')}
          />
        </div>
      )}

      {showTarget && showOtherTypeLabel && (
        <>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_other_type_label')}
            </label>
            <SmartCombobox
              value={action_extra}
              onChange={(v) => {
                setAction_extra(v);
                emit({ action_extra: v || undefined });
                if ((v || '').trim()) addCustomActionType((v || '').trim());
              }}
              options={getCustomActionTypes().map((s) => ({ id: s, label: s }))}
              placeholder={t('marketing.banners_other_type_placeholder')}
              searchPlaceholder={t('marketing.banners_type_to_search')}
              aria-label={t('marketing.banners_other_type_label')}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_form_action_target')}
            </label>
            <SmartCombobox
              value={action_target}
              onChange={(v) => {
                setAction_target(v);
                emit({ action_target: v || undefined });
                if ((v || '').trim()) addCustomTarget('other', (v || '').trim());
              }}
              options={getCustomTargets('other').map((s) => ({ id: s, label: s }))}
              placeholder={t('marketing.banners_form_action_target_placeholder')}
              searchPlaceholder={t('marketing.banners_type_to_search')}
              aria-label={t('marketing.banners_form_action_target')}
            />
          </div>
        </>
      )}

      {showTarget && !showVideoUrl && !showOtherTypeLabel && (
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: semanticRoles.text }}
          >
            {t('marketing.banners_form_action_target')}
          </label>
          <SmartCombobox
            value={action_target}
            onChange={(v) => {
              setAction_target(v);
              emit({ action_target: v || undefined });
              if ((v || '').trim()) addCustomTarget(action_type, (v || '').trim());
            }}
            options={targetOptions}
            placeholder={t('marketing.banners_form_action_target_placeholder')}
            searchPlaceholder={t('marketing.banners_type_to_search')}
            aria-label={t('marketing.banners_form_action_target')}
          />
        </div>
      )}

      {showExtra && !showVideoUrl && !showOtherTypeLabel && (
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: semanticRoles.text }}
          >
            {t('marketing.banners_form_action_extra')}
          </label>
          <input
            type="text"
            value={action_extra}
            onChange={(e) => {
              const v = e.target.value;
              setAction_extra(v);
              emit({ action_extra: v || undefined });
            }}
            placeholder={t('marketing.banners_form_action_extra_placeholder')}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: semanticRoles.border,
              color: semanticRoles.text,
              backgroundColor: semanticRoles.surface,
            }}
          />
        </div>
      )}

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_form_accent_color')}
        </label>
        <input
          type="text"
          value={accent_color}
          onChange={(e) => {
            const v = e.target.value;
            setAccent_color(v);
            emit({ accent_color: v || undefined });
          }}
          placeholder={t('marketing.banners_form_accent_placeholder')}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_form_position')}
        </label>
        <input
          type="number"
          min={1}
          value={position}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10) || 1;
            setPosition(v);
            emit({ position: v });
          }}
          placeholder={t('marketing.banners_form_position_placeholder')}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        />
      </div>

      <details
        className="rounded-lg border"
        style={{ borderColor: semanticRoles.border }}
      >
        <summary
          className="cursor-pointer list-none px-4 py-3 text-sm font-semibold select-none rounded-lg"
          style={{ color: semanticRoles.text }}
        >
          {t('marketing.banners_settings_section')}
        </summary>
        <div className="px-4 pb-4 pt-0 space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_aspect_ratio')}
            </label>
            <select
              value={aspect_ratio}
              onChange={(e) => {
                const v = e.target.value as DshBannerAspectRatio;
                setAspect_ratio(v);
                emit({ aspect_ratio: v });
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
                backgroundColor: semanticRoles.surface,
              }}
            >
              {ASPECT_RATIOS.map((ar) => (
                <option key={ar} value={ar}>
                  {t(`marketing.banners_aspect_${ar.replace(':', '_')}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_animation_type')}
            </label>
            <select
              value={animation_type}
              onChange={(e) => {
                const v = e.target.value as DshBannerAnimationType;
                setAnimation_type(v);
                emit({ animation_type: v });
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
                backgroundColor: semanticRoles.surface,
              }}
            >
              {ANIMATION_TYPES.map((anim) => (
                <option key={anim} value={anim}>
                  {t(`marketing.banners_animation_${anim}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4 space-y-3" style={{ borderColor: semanticRoles.border }}>
            <p className="mb-2 text-xs font-semibold" style={{ color: semanticRoles.textSecondary }}>
              {t('marketing.banners_schedule_section')}
            </p>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: semanticRoles.text }}>
                {t('marketing.banners_schedule_type')}
              </label>
              <select
                value={schedule_type}
                onChange={(e) => {
                  const v = e.target.value as DshBannerScheduleType;
                  setSchedule_type(v);
                  emit({ schedule_type: v });
                }}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                  backgroundColor: semanticRoles.surface,
                }}
              >
                {SCHEDULE_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {t(`marketing.banners_schedule_type_${st}`)}
                  </option>
                ))}
              </select>
            </div>
            {schedule_type === 'scheduled' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs" style={{ color: semanticRoles.text }}>
                      {t('marketing.banners_schedule_start')}
                    </label>
                    <input
                      type="datetime-local"
                      value={schedule_start}
                      onChange={(e) => {
                        setSchedule_start(e.target.value);
                        emit({ schedule_start: e.target.value || undefined });
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        borderColor: semanticRoles.border,
                        color: semanticRoles.text,
                        backgroundColor: semanticRoles.surface,
                      }}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs" style={{ color: semanticRoles.text }}>
                      {t('marketing.banners_schedule_end')}
                    </label>
                    <input
                      type="datetime-local"
                      value={schedule_end}
                      onChange={(e) => {
                        setSchedule_end(e.target.value);
                        emit({ schedule_end: e.target.value || undefined });
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        borderColor: semanticRoles.border,
                        color: semanticRoles.text,
                        backgroundColor: semanticRoles.surface,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs" style={{ color: semanticRoles.text }}>
                    {t('marketing.banners_schedule_days')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAY_KEYS.map((day) => (
                      <label key={day} className="flex cursor-pointer items-center gap-1">
                        <input
                          type="checkbox"
                          checked={schedule_days.includes(day)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...schedule_days, day].sort((a, b) => a - b)
                              : schedule_days.filter((d) => d !== day);
                            setSchedule_days(next);
                            emit({ schedule_days: next.length > 0 ? next : undefined });
                          }}
                          className="rounded border"
                          style={{ borderColor: semanticRoles.border }}
                        />
                        <span className="text-xs" style={{ color: semanticRoles.text }}>
                          {t(`marketing.banners_day_${day}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs" style={{ color: semanticRoles.text }}>
                      {t('marketing.banners_schedule_time_start')}
                    </label>
                    <input
                      type="time"
                      value={schedule_time_start}
                      onChange={(e) => {
                        setSchedule_time_start(e.target.value);
                        emit({ schedule_time_start: e.target.value || undefined });
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        borderColor: semanticRoles.border,
                        color: semanticRoles.text,
                        backgroundColor: semanticRoles.surface,
                      }}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs" style={{ color: semanticRoles.text }}>
                      {t('marketing.banners_schedule_time_end')}
                    </label>
                    <input
                      type="time"
                      value={schedule_time_end}
                      onChange={(e) => {
                        setSchedule_time_end(e.target.value);
                        emit({ schedule_time_end: e.target.value || undefined });
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        borderColor: semanticRoles.border,
                        color: semanticRoles.text,
                        backgroundColor: semanticRoles.surface,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: semanticRoles.text }}>
                {t('marketing.banners_cap_quantity')}
              </label>
              <input
                type="number"
                min={1}
                value={cap_quantity}
                onChange={(e) => {
                  const v = e.target.value;
                  setCap_quantity(v);
                  const n = v.trim() ? parseInt(v, 10) : undefined;
                  emit({ cap_quantity: n != null && !Number.isNaN(n) && n > 0 ? n : undefined });
                }}
                placeholder={t('marketing.banners_cap_quantity_placeholder')}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                  backgroundColor: semanticRoles.surface,
                }}
              />
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: semanticRoles.border }}>
            <p className="mb-2 text-xs font-semibold" style={{ color: semanticRoles.textSecondary }}>
              {t('marketing.banners_overlay_section')}
            </p>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={overlay_enabled}
                onChange={(e) => {
                  const v = e.target.checked;
                  setOverlay_enabled(v);
                  emit({
                    overlay_enabled: v,
                    overlay_side: v ? overlay_side : undefined,
                    overlay_width_percent: v ? overlay_width_percent : undefined,
                    overlay_color: v ? overlay_color : undefined,
                    overlay_opacity: v ? overlay_opacity : undefined,
                  });
                }}
                className="rounded border"
                style={{ borderColor: semanticRoles.border }}
              />
              <span className="text-sm" style={{ color: semanticRoles.text }}>
                {t('marketing.banners_overlay_enabled')}
              </span>
            </label>
            {overlay_enabled && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: semanticRoles.text }}>
                    {t('marketing.banners_overlay_side')}
                  </label>
                  <select
                    value={overlay_side}
                    onChange={(e) => {
                      const v = e.target.value as 'start' | 'end';
                      setOverlay_side(v);
                      emit({ overlay_side: v });
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                      backgroundColor: semanticRoles.surface,
                    }}
                  >
                    <option value="start">{t('marketing.banners_overlay_side_start')}</option>
                    <option value="end">{t('marketing.banners_overlay_side_end')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: semanticRoles.text }}>
                    {t('marketing.banners_overlay_width')}
                  </label>
                  <input
                    type="number"
                    min={25}
                    max={70}
                    value={overlay_width_percent}
                    onChange={(e) => {
                      const v = Math.min(70, Math.max(25, parseInt(e.target.value, 10) || 40));
                      setOverlay_width_percent(v);
                      emit({ overlay_width_percent: v });
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                      backgroundColor: semanticRoles.surface,
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: semanticRoles.text }}>
                    {t('marketing.banners_overlay_color')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={overlay_color}
                      onChange={(e) => {
                        const v = e.target.value;
                        setOverlay_color(v);
                        emit({ overlay_color: v });
                      }}
                      className="h-9 w-12 cursor-pointer rounded border"
                      style={{ borderColor: semanticRoles.border }}
                    />
                    <input
                      type="text"
                      value={overlay_color}
                      onChange={(e) => {
                        const v = e.target.value;
                        setOverlay_color(v);
                        emit({ overlay_color: v || undefined });
                      }}
                      placeholder="#000000"
                      className="flex-1 rounded-lg border px-3 py-2 text-sm"
                      style={{
                        borderColor: semanticRoles.border,
                        color: semanticRoles.text,
                        backgroundColor: semanticRoles.surface,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: semanticRoles.text }}>
                    {t('marketing.banners_overlay_opacity')} ({(overlay_opacity * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min={0.2}
                    max={0.9}
                    step={0.05}
                    value={overlay_opacity}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setOverlay_opacity(v);
                      emit({ overlay_opacity: v });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </details>

      <div className="flex flex-wrap gap-3 border-t pt-6" style={{ borderColor: semanticRoles.border }}>
        <button
          type="submit"
          name="saveAction"
          value="draft"
          disabled={saving}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        >
          {saving ? '...' : t('marketing.banners_save_draft')}
        </button>
        <button
          type="submit"
          name="saveAction"
          value="publish"
          disabled={saving}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: semanticRoles.accent }}
        >
          {saving ? '...' : t('marketing.banners_publish')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        >
          {t('marketing.banners_form_cancel')}
        </button>
      </div>
    </form>
  );
}
