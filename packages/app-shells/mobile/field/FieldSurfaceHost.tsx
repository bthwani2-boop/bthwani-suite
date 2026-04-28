import { dshField } from '@bthwani/surfaces/app-field';

export const FieldSurfaceHost = (dshField as any)?.FieldSurfaceHost ?? (dshField as any)?.default ?? null;

export default (dshField as any)?.default ?? (dshField as any)?.FieldSurfaceHost ?? null;
