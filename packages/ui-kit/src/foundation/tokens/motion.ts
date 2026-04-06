export const motion = {
  instant: 0,
  quick: 120,
  standard: 180,
  calm: 240,
  emphasized: 320
} as const;

export type MotionToken = keyof typeof motion;
