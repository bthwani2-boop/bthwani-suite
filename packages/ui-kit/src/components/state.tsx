import React from 'react';
import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';
import { BthButton } from './button';
import { spacing, type BthLanguage } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { BthSurface, BthText } from '../primitives';

export type BthStateKind = 'loading' | 'empty' | 'error' | 'success' | 'warning' | 'info';
export type BthStateTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BthStateId =
  | 'loading'
  | 'empty'
  | 'noResults'
  | 'success'
  | 'warning'
  | 'recoverableError'
  | 'blockingError'
  | 'offline'
  | 'unauthorized'
  | 'notFound';

export type BthStateDefinition = {
  id: BthStateId;
  kind: BthStateKind;
  tone: BthStateTone;
  title: string;
  description: string;
  actionLabel?: string;
};

type LocalizedStateCatalog = Record<BthStateId, BthStateDefinition>;

const arabicStateCatalog: LocalizedStateCatalog = {
  loading: { id: 'loading', kind: 'loading', tone: 'info', title: 'جار التحميل', description: 'يبقى هيكل الشاشة واضحًا أثناء جلب البيانات أو تنفيذ العملية.' },
  empty: { id: 'empty', kind: 'empty', tone: 'neutral', title: 'لا توجد بيانات بعد', description: 'الحالة فارغة لكن الوجهة ما تزال واضحة ويمكن بدء أول إجراء صالح.', actionLabel: 'ابدأ الآن' },
  noResults: { id: 'noResults', kind: 'empty', tone: 'neutral', title: 'لا توجد نتائج', description: 'سياق البحث باقٍ ويمكنك تعديل الاستعلام أو الفلاتر بسهولة.', actionLabel: 'عدّل البحث' },
  success: { id: 'success', kind: 'success', tone: 'success', title: 'تم التنفيذ بنجاح', description: 'اكتملت العملية مع تأكيد واضح وخطوة تالية مفهومة.', actionLabel: 'المتابعة' },
  warning: { id: 'warning', kind: 'warning', tone: 'warning', title: 'هناك ما يحتاج مراجعة', description: 'المسار ما يزال متاحًا لكن بعض المتطلبات تحتاج الانتباه قبل الاستمرار.', actionLabel: 'مراجعة' },
  recoverableError: { id: 'recoverableError', kind: 'error', tone: 'danger', title: 'حدث خلل يمكن إصلاحه', description: 'يمكنك إعادة المحاولة أو تصحيح المدخلات دون فقدان السياق الحالي.', actionLabel: 'إعادة المحاولة' },
  blockingError: { id: 'blockingError', kind: 'error', tone: 'danger', title: 'المسار الحالي متوقف', description: 'لا يمكن إكمال الإجراء الآن ويجب الانتقال إلى بديل آمن أو تصعيد مناسب.', actionLabel: 'الرجوع' },
  offline: { id: 'offline', kind: 'warning', tone: 'warning', title: 'الاتصال غير متاح', description: 'بعض الأفعال مؤجلة حتى تعود الشبكة ثم يمكن استكمال العمل من نفس السياق.', actionLabel: 'إعادة المحاولة' },
  unauthorized: { id: 'unauthorized', kind: 'error', tone: 'danger', title: 'الصلاحية الحالية غير كافية', description: 'هذا المسار يتطلب مستوى وصول مختلف أو العودة إلى وجهة آمنة.', actionLabel: 'الرجوع' },
  notFound: { id: 'notFound', kind: 'empty', tone: 'neutral', title: 'العنصر غير موجود', description: 'المورد المطلوب لم يعد متاحًا ويمكنك العودة إلى وجهة معروفة دون فقدان الاتجاه.', actionLabel: 'العودة' },
};

const englishStateCatalog: LocalizedStateCatalog = {
  loading: { id: 'loading', kind: 'loading', tone: 'info', title: 'Loading in progress', description: 'The shell remains legible while data is loading or an action is running.' },
  empty: { id: 'empty', kind: 'empty', tone: 'neutral', title: 'Nothing here yet', description: 'The area is empty, but the next valid action stays explicit.', actionLabel: 'Get started' },
  noResults: { id: 'noResults', kind: 'empty', tone: 'neutral', title: 'No matching results', description: 'The search context remains visible so the query or filters can be refined.', actionLabel: 'Refine search' },
  success: { id: 'success', kind: 'success', tone: 'success', title: 'Action completed', description: 'The task finished successfully with a clear next step.', actionLabel: 'Continue' },
  warning: { id: 'warning', kind: 'warning', tone: 'warning', title: 'Review required', description: 'The path is still available, but one or more requirements need attention first.', actionLabel: 'Review now' },
  recoverableError: { id: 'recoverableError', kind: 'error', tone: 'danger', title: 'Something needs fixing', description: 'You can retry or correct the input without losing the current context.', actionLabel: 'Try again' },
  blockingError: { id: 'blockingError', kind: 'error', tone: 'danger', title: 'This path is blocked', description: 'The current action cannot continue and should fall back to a safe route.', actionLabel: 'Go back' },
  offline: { id: 'offline', kind: 'warning', tone: 'warning', title: 'You are offline', description: 'Some actions are paused until connectivity returns, but the context stays intact.', actionLabel: 'Retry' },
  unauthorized: { id: 'unauthorized', kind: 'error', tone: 'danger', title: 'Access is restricted', description: 'This route requires a different permission level or a safe fallback destination.', actionLabel: 'Return safely' },
  notFound: { id: 'notFound', kind: 'empty', tone: 'neutral', title: 'Resource not found', description: 'The requested item is no longer available. Move back to a known destination.', actionLabel: 'Back to list' },
};

export const bthStateIds = Object.freeze(Object.keys(arabicStateCatalog) as BthStateId[]);

export function getBthStateDefinition(stateId: BthStateId, language?: BthLanguage) {
  const normalizedLanguage = String(language ?? 'ar').toLowerCase();
  const catalog = normalizedLanguage.startsWith('en') ? englishStateCatalog : arabicStateCatalog;
  return catalog[stateId];
}

export type BthStateViewProps = {
  kind?: BthStateKind;
  stateId?: BthStateId;
  language?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthStateView({ kind, stateId, language, title, description, actionLabel, onActionPress }: BthStateViewProps) {
  const { language: contextLanguage } = useDirection();
  const { theme } = useTheme();
  const stateDefinition = stateId ? getBthStateDefinition(stateId, language ?? contextLanguage) : undefined;
  const resolvedKind = kind ?? stateDefinition?.kind ?? 'empty';
  const resolvedTitle = title ?? stateDefinition?.title ?? (resolvedKind === 'loading' ? 'جار التحميل' : 'No state title');
  const resolvedDescription = description ?? stateDefinition?.description;
  const resolvedActionLabel = actionLabel ?? stateDefinition?.actionLabel;
  const tone = stateDefinition?.tone ?? (resolvedKind === 'error' ? 'danger' : resolvedKind === 'success' ? 'success' : resolvedKind === 'warning' ? 'warning' : resolvedKind === 'loading' ? 'info' : 'neutral');
  const appearance = {
    neutral: { surfaceTone: 'inset' as const, accentColor: theme.lineStrong, textTone: 'muted' as const, buttonTone: 'secondary' as const },
    info: { surfaceTone: 'info' as const, accentColor: theme.info, textTone: 'info' as const, buttonTone: 'secondary' as const },
    success: { surfaceTone: 'success' as const, accentColor: theme.success, textTone: 'success' as const, buttonTone: 'success' as const },
    warning: { surfaceTone: 'warning' as const, accentColor: theme.warning, textTone: 'warning' as const, buttonTone: 'secondary' as const },
    danger: { surfaceTone: 'danger' as const, accentColor: theme.danger, textTone: 'danger' as const, buttonTone: 'danger' as const },
  }[tone];

  return (
    <BthSurface tone={appearance.surfaceTone} padding={6} gap={4} style={{ alignItems: 'center' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', gap: spacing[3], width: '100%' }}>
        <View style={{ width: 56, height: 5, borderRadius: 999, backgroundColor: appearance.accentColor }} />
        {resolvedKind === 'loading' ? <ActivityIndicator color={appearance.accentColor} size="large" /> : null}
        <View style={{ alignItems: 'center', gap: spacing[2], width: '100%' }}>
          <BthText role="titleMd" align="center">{resolvedTitle}</BthText>
          {resolvedDescription ? <BthText role="bodyMd" tone={appearance.textTone} align="center">{resolvedDescription}</BthText> : null}
        </View>
        {resolvedActionLabel && onActionPress ? <BthButton label={resolvedActionLabel} tone={appearance.buttonTone} onPress={onActionPress} /> : null}
      </View>
    </BthSurface>
  );
}

export function BthEmptyState(props: Omit<BthStateViewProps, 'kind' | 'stateId'>) {
  return <BthStateView stateId="empty" {...props} />;
}

export function BthLoadingState(props: Omit<BthStateViewProps, 'kind' | 'stateId'>) {
  return <BthStateView stateId="loading" {...props} />;
}

export function BthSuccessState(props: Omit<BthStateViewProps, 'kind' | 'stateId'>) {
  return <BthStateView stateId="success" {...props} />;
}

export function BthErrorState(props: Omit<BthStateViewProps, 'kind' | 'stateId'>) {
  return <BthStateView stateId="blockingError" {...props} />;
}

export type ScreenState = 'content' | 'loading' | 'success' | 'error';

export type ScreenWrapperProps = {
  state?: ScreenState;
  loadingMessage?: string;
  successMessage?: string;
  onSuccessAction?: () => void;
  children?: React.ReactNode;
};

export function ScreenWrapper({ state = 'content', loadingMessage, successMessage, onSuccessAction, children }: ScreenWrapperProps) {
  if (state === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
        <ActivityIndicator size="large" />
        {loadingMessage ? <BthText style={{ marginTop: spacing[3], textAlign: 'center' }}>{loadingMessage}</BthText> : null}
      </View>
    );
  }

  if (state === 'success') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
        <BthText style={{ marginTop: spacing[3], textAlign: 'center' }}>{successMessage ?? 'Success'}</BthText>
        {onSuccessAction ? <BthButton label="OK" onPress={onSuccessAction} /> : null}
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
        <BthText style={{ marginTop: spacing[3], textAlign: 'center' }}>حدث خطأ، الرجاء المحاولة لاحقًا</BthText>
        {children}
      </View>
    );
  }

  return <>{children}</>;
}

export type AppEmptyStateProps = Omit<BthStateViewProps, 'kind' | 'stateId'>;
export type AppLoadingStateProps = Omit<BthStateViewProps, 'kind' | 'stateId'>;
export type AppSuccessStateProps = Omit<BthStateViewProps, 'kind' | 'stateId'>;
export type AppErrorStateProps = Omit<BthStateViewProps, 'kind' | 'stateId'>;

export function AppEmptyState(props: AppEmptyStateProps) {
  return <BthEmptyState {...props} />;
}

export function AppLoadingState(props: AppLoadingStateProps) {
  return <BthLoadingState {...props} />;
}

export function AppSuccessState(props: AppSuccessStateProps) {
  return <BthSuccessState {...props} />;
}

export function AppErrorState(props: AppErrorStateProps) {
  return <BthErrorState {...props} />;
}

export function Loading(props: AppLoadingStateProps) {
  return <BthLoadingState {...props} />;
}

export function ErrorBoundary(props: AppErrorStateProps) {
  return <BthErrorState {...props} />;
}

export function BthStateGallery({ states }: { states?: readonly BthStateId[] }) {
  const ids = states ?? bthStateIds;

  return (
    <View style={{ gap: spacing[3] }}>
      {ids.map((stateId) => (
        <BthStateView key={stateId} stateId={stateId} />
      ))}
    </View>
  );
}