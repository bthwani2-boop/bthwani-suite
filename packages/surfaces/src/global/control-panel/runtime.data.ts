import { serviceMeta as amnServiceMeta } from '../../amn/service.meta';
import { serviceMeta as arbServiceMeta } from '../../arb/service.meta';
import { serviceMeta as dshServiceMeta } from '../../dsh/service.meta';
import { serviceMeta as esfServiceMeta } from '../../esf/service.meta';
import { serviceMeta as knzServiceMeta } from '../../knz/service.meta';
import { serviceMeta as kwdServiceMeta } from '../../kwd/service.meta';
import { serviceMeta as mrfServiceMeta } from '../../mrf/service.meta';
import { serviceMeta as sndServiceMeta } from '../../snd/service.meta';
import { serviceMeta as wltServiceMeta } from '../../wlt/service.meta';
import { flowMeta as amnOperationsFlowMeta } from '../../amn/control-panel/operations/_flow-id_/flow.meta';
import { flowMeta as arbOperationsFlowMeta } from '../../arb/control-panel/operations/_flow-id_/flow.meta';
import { flowMeta as arbPartnersFlowMeta } from '../../arb/control-panel/partners/_flow-id_/flow.meta';
import { flowMeta as arbSupportFlowMeta } from '../../arb/control-panel/support/_flow-id_/flow.meta';
import { flowMeta as dshOperationsFlowMeta } from '../../dsh/control-panel/operations/_flow-id_/flow.meta';
import { flowMeta as dshPartnersFlowMeta } from '../../dsh/control-panel/partners/_flow-id_/flow.meta';
import { flowMeta as dshSupportFlowMeta } from '../../dsh/control-panel/support/_flow-id_/flow.meta';
import { flowMeta as esfCatalogsFlowMeta } from '../../esf/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as globalSupportNotificationsFlowMeta } from './support/notifications/flow.meta';
import { flowMeta as globalSettingsProfileFlowMeta } from './settings/profile/flow.meta';
import { flowMeta as knzCatalogsFlowMeta } from '../../knz/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as kwdCatalogsFlowMeta } from '../../kwd/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as mrfCatalogsFlowMeta } from '../../mrf/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as sndCatalogsFlowMeta } from '../../snd/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as wltFinanceFlowMeta } from '../../wlt/control-panel/finance/_flow-id_/flow.meta';

const allServiceMetas = [
  amnServiceMeta,
  arbServiceMeta,
  dshServiceMeta,
  esfServiceMeta,
  knzServiceMeta,
  kwdServiceMeta,
  mrfServiceMeta,
  sndServiceMeta,
  wltServiceMeta,
] as const;

const sectionLabelMap: Record<string, string> = {
  operations: 'العمليات',
  finance: 'المالية',
  catalogs: 'الكتالوجات',
  support: 'الدعم',
  partners: 'الشركاء',
};

export type ControlPanelRuntimeService = {
  id: string;
  label: string;
  status: string;
  sections: string[];
  placeholder: boolean;
};

export type ControlPanelRuntimeSection = {
  id: string;
  label: string;
  serviceIds: string[];
};

export type ControlPanelRuntimeMission = {
  sectionId: string;
  flowId: string;
  title: string;
  description: string;
  owner: string;
  due: string;
  placeholder: boolean;
};

const controlPanelServices: ControlPanelRuntimeService[] = allServiceMetas
  .filter((meta) => meta.surfaceOwnership.includes('control-panel'))
  .map((meta) => ({
    id: meta.id,
    label: meta.id.toUpperCase(),
    status: meta.placeholder ? 'تشغيل مرجعي' : 'مفعل',
    sections: [...meta.controlPanelSections],
    placeholder: meta.placeholder,
  }));

const sectionIds = Array.from(
  new Set(controlPanelServices.flatMap((service) => service.sections)),
);

const controlPanelSections: ControlPanelRuntimeSection[] = sectionIds.map((sectionId) => ({
  id: sectionId,
  label: sectionLabelMap[sectionId] ?? sectionId,
  serviceIds: controlPanelServices
    .filter((service) => service.sections.includes(sectionId))
    .map((service) => service.id),
}));

const allFlowMetas = [
  amnOperationsFlowMeta,
  arbOperationsFlowMeta,
  arbPartnersFlowMeta,
  arbSupportFlowMeta,
  dshOperationsFlowMeta,
  dshPartnersFlowMeta,
  dshSupportFlowMeta,
  esfCatalogsFlowMeta,
  globalSupportNotificationsFlowMeta,
  globalSettingsProfileFlowMeta,
  knzCatalogsFlowMeta,
  kwdCatalogsFlowMeta,
  mrfCatalogsFlowMeta,
  sndCatalogsFlowMeta,
  wltFinanceFlowMeta,
] as const;

function resolveMissionTitle(sectionLabel: string, flowId: string) {
  if (flowId === '_flow-id_') {
    return `مهمة ${sectionLabel}`;
  }

  return `مهمة ${sectionLabel} - ${flowId}`;
}

function resolveMissionDescription(sectionLabel: string, flowId: string, owner: string) {
  if (flowId === '_flow-id_') {
    return `هذا القسم مرتبط بتدفق placeholder مملوك لـ ${owner} ضمن ${sectionLabel}.`;
  }

  return `هذا القسم يعمل عبر التدفق ${flowId} المملوك لـ ${owner}.`;
}

function pickFlowMetaForSection(sectionId: string) {
  const matchingFlowMetas = allFlowMetas.filter((flowMeta) => flowMeta.owner === sectionId);

  const nonPlaceholderFlowMeta = matchingFlowMetas.find((flowMeta) => !flowMeta.placeholder);
  return nonPlaceholderFlowMeta ?? matchingFlowMetas[0];
}

const controlPanelMissions: ControlPanelRuntimeMission[] = controlPanelSections.map((sectionEntry) => {
  const flowMeta = pickFlowMetaForSection(sectionEntry.id);

  if (!flowMeta) {
    return {
      sectionId: sectionEntry.id,
      flowId: 'unmapped',
      title: `مهمة ${sectionEntry.label}`,
      description: `لا يوجد flow.meta مرتبط مباشرة بهذا القسم حتى الآن.`,
      owner: sectionEntry.id,
      due: 'غير معرف في flow.meta',
      placeholder: true,
    };
  }

  return {
    sectionId: sectionEntry.id,
    flowId: flowMeta.id,
    title: resolveMissionTitle(sectionEntry.label, flowMeta.id),
    description: resolveMissionDescription(sectionEntry.label, flowMeta.id, flowMeta.owner),
    owner: flowMeta.owner,
    due: flowMeta.placeholder ? 'غير معرف في flow.meta' : 'معرف في flow.meta',
    placeholder: flowMeta.placeholder,
  };
});

export const controlPanelRuntimeData = {
  services: controlPanelServices,
  sections: controlPanelSections,
  missions: controlPanelMissions,
} as const;
