import { serviceMeta as amnServiceMeta } from '@bthwani/surfaces/amn/service.meta';
import { serviceMeta as arbServiceMeta } from '@bthwani/surfaces/arb/service.meta';
import { serviceMeta as dshServiceMeta } from '@bthwani/surfaces/dsh/service.meta';
import { serviceMeta as esfServiceMeta } from '@bthwani/surfaces/esf/service.meta';
import { serviceMeta as knzServiceMeta } from '@bthwani/surfaces/knz/service.meta';
import { serviceMeta as kwdServiceMeta } from '@bthwani/surfaces/kwd/service.meta';
import { serviceMeta as mrfServiceMeta } from '@bthwani/surfaces/mrf/service.meta';
import { serviceMeta as sndServiceMeta } from '@bthwani/surfaces/snd/service.meta';
import { serviceMeta as wltServiceMeta } from '@bthwani/surfaces/wlt/service.meta';
import { flowMeta as amnOperationsFlowMeta } from '@bthwani/surfaces/amn/control-panel/operations/_flow-id_/flow.meta';
import { flowMeta as arbOperationsFlowMeta } from '@bthwani/surfaces/arb/control-panel/operations/_flow-id_/flow.meta';
import { flowMeta as arbPartnersFlowMeta } from '@bthwani/surfaces/arb/control-panel/partners/_flow-id_/flow.meta';
import { flowMeta as arbSupportFlowMeta } from '@bthwani/surfaces/arb/control-panel/support/_flow-id_/flow.meta';
import { flowMeta as dshOperationsFlowMeta } from '@bthwani/surfaces/dsh/control-panel/operations/dsh/flow.meta';
import { flowMeta as esfCatalogsFlowMeta } from '@bthwani/surfaces/esf/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as knzCatalogsFlowMeta } from '@bthwani/surfaces/knz/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as kwdCatalogsFlowMeta } from '@bthwani/surfaces/kwd/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as mrfCatalogsFlowMeta } from '@bthwani/surfaces/mrf/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as sndCatalogsFlowMeta } from '@bthwani/surfaces/snd/control-panel/catalogs/_flow-id_/flow.meta';
import { flowMeta as wltFinanceFlowMeta } from '@bthwani/surfaces/wlt/control-panel/finance/_flow-id_/flow.meta';

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