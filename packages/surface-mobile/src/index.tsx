import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type BrowserRoute = {
  id: string;
  candidateId: string;
  phase: string;
  status: string;
};

type FixtureLocation = {
  candidateId: string;
  canonicalTarget: string;
  surface: string;
  phase: string;
  mode: string;
  location: string;
  status: string;
};

type SurfaceShellDefinition = {
  appRoot: string;
  service: string;
  surface: string;
  shellStatus: string;
  phaseGate: string;
  optionalBranch?: boolean;
  theme: {
    surface: string;
    direction?: string;
    localeSupport?: readonly string[];
    shellTone?: string;
    shellIa?: readonly string[];
    layoutShell?: string;
    safeAreaMode?: string;
  };
  navigationContainer: {
    kind: string;
    surface: string;
    initialRouteId: string | null;
    previewRouteIds: readonly string[];
    mode: string;
  };
  previewRoutes: readonly BrowserRoute[];
  nonRouteCandidates?: readonly string[];
  constraints?: readonly string[];
};

type SurfaceMobilePreviewProps = {
  shell: SurfaceShellDefinition;
  fixtureLocations?: readonly FixtureLocation[];
};

type SurfaceMeta = {
  title: string;
  summary: string;
  accent: string;
};

const surfaceMetaCatalog: Record<string, SurfaceMeta> = {
  'app-client': {
    title: 'Client App',
    summary: 'تصفح فعلي لمسارات العميل عبر Expo Go تمهيداً لإضافة الشاشات التفصيلية.',
    accent: '#c0611c',
  },
  'app-partner': {
    title: 'Partner App',
    summary: 'تصفح فعلي لمسارات الشريك مع قشرة تشغيل جاهزة للتوسعة اللاحقة.',
    accent: '#0f6a7a',
  },
  'app-captain': {
    title: 'Captain App',
    summary: 'تصفح فعلي لمسارات الكابتن على هاتف حقيقي عبر Expo Go.',
    accent: '#7b3fc6',
  },
  'app-field': {
    title: 'Field App',
    summary: 'تصفح فعلي لمسار الدعم الميداني الاختياري من الهاتف.',
    accent: '#3b7a36',
  },
};

function getSurfaceMeta(surface: string): SurfaceMeta {
  return surfaceMetaCatalog[surface] ?? {
    title: surface,
    summary: 'قشرة Mobile Preview جاهزة للتصفح عبر Expo Go.',
    accent: '#915019',
  };
}

function formatRouteLabel(routeId: string): string {
  return routeId
    .split('-')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function inferRouteSummary(route: BrowserRoute): string {
  if (route.id.includes('home')) {
    return 'نقطة دخول فعلية لبدء التنقل بين الشاشات والانتقال لاحقاً إلى المكونات الحقيقية.';
  }

  if (route.id.includes('workspace')) {
    return 'مساحة عمل فعلية جاهزة لاستقبال مكونات الشاشة، الحالات، والأدوات المرافقة.';
  }

  if (route.id.includes('tracking')) {
    return 'واجهة متابعة قابلة لاحتواء الحالة والخط الزمني والخرائط والتحديثات اللاحقة.';
  }

  if (route.id.includes('board')) {
    return 'شاشة قائمة أو لوحة تشغيل جاهزة لإضافة البطاقات والفرز والتجميع لاحقاً.';
  }

  if (route.id.includes('confirm')) {
    return 'شاشة تأكيد أولية جاهزة لإضافة الملخص والتحقق وأزرار الإرسال.';
  }

  return 'قشرة شاشة فعلية على الموبايل قابلة للتصفح الآن عبر Expo Go.';
}

function inferScreenSlots(routeId: string): string[] {
  if (routeId.includes('home')) {
    return ['hero block', 'quick actions', 'state strip', 'route launcher'];
  }

  if (routeId.includes('workspace')) {
    return ['header', 'primary content', 'action rail', 'support block'];
  }

  if (routeId.includes('tracking')) {
    return ['status hero', 'timeline', 'map block', 'secondary actions'];
  }

  if (routeId.includes('board')) {
    return ['filters', 'list or board', 'summary bar', 'action footer'];
  }

  return ['header', 'content block', 'state block', 'action block'];
}

export function SurfaceMobilePreviewApp({ shell, fixtureLocations = [] }: SurfaceMobilePreviewProps) {
  const routes = shell.previewRoutes;
  const initialRouteId = shell.navigationContainer.initialRouteId ?? routes[0]?.id ?? null;
  const [activeRouteId, setActiveRouteId] = useState<string | null>(initialRouteId);
  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes]);
  const fixtureMap = useMemo(
    () => new Map(fixtureLocations.map((fixture) => [fixture.candidateId, fixture])),
    [fixtureLocations],
  );
  const activeRoute = (activeRouteId ? routeMap.get(activeRouteId) : undefined) ?? routes[0];
  const activeFixture = activeRoute ? fixtureMap.get(activeRoute.candidateId) : undefined;
  const surfaceMeta = getSurfaceMeta(shell.surface);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7efe3" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, { borderColor: surfaceMeta.accent }]}> 
          <Text style={styles.eyebrow}>Expo Go Preview</Text>
          <Text style={styles.title}>{surfaceMeta.title}</Text>
          <Text style={styles.summary}>{surfaceMeta.summary}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Phase</Text>
              <Text style={styles.metaValue}>{shell.phaseGate}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Service</Text>
              <Text style={styles.metaValue}>{shell.service}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Mode</Text>
              <Text style={styles.metaValue}>{shell.navigationContainer.mode}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>المسارات الجاهزة للتصفح</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeScroller}>
            {routes.map((route) => {
              const isActive = activeRoute?.id === route.id;

              return (
                <Pressable
                  key={route.id}
                  accessibilityRole="button"
                  onPress={() => setActiveRouteId(route.id)}
                  style={({ pressed }) => [
                    styles.routeChip,
                    isActive ? [styles.routeChipActive, { borderColor: surfaceMeta.accent, backgroundColor: '#fff8f1' }] : null,
                    pressed ? styles.routeChipPressed : null,
                  ]}
                >
                  <Text style={[styles.routeChipTitle, isActive ? { color: surfaceMeta.accent } : null]}>{formatRouteLabel(route.id)}</Text>
                  <Text style={styles.routeChipMeta}>{route.candidateId}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>الشاشة الحالية</Text>
          <Text style={styles.routeTitle}>{activeRoute ? formatRouteLabel(activeRoute.id) : 'No route active'}</Text>
          <Text style={styles.summary}>{activeRoute ? inferRouteSummary(activeRoute) : 'لا توجد شاشة فعالة حالياً.'}</Text>

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Candidate ID</Text>
            <Text style={styles.detailValue}>{activeRoute?.candidateId ?? 'pending'}</Text>
          </View>

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Fixture Location</Text>
            <Text style={styles.detailCode}>{activeFixture?.location ?? 'awaiting-local-fixtures'}</Text>
          </View>

          <View style={styles.slotList}>
            {activeRoute
              ? inferScreenSlots(activeRoute.id).map((slot) => (
                  <View key={slot} style={styles.slotPill}>
                    <Text style={styles.slotText}>{slot}</Text>
                  </View>
                ))
              : null}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>قيود التنفيذ الحالية</Text>
          {(shell.constraints ?? []).map((constraint) => (
            <Text key={constraint} style={styles.listItem}>
              • {constraint}
            </Text>
          ))}
          {shell.optionalBranch ? (
            <Text style={styles.optionalNote}>هذا السطح مصنف حالياً كفرع اختياري لكنه قابل للمعاينة عبر Expo Go.</Text>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>عناصر غير مسارية</Text>
          {(shell.nonRouteCandidates ?? []).length ? (
            (shell.nonRouteCandidates ?? []).map((candidate) => (
              <Text key={candidate} style={styles.listItem}>
                • {candidate}
              </Text>
            ))
          ) : (
            <Text style={styles.summary}>لا توجد عناصر غير مسارية مفعلة حالياً.</Text>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Theme و IA</Text>
          <Text style={styles.listItem}>• {shell.theme.shellTone ?? 'shell-tone-pending'}</Text>
          <Text style={styles.listItem}>• {shell.theme.layoutShell ?? shell.theme.safeAreaMode ?? 'layout-shell-pending'}</Text>
          {(shell.theme.shellIa ?? []).map((item) => (
            <Text key={item} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7efe3',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    borderWidth: 1.5,
    backgroundColor: '#fffaf3',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  eyebrow: {
    color: '#8a4a17',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#17212b',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  summary: {
    color: '#5b6672',
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  metaPill: {
    minWidth: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#efe3d5',
  },
  metaLabel: {
    color: '#7a8590',
    fontSize: 11,
    marginBottom: 4,
  },
  metaValue: {
    color: '#17212b',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#fffaf4',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eedfce',
  },
  sectionTitle: {
    color: '#17212b',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  routeScroller: {
    paddingRight: 4,
  },
  routeChip: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ece3d9',
    marginRight: 12,
  },
  routeChipActive: {
    shadowColor: '#7f4a14',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  routeChipPressed: {
    opacity: 0.85,
  },
  routeChipTitle: {
    color: '#17212b',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  routeChipMeta: {
    color: '#74808c',
    fontSize: 12,
  },
  routeTitle: {
    color: '#17212b',
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 8,
  },
  detailBlock: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#efe4d8',
  },
  detailLabel: {
    color: '#78838f',
    fontSize: 12,
    marginBottom: 6,
  },
  detailValue: {
    color: '#17212b',
    fontSize: 14,
    fontWeight: '700',
  },
  detailCode: {
    color: '#5d6874',
    fontSize: 13,
  },
  slotList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  slotPill: {
    backgroundColor: '#eef5f6',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  slotText: {
    color: '#155d67',
    fontSize: 12,
    fontWeight: '700',
  },
  listItem: {
    color: '#44505d',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 6,
  },
  optionalNote: {
    color: '#2f6f38',
    fontSize: 13,
    marginTop: 10,
  },
});