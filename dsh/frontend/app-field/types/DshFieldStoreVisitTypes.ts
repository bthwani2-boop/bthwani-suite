export type DshFieldStoreVisitState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitErrors = Partial<Record<keyof DshFieldStoreVisitValues, string>>;