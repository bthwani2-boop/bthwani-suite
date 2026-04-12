export const surfaceMeta = {
  id: 'control-panel',
  ownership: 'surface-owned',
  scope: 'cross-service',
  serviceCoverage: [
    'dsh',
    'knz',
    'amn',
    'arb',
    'wlt',
    'esf',
    'mrf',
    'snd',
    'kwd'
  ],
  exclusiveSectionBinding: {
    'community-services': ['esf', 'mrf', 'snd', 'kwd']
  },
  otherServicesSectionPolicy: 'dynamic-by-availability',
  placeholder: false,
} as const;