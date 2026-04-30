// Exchange/Gold prices — read-only market dashboard. API: GET /api/exchangeprice
// WAVE 8: Layout direction (start/end) from useI18n().isRTL only; rows use direction (ltr/rtl) + row so content follows start/end; textAlignStart for cells. Same for all screens.

function getBaseUrl(override?: string | null): string {
  const raw =
    (override != null && override !== '')
      ? override
      : (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_URL) || '';
  const baseUrl = String(raw).replace(/\/+$/, '');
  return baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
}

function parseAmountFromInput(input: string, t: (key: string) => string): number {
  const ar = t('surfaces.٠١٢٣٤٥٦٧٨٩');
  let normalized = input.replace(/,/g, '').trim();
  for (let i = 0; i < 10; i++) normalized = normalized.replace(new RegExp(ar[i], 'g'), String(i));
  return parseFloat(normalized) || 0;
}

/** وقت قصير للتحديث: 8:57 ص */
function formatUpdateTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getCurrencyNames(t: (key: string) => string): Record<string, string> {
  return {
    USD: t('surfaces.الدولار_الأمريكي'),
    SAR: t('surfaces.الريال_السعودي'),
    AED: t('surfaces.الدرهم_الإماراتي'),
    EUR: t('surfaces.اليورو'),
    GBP: t('surfaces.الجنيه_الإسترليني'),
    CNY: t('surfaces.اليوان_الصيني'),
    KWD: t('surfaces.الدينار_الكويتي'),
    OMR: t('surfaces.الريال_العماني'),
    BHD: t('surfaces.الدينار_البحريني'),
    QAR: t('surfaces.الريال_القطري'),
    EGP: t('surfaces.الجنيه_المصري'),
    JOD: t('surfaces.الدينار_الأردني'),
    TRY: t('surfaces.الليرة_التركية'),
    INR: t('surfaces.الروبية_الهندية'),
    PKR: t('surfaces.الروبية_الباكستانية'),
    LBP: t('surfaces.الليرة_اللبنانية'),
    IQD: t('surfaces.الدينار_العراقي'),
    SYP: t('surfaces.الليرة_السورية'),
    SDG: t('surfaces.الجنيه_السوداني'),
    TND: t('surfaces.الدينار_التونسي'),
    MAD: t('surfaces.الدرهم_المغربي'),
    DZD: t('surfaces.الدينار_الجزائري'),
  };
}

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = BTHWANI_COLORS.primary;
const ACCENT = BTHWANI_COLORS.accent;
const GOLD = BTHWANI_COLORS.warning;
const SUCCESS = BTHWANI_COLORS.onSuccess;
const DANGER = BTHWANI_COLORS.danger;
const WHITE = BTHWANI_COLORS.surface;
const TEXT_DARK = BTHWANI_COLORS.onPrimaryContainer;
const MUTED = BTHWANI_COLORS.onSurfaceMuted;
const ROW_BG = BTHWANI_COLORS.background;
const BORDER = BTHWANI_COLORS.borderSubtle;

type Region = 'sanaa' | 'aden';

interface CurrencyRate {
  code: string;
  buy: number;
  sell: number;
}

interface GoldPrice {
  karat: number;
  price: number;
}

interface ExchangePriceData {
  updated_at: string;
  currencies: CurrencyRate[];
  gold: GoldPrice[];
  zakat: { nisab: number; rate: number };
}

interface auto_wlt_exchangepriceProps {
  apiBaseUrl?: string | null;
}

export const auto_wlt_exchangeprice: React.FC<auto_wlt_exchangepriceProps> = ({ apiBaseUrl }) => {
  const { t, isRTL } = useI18n();
  const ns = 'wlt.exchangeprice';
  const currencyNames = React.useMemo(() => getCurrencyNames(t), [t]);
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [data, setData] = useState<ExchangePriceData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [region, setRegion] = useState<Region>('sanaa');
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [zakatSectionOpen, setZakatSectionOpen] = useState(false);
  const [zakatAmount, setZakatAmount] = useState('');
  const hasSetZakatDefaultRef = useRef(false);

  const load = useCallback(async () => {
    try {
      setState('loading');
      const base = getBaseUrl(apiBaseUrl);
      const res = await rawFetch(`${base}/api/exchangeprice`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ExchangePriceData;
      if (!json.currencies || !json.gold || !json.zakat) throw new Error('Invalid response');
      setData(json);
      setState('content');
    } catch {
      setState('error');
    } finally {
      setRefreshing(false);
    }
  }, [apiBaseUrl]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (data && zakatSectionOpen && !hasSetZakatDefaultRef.current) {
      setZakatAmount(data.zakat.nisab.toLocaleString('ar-YE'));
      hasSetZakatDefaultRef.current = true;
    }
  }, [data, zakatSectionOpen]);

  const handleRetry = () => {
    setData(null);
    load();
  };

  const toggleZakatSection = () => {
    if (!zakatSectionOpen && data) setZakatAmount(data.zakat.nisab.toLocaleString('ar-YE'));
    setZakatSectionOpen((o) => !o);
  };

  const fillNisab = () => {
    if (data) setZakatAmount(data.zakat.nisab.toLocaleString('ar-YE'));
  };

  const onCalculate = () => {
    if (!zakatSectionOpen) setZakatSectionOpen(true);
  };

  if (state === 'content' && data) {
    const updateTime = formatUpdateTime(data.updated_at);
    const nisabFormatted = data.zakat.nisab.toLocaleString('ar-YE');
    const zakatNum = parseAmountFromInput(zakatAmount, t);
    const zakatResultNum = zakatNum * (data.zakat.rate / 100);
    const zakatResult = zakatResultNum.toLocaleString('ar-YE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <ScreenWrapper state="content">
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ACCENT]} tintColor={ACCENT} />
          }
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: TEXT_DARK }]}>{t(`${ns}.title`)}</Text>
              <Text style={[styles.subtitle, { color: MUTED }]}>{t(`${ns}.subtitle`)}</Text>
            </View>

            <View style={[styles.heroBar, { backgroundColor: WHITE, borderColor: BORDER }, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={[styles.segmentRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <TouchableOpacity
                  style={[styles.segment, region === 'sanaa' && { backgroundColor: PRIMARY }]}
                  onPress={() => setRegion('sanaa')}
                >
                  <Text style={[styles.segmentText, { color: region === 'sanaa' ? WHITE : TEXT_DARK }]}>{t(`${ns}.region_sanaa`)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, region === 'aden' && { backgroundColor: PRIMARY }]}
                  onPress={() => setRegion('aden')}
                >
                  <Text style={[styles.segmentText, { color: region === 'aden' ? WHITE : TEXT_DARK }]}>{t(`${ns}.region_aden`)}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.heroStatusRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={[styles.heroStatusText, { color: MUTED }]}>{t(`${ns}.lastUpdate`, { time: updateTime })}</Text>
                <View style={styles.liveDot} />
                <Text style={[styles.liveLabel, { color: SUCCESS }]}>{t(`${ns}.live`)}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: TEXT_DARK }]}>{t(`${ns}.currencies`)}</Text>
            <View style={[styles.tablePanel, { backgroundColor: WHITE, borderColor: BORDER }]}>
              <View style={[styles.tableHeader, { borderColor: BORDER }, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={[styles.tableHeaderCell, styles.cellName, { color: MUTED }]}>{t(`${ns}.currency`)}</Text>
                <Text style={[styles.tableHeaderCell, styles.cellNum, { color: MUTED }]}>{t(`${ns}.buy`)}</Text>
                <Text style={[styles.tableHeaderCell, styles.cellNum, { color: MUTED }]}>{t(`${ns}.sell`)}</Text>
                <Text style={[styles.tableHeaderCell, styles.cellChange, { color: MUTED }]}>{t(`${ns}.change`)}</Text>
              </View>
              {data.currencies.map((c, i) => (
                <View key={c.code} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? WHITE : ROW_BG, borderColor: BORDER }, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={[styles.cellName, { color: TEXT_DARK }]} numberOfLines={1}>
                    {currencyNames[c.code] || c.code}
                  </Text>
                  <Text style={[styles.cellValue, { color: TEXT_DARK, textAlign: textAlignStart }]}>{c.buy.toLocaleString('ar-YE')}</Text>
                  <Text style={[styles.cellValue, { color: TEXT_DARK, textAlign: textAlignStart }]}>{c.sell.toLocaleString('ar-YE')}</Text>
                  <Text style={[styles.cellChange, { color: MUTED }]}>—</Text>
                </View>
              ))}
            </View>

            <View style={[styles.goldPanel, { backgroundColor: 'BTHWANI_COLORS.goldTint', borderColor: BORDER }]}>
              <View style={[styles.goldPanelHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={[styles.sectionTitle, { color: TEXT_DARK }]}>{t(`${ns}.gold`)}</Text>
                <Text style={[styles.goldUpdateText, { color: MUTED }]}>{t(`${ns}.updateTime`, { time: updateTime })}</Text>
                <View style={[styles.goldIcon, { backgroundColor: GOLD }]} />
              </View>
              {data.gold.map((g) => (
                <View key={g.karat} style={[styles.goldRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={[styles.goldKarat, { color: TEXT_DARK }]}>{t(`${ns}.karat`, { karat: g.karat })}</Text>
                  <Text style={[styles.goldPrice, { color: PRIMARY }]}>{g.price.toLocaleString('ar-YE')} {t(`${ns}.currencyPerGram`)}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.nisabCard, { backgroundColor: WHITE, borderColor: BORDER }]}>
              <Text style={[styles.nisabTitle, { color: MUTED }]}>{t(`${ns}.nisabTitle`)}</Text>
              <View style={[styles.nisabValueRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={[styles.nisabValue, { color: TEXT_DARK }]}>{nisabFormatted} {t(`${ns}.currencyShort`)}</Text>
                <View style={[styles.nisabBadge, { backgroundColor: PRIMARY }]}>
                  <Text style={styles.nisabBadgeText}>{data.zakat.rate}%</Text>
                </View>
              </View>
              <Text style={[styles.nisabHint, { color: MUTED }]}>{t(`${ns}.nisabHint`)}</Text>
            </View>

            <View style={[styles.calcCard, { backgroundColor: WHITE, borderColor: BORDER }]}>
              <TouchableOpacity style={[styles.collapsibleHeader, { flexDirection: 'row', direction: layoutDirection }]} onPress={toggleZakatSection} activeOpacity={0.7}>
                <Text style={[styles.sectionTitle, { color: TEXT_DARK }]}>{t(`${ns}.calcZakatTitle`)}</Text>
                <Ionicons name={zakatSectionOpen ? 'chevron-up' : 'chevron-down'} size={22} color={MUTED} />
              </TouchableOpacity>
              {zakatSectionOpen && (
                <View style={styles.calcBody}>
                  <View style={[styles.calcInputRow, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={[styles.calcLabel, { color: MUTED }]}>{t(`${ns}.amount`)}</Text>
                    <TouchableOpacity onPress={fillNisab}>
                      <Text style={[styles.useNisabText, { color: ACCENT }]}>{t(`${ns}.useNisab`)}</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.calcInput, { color: TEXT_DARK, borderColor: BORDER }]}
                    value={zakatAmount}
                    onChangeText={setZakatAmount}
                    placeholder="0"
                    placeholderTextColor={MUTED}
                    keyboardType="decimal-pad"
                  />
                  <View style={[styles.calcResultRow, { backgroundColor: ROW_BG }, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={[styles.calcResultLabel, { color: MUTED }]}>{t(`${ns}.zakatResultLabel`)}</Text>
                    <Text style={[styles.calcResultValue, { color: PRIMARY }]}>{zakatResult} {t(`${ns}.currencyShort`)}</Text>
                  </View>
                  <TouchableOpacity style={[styles.ctaButton, { backgroundColor: PRIMARY }]} onPress={onCalculate} activeOpacity={0.85}>
                    <Text style={[styles.ctaText, { color: WHITE }]}>{t(`${ns}.calcNow`)}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.bottomSpacer} />
          </KeyboardAvoidingView>
        </ScrollView>

        <Modal visible={regionModalVisible} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setRegionModalVisible(false)}>
            <View style={[styles.modalContent, { backgroundColor: WHITE }]}>
              <Text style={[styles.modalTitle, { color: TEXT_DARK }]}>{t(`${ns}.chooseRegion`)}</Text>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setRegion('sanaa'); setRegionModalVisible(false); }}>
                <Text style={{ color: TEXT_DARK }}>{t(`${ns}.region_sanaa`)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setRegion('aden'); setRegionModalVisible(false); }}>
                <Text style={{ color: TEXT_DARK }}>{t(`${ns}.region_aden`)}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('wlt.exchangeprice.loading')}
      errorMessage={`${t('wlt.exchangeprice.loadError')} ${t('wlt.exchangeprice.errorHint')}`}
      onErrorAction={handleRetry}
    />
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: BTHWANI_SPACING.sm, paddingBottom: 24 },
  keyboardView: { flex: 1 },
  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 13 },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  segmentRow: { flexDirection: 'row', gap: 4 },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  segmentText: { fontSize: 14, fontWeight: '600' },
  heroStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroStatusText: { fontSize: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: SUCCESS },
  liveLabel: { fontSize: 12, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  tablePanel: {
    borderWidth: 1,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tableHeaderCell: { fontSize: 12, fontWeight: '600' },
  cellName: { flex: 2 },
  cellNum: { flex: 1 },
  cellChange: { flex: 0.7 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cellValue: { fontSize: 14, fontWeight: '600', flex: 1 },
  goldPanel: {
    borderWidth: 1,
    borderRadius: BTHWANI_RADIUS.md,
    padding: 10,
    marginBottom: 10,
  },
  goldPanelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  goldUpdateText: { fontSize: 11 },
  goldIcon: { width: 20, height: 20, borderRadius: 10 },
  goldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  goldKarat: { fontSize: 14, fontWeight: '600' },
  goldPrice: { fontSize: 13, fontWeight: '600' },
  nisabCard: {
    borderWidth: 1,
    borderRadius: BTHWANI_RADIUS.md,
    padding: 12,
    marginBottom: 10,
  },
  nisabTitle: { fontSize: 13, marginBottom: 4 },
  nisabValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  nisabValue: { fontSize: 20, fontWeight: '700' },
  nisabBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99 },
  nisabBadgeText: { color: WHITE, fontSize: 12, fontWeight: '700' },
  nisabHint: { fontSize: 11 },
  calcCard: {
    borderWidth: 1,
    borderRadius: BTHWANI_RADIUS.md,
    padding: 10,
    marginBottom: 8,
  },
  collapsibleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calcBody: { marginTop: 10 },
  calcInputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  calcLabel: { fontSize: 13 },
  useNisabText: { fontSize: 12, fontWeight: '600' },
  calcInput: {
    borderWidth: 1,
    borderRadius: BTHWANI_RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  calcResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: BTHWANI_RADIUS.sm,
    marginBottom: 10,
  },
  calcResultLabel: { fontSize: 13 },
  calcResultValue: { fontSize: 18, fontWeight: '700' },
  ctaButton: {
    paddingVertical: 12,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '600' },
  bottomSpacer: { height: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'BTHWANI_COLORS.overlay40', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { borderRadius: BTHWANI_RADIUS.lg, padding: 20, minWidth: 240 },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  modalOption: { paddingVertical: 12 },
});

export default auto_wlt_exchangeprice;
