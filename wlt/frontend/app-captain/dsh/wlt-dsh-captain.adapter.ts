import {
  getWltCaptainFinanceSnapshot,
  getWltDshFinanceRecordsForActor,
  type WltCaptainFinanceSection,
  type WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';

export function getSnapshot() {
  return getWltCaptainFinanceSnapshot();
}

export function getRecords() {
  return getWltDshFinanceRecordsForActor('captain');
}

export function getSections() {
  return ['cod-balance', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export function getRecordsForSection(section: WltCaptainFinanceSection): WltDshFinancePreviewRecord[] {
  const records = getRecords();

  if (section === 'cod-balance') {
    return records.filter((record) => record.kind === 'cash-on-delivery');
  }

  if (section === 'earnings') {
    return records.filter((record) => record.kind === 'captain-earning');
  }

  return [];
}

const WltDshCaptainAdapter = {
  getSnapshot,
  getRecords,
  getSections,
  getRecordsForSection,
};

export default WltDshCaptainAdapter;
