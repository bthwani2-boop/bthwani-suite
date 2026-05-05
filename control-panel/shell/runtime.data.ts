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

const controlPanelServices: ControlPanelRuntimeService[] = [
  { id: 'dsh', label: 'DSH', statusKind: 'live', sections: ['dashboard', 'operations', 'partners', 'marketing', 'platform', 'administration', 'hr'], placeholder: false },
  { id: 'arb', label: 'ARB', statusKind: 'live', sections: ['operations', 'partners', 'support'], placeholder: false },
  { id: 'amn', label: 'AMN', statusKind: 'reference', sections: ['operations', 'support'], placeholder: true },
  { id: 'wlt', label: 'WLT', statusKind: 'live', sections: ['finance'], placeholder: false },
  { id: 'knz', label: 'KNZ', statusKind: 'live', sections: ['community-services'], placeholder: false },
  { id: 'kwd', label: 'KWD', statusKind: 'reference', sections: ['community-services'], placeholder: true },
  { id: 'esf', label: 'ESF', statusKind: 'reference', sections: ['community-services'], placeholder: true },
  { id: 'mrf', label: 'MRF', statusKind: 'reference', sections: ['community-services'], placeholder: true },
  { id: 'snd', label: 'SND', statusKind: 'reference', sections: ['community-services'], placeholder: true },
];

const controlPanelSections: ControlPanelRuntimeSection[] = [
  { id: 'dashboard', serviceIds: ['dsh'] },
  { id: 'operations', serviceIds: ['dsh', 'arb', 'amn'] },
  { id: 'finance', serviceIds: ['wlt'] },
  { id: 'community-services', serviceIds: ['knz', 'kwd', 'esf', 'mrf', 'snd'] },
  { id: 'support', serviceIds: ['arb', 'amn'] },
  { id: 'partners', serviceIds: ['dsh', 'arb'] },
  { id: 'marketing', serviceIds: ['dsh'] },
  { id: 'platform', serviceIds: ['dsh'] },
  { id: 'administration', serviceIds: ['dsh'] },
  { id: 'hr', serviceIds: ['dsh'] },
  { id: 'community-services', serviceIds: [] },
];

const controlPanelMissions: ControlPanelRuntimeMission[] = [
  { sectionId: 'dashboard', flowId: 'dsh-dashboard', ownerSectionId: 'dashboard', dueKind: 'defined', placeholder: false },
  { sectionId: 'operations', flowId: 'dsh-operations', ownerSectionId: 'operations', dueKind: 'defined', placeholder: false },
  { sectionId: 'finance', flowId: 'wlt-finance', ownerSectionId: 'finance', dueKind: 'defined', placeholder: false },
  { sectionId: 'community-services', flowId: 'knz-community-services', ownerSectionId: 'community-services', dueKind: 'defined', placeholder: false },
  { sectionId: 'support', flowId: 'arb-support', ownerSectionId: 'support', dueKind: 'defined', placeholder: false },
  { sectionId: 'partners', flowId: 'arb-partners', ownerSectionId: 'partners', dueKind: 'defined', placeholder: false },
  { sectionId: 'marketing', flowId: 'dsh-marketing', ownerSectionId: 'marketing', dueKind: 'defined', placeholder: false },
  { sectionId: 'platform', flowId: 'dsh-platform', ownerSectionId: 'platform', dueKind: 'defined', placeholder: false },
  { sectionId: 'administration', flowId: 'dsh-administration', ownerSectionId: 'administration', dueKind: 'defined', placeholder: false },
  { sectionId: 'hr', flowId: 'dsh-hr', ownerSectionId: 'hr', dueKind: 'defined', placeholder: false },
  { sectionId: 'community-services', flowId: 'unmapped', ownerSectionId: 'community-services', dueKind: 'missing', placeholder: true },
];

export const controlPanelRuntimeData = {
  services: controlPanelServices,
  sections: controlPanelSections,
  missions: controlPanelMissions,
} as const;
