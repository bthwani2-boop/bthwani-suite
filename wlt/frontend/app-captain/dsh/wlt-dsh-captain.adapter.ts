import {
  getWltCaptainFinanceSnapshot,
  getWltDshFinanceRecordsForActor,
  type WltCaptainFinanceSection,
  type WltDshFinancePreviewRecord,
} from '../../control-panel/dsh/financeContracts';

export function getSnapshot() {
  return getWltCaptainFinanceSnapshot();
}

export function getRecords() {
  return getWltDshFinanceRecordsForActor('captain');
}

export function getSections() {
  return ['eligibility', 'cod-liability', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export function getRecordsForSection(section: WltCaptainFinanceSection): WltDshFinancePreviewRecord[] {
  const records = getRecords();

  if (section === 'eligibility') {
    return [];
  }

  if (section === 'cod-liability') {
    return records.filter((record) => record.kind === 'captain-cod-liability');
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
