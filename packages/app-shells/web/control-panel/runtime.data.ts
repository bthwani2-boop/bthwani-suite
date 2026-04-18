import { amnOperationsFlowMeta, amnServiceMeta, arbOperationsFlowMeta, arbPartnersFlowMeta, arbServiceMeta, arbSupportFlowMeta, dshOperationsFlowMeta, dshServiceMeta, esfCatalogsFlowMeta, esfServiceMeta, knzCatalogsFlowMeta, knzServiceMeta, kwdCatalogsFlowMeta, kwdServiceMeta, mrfCatalogsFlowMeta, mrfServiceMeta, sndCatalogsFlowMeta, sndServiceMeta, wltFinanceFlowMeta, wltServiceMeta } from '@bthwani/surfaces/control-panel';
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

export type ControlPanelRuntimeService = {
  id: string;
  label: string;
  statusKind: 'live' | 'reference';
  sections: string[];
  placeholder: boolean;
};

export type ControlPanelRuntimeSection = {
  id: string;
  serviceIds: string[];
};

export type ControlPanelRuntimeMission = {
  sectionId: string;
  flowId: string;
  ownerSectionId: string;
  dueKind: 'defined' | 'missing';
  placeholder: boolean;
};

const controlPanelServices: ControlPanelRuntimeService[] = allServiceMetas
  .filter((meta) => meta.surfaceOwnership.includes('control-panel'))
  .map((meta) => ({
    id: meta.id,
    label: meta.id,
    statusKind: meta.placeholder ? 'reference' : 'live',
    sections: [...meta.controlPanelSections],
    placeholder: meta.placeholder,
  }));

const sectionIds = Array.from(
  new Set(controlPanelServices.flatMap((service) => service.sections)),
);

const controlPanelSections: ControlPanelRuntimeSection[] = sectionIds.map((sectionId) => ({
  id: sectionId,
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
  esfCatalogsFlowMeta,
  knzCatalogsFlowMeta,
  kwdCatalogsFlowMeta,
  mrfCatalogsFlowMeta,
  sndCatalogsFlowMeta,
  wltFinanceFlowMeta,
] as const;

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
      ownerSectionId: sectionEntry.id,
      dueKind: 'missing',
      placeholder: true,
    };
  }

  return {
    sectionId: sectionEntry.id,
    flowId: flowMeta.id,
    ownerSectionId: flowMeta.owner,
    dueKind: flowMeta.placeholder ? 'missing' : 'defined',
    placeholder: flowMeta.placeholder,
  };
});

export const controlPanelRuntimeData = {
  services: controlPanelServices,
  sections: controlPanelSections,
  missions: controlPanelMissions,
} as const;
