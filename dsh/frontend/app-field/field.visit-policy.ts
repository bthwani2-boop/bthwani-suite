import type { DshFieldStoreVisitErrors, DshFieldStoreVisitValues } from './dsh-field.types';

export function validateVisitFields(values: DshFieldStoreVisitValues): DshFieldStoreVisitErrors {
  const errors: DshFieldStoreVisitErrors = {};
  if (!values.visitSummary.trim()) errors.visitSummary = 'اكتب ملخص الزيارة قبل الإرسال.';
  if (!values.followUpAction.trim()) errors.followUpAction = 'حدد خطوة المتابعة قبل الإرسال.';
  return errors;
}

export function hasVisitErrors(errors: DshFieldStoreVisitErrors): boolean {
  return Object.keys(errors).length > 0;
}
