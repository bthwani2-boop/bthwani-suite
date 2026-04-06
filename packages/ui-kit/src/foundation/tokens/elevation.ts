export const elevation = {
  flat: 0,
  raised: 1,
  overlay: 2,
  floating: 3
} as const;

export const shadowByElevation = {
  flat: undefined,
  raised: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  overlay: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  floating: {
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10
  }
} as const;

export type ElevationToken = keyof typeof elevation;
