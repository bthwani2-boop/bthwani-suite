/**
 * تخزين القيم المخصصة للبنرات (أخرى، أهداف مضافة يدوياً).
 * عند إضافة قيمة أول مرة تظهر في القائمة لاحقاً بدون الحاجة لاختيار "أخرى" مرة ثانية.
 * يستخدم localStorage حتى ربط API.
 */

const STORAGE_KEY_TARGETS = 'mcpw_banner_custom_targets';
const STORAGE_KEY_ACTION_TYPES = 'mcpw_banner_custom_action_types';

function readTargets(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_TARGETS);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

function writeTargets(data: Record<string, string[]>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_TARGETS, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/** أهداف مخصصة محفوظة حسب نوع الإجراء — تظهر في القائمة بعد إضافتها مرة */
export function getCustomTargets(actionType: string): string[] {
  const data = readTargets();
  const list = data[actionType];
  return Array.isArray(list) ? [...list] : [];
}

/** حفظ هدف مخصص ليظهر في اقتراحات النوع لاحقاً */
export function addCustomTarget(actionType: string, value: string) {
  const trimmed = (value || '').trim();
  if (!trimmed) return;
  const data = readTargets();
  const list = data[actionType] ?? [];
  if (list.includes(trimmed)) return;
  data[actionType] = [...list, trimmed];
  writeTargets(data);
}

function readActionTypes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ACTION_TYPES);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeActionTypes(list: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_ACTION_TYPES, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

/** تسميات "أخرى" المخصصة — تظهر في قائمة نوع الإجراء بعد إضافتها */
export function getCustomActionTypes(): string[] {
  return [...readActionTypes()];
}

/** إضافة تسمية "أخرى" جديدة */
export function addCustomActionType(label: string) {
  const trimmed = (label || '').trim();
  if (!trimmed) return;
  const list = readActionTypes();
  if (list.includes(trimmed)) return;
  writeActionTypes([...list, trimmed]);
}
