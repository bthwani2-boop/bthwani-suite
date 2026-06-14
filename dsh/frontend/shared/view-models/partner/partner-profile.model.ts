import type { PartnerStoreScopeOption } from './partner-scope';

export type PartnerRuntimeProfile = {
  storeName: string;
  branchLabel: string;
  cityLabel: string;
  managerLabel: string;
  todayHoursLabel: string;
  activeZoneLabel: string;
};

export function buildPartnerProfileFromScope(scope: PartnerStoreScopeOption): PartnerRuntimeProfile {
  return {
    storeName: scope.label,
    branchLabel: scope.label,
    cityLabel: scope.description,
    managerLabel: 'غير محدد',
    todayHoursLabel: 'يتطلب ربط ساعات التشغيل',
    activeZoneLabel: scope.label,
  };
}
