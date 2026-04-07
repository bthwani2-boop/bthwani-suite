import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { getWorkspaceSurfaceSpec, getWorkspaceSurfaceUrl, workspaceSurfaceOrder } from './workspace-surfaces';

export type BrowserRoute = {
  id: string;
  candidateId: string;
  phase: string;
  status: string;
};

export type FixtureLocation = {
  candidateId: string;
  canonicalTarget: string;
  surface: string;
  phase: string;
  mode: string;
  location: string;
  status: string;
};

export type SurfaceShellDefinition = {
  appRoot: string;
  service: string;
  surface: string;
  shellStatus: string;
  phaseGate: string;
  theme: {
    surface: string;
    direction?: string;
    localeSupport?: readonly string[];
    shellTone?: string;
    shellIa?: readonly string[];
    layoutShell?: string;
    safeAreaMode?: string;
  };
  assetLoading?: {
    status: string;
    sources: readonly string[];
  };
  layout?: Record<string, unknown>;
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
  currentServiceExclusions?: readonly string[];
};

export type SurfaceBrowserAppOptions = {
  shell: SurfaceShellDefinition;
  fixtureLocations?: readonly FixtureLocation[];
};

function readHashRoute(): string {
  const normalizedHash = window.location.hash.replace(/^#\/?/, '').trim();

  return decodeURIComponent(normalizedHash);
}

function subscribeToHashChange(listener: () => void): () => void {
  window.addEventListener('hashchange', listener);

  return () => window.removeEventListener('hashchange', listener);
}

function setHashRoute(routeId: string): void {
  const nextHash = `#/${encodeURIComponent(routeId)}`;

  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
  }
}

function formatRouteLabel(routeId: string): string {
  return routeId
    .split('-')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function inferRouteSummary(route: BrowserRoute): string {
  if (route.id.includes('board')) {
    return 'واجهة تجميع ومراقبة أولية قابلة لتوصيل البطاقات والشبكات والفلترة لاحقاً.';
  }

  if (route.id.includes('workspace')) {
    return 'مساحة عمل أولية لربط الأدوات والإجراءات والمناطق الجانبية عند بدء التنفيذ التفصيلي.';
  }

  if (route.id.includes('tracking')) {
    return 'مسار متابعة زمني قابل لربط الحالة والخريطة والتفاصيل الحية لاحقاً.';
  }

  if (route.id.includes('confirm')) {
    return 'خطوة تأكيد جاهزة لإضافة نماذج الإدخال والتلخيص والتحقق لاحقاً.';
  }

  if (route.id.includes('detail')) {
    return 'شاشة تفصيلية قابلة لاحتواء المقاطع الرئيسية والحقول والمرفقات في المرحلة التالية.';
  }

  if (route.id.includes('home')) {
    return 'بوابة دخول فعلية لتوزيع التنقل إلى الشاشات الفعلية عند إضافتها.';
  }

  return 'قشرة شاشة فعلية قابلة للتصفح الآن وجاهزة لاستقبال مكونات الشاشة لاحقاً.';
}

function inferScreenSlots(routeId: string): string[] {
  if (routeId.includes('home')) {
    return ['منطقة الترحيب', 'شبكة الوصول السريع', 'كتلة الحالات', 'قائمة التنقل'];
  }

  if (routeId.includes('board')) {
    return ['شريط التصفية', 'شبكة البطاقات', 'تفاصيل جانبية', 'شريط الإجراءات'];
  }

  if (routeId.includes('workspace')) {
    return ['رأس الشاشة', 'منطقة المحتوى الرئيسية', 'لوحة الإجراءات', 'companion area'];
  }

  if (routeId.includes('tracking')) {
    return ['الخط الزمني', 'ملخص الحالة', 'منطقة الخريطة', 'إجراءات المتابعة'];
  }

  if (routeId.includes('confirm')) {
    return ['ملخص الطلب', 'مدخلات التأكيد', 'رسائل التحقق', 'زر الإتمام'];
  }

  return ['رأس الشاشة', 'المحتوى الرئيسي', 'منطقة الحالة', 'منطقة الإجراءات'];
}

function formatLayoutEntryValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }

  return String(value);
}

function useHashRoute(): string {
  return useSyncExternalStore(subscribeToHashChange, readHashRoute, () => '');
}

function SurfaceBrowserApp({ shell, fixtureLocations = [] }: SurfaceBrowserAppOptions) {
  const spec = getWorkspaceSurfaceSpec(shell.surface);
  const routes = useMemo(
    () => shell.previewRoutes.map((route) => ({ ...route, label: formatRouteLabel(route.id) })),
    [shell.previewRoutes],
  );
  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes]);
  const fixtureMap = useMemo(
    () => new Map(fixtureLocations.map((fixture) => [fixture.candidateId, fixture])),
    [fixtureLocations],
  );
  const fallbackRouteId = shell.navigationContainer.initialRouteId ?? routes[0]?.id ?? null;
  const currentRouteId = useHashRoute();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.title = `${spec.label} | BTHWANI Suite`;
  }, [spec.label]);

  useEffect(() => {
    if (!fallbackRouteId) {
      return;
    }

    if (!currentRouteId || !routeMap.has(currentRouteId)) {
      setHashRoute(fallbackRouteId);
    }
  }, [currentRouteId, fallbackRouteId, routeMap]);

  const activeRoute =
    (currentRouteId ? routeMap.get(currentRouteId) : undefined) ??
    (fallbackRouteId ? routeMap.get(fallbackRouteId) : undefined) ??
    routes[0];
  const filteredRoutes = routes.filter((route) => {
    const haystack = `${route.id} ${route.candidateId} ${route.label}`.toLowerCase();

    return haystack.includes(searchTerm.trim().toLowerCase());
  });
  const activeFixture = activeRoute ? fixtureMap.get(activeRoute.candidateId) : undefined;
  const currentUrl = activeRoute ? `${getWorkspaceSurfaceUrl(shell.surface)}/#/${activeRoute.id}` : getWorkspaceSurfaceUrl(shell.surface);

  return (
    <div className={`surface-browser surface-browser--${spec.kind}`}>
      <aside className="surface-browser__sidebar">
        <div className="surface-browser__brand-block">
          <span className="surface-browser__eyebrow">BTHWANI Suite</span>
          <h1>{spec.label}</h1>
          <p>{spec.summary}</p>
        </div>

        <div className="surface-browser__meta-list">
          <div>
            <span>Phase Gate</span>
            <strong>{shell.phaseGate}</strong>
          </div>
          <div>
            <span>Shell Status</span>
            <strong>{shell.shellStatus}</strong>
          </div>
          <div>
            <span>Service</span>
            <strong>{shell.service}</strong>
          </div>
        </div>

        <label className="surface-browser__search">
          <span>ابحث عن مسار</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="route id أو candidate id"
          />
        </label>

        <nav className="surface-browser__route-list" aria-label="Route list">
          {filteredRoutes.map((route) => {
            const isActive = activeRoute?.id === route.id;

            return (
              <button
                key={route.id}
                type="button"
                className={isActive ? 'is-active' : ''}
                onClick={() => setHashRoute(route.id)}
              >
                <span>{route.label}</span>
                <small>{route.candidateId}</small>
              </button>
            );
          })}
        </nav>

        <div className="surface-browser__switcher">
          <h2>التنقل بين التطبيقات</h2>
          <div className="surface-browser__switcher-grid">
            {workspaceSurfaceOrder.map((surfaceId) => {
              const otherSpec = getWorkspaceSurfaceSpec(surfaceId);

              return (
                <a
                  key={surfaceId}
                  className={surfaceId === shell.surface ? 'is-current' : ''}
                  href={getWorkspaceSurfaceUrl(surfaceId)}
                >
                  <strong>{otherSpec.label}</strong>
                  <span>{otherSpec.port}</span>
                </a>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="surface-browser__content">
        <section className="surface-browser__hero">
          <div className="surface-browser__hero-copy">
            <span className="surface-browser__eyebrow">Active Route</span>
            <h2>{activeRoute ? activeRoute.label : 'No route selected'}</h2>
            <p>{activeRoute ? inferRouteSummary(activeRoute) : 'لا توجد مسارات مفعلة بعد.'}</p>
          </div>
          <div className="surface-browser__hero-stats">
            <article>
              <span>Route Count</span>
              <strong>{routes.length}</strong>
            </article>
            <article>
              <span>Non-route Candidates</span>
              <strong>{shell.nonRouteCandidates?.length ?? 0}</strong>
            </article>
            <article>
              <span>Direct URL</span>
              <strong className="surface-browser__mono">{currentUrl}</strong>
            </article>
          </div>
        </section>

        <section className={spec.kind === 'mobile' ? 'surface-browser__mobile-frame' : 'surface-browser__route-view'}>
          <div className="surface-browser__route-header">
            <div>
              <span className="surface-browser__eyebrow">Candidate</span>
              <h3>{activeRoute?.candidateId ?? 'Awaiting route'}</h3>
            </div>
            <div className="surface-browser__badges">
              <span>{activeRoute?.phase ?? shell.phaseGate}</span>
              <span>{activeRoute?.status ?? 'placeholder'}</span>
            </div>
          </div>

          <div className="surface-browser__route-columns">
            <article className="surface-browser__card">
              <h4>جاهزية الإدخال</h4>
              <ul>
                <li>المسار قابل للفتح مباشرة من الرابط.</li>
                <li>التنقل بين الشاشات فعال من القائمة الجانبية.</li>
                <li>القشرة الحالية لا تحتوي binding أو runtime truth.</li>
                <li>يمكن إضافة الشاشة الفعلية لاحقاً داخل نفس المسار دون كسر التنقل.</li>
              </ul>
            </article>

            <article className="surface-browser__card">
              <h4>نقاط إضافة الشاشة</h4>
              <ul>
                {activeRoute ? inferScreenSlots(activeRoute.id).map((slot) => <li key={slot}>{slot}</li>) : null}
              </ul>
            </article>

            <article className="surface-browser__card">
              <h4>Fixture Location</h4>
              <p className="surface-browser__mono">{activeFixture?.location ?? 'awaiting-local-screen-ownership'}</p>
              <div className="surface-browser__detail-pairs">
                <div>
                  <span>Canonical Target</span>
                  <strong>{activeFixture?.canonicalTarget ?? 'not-assigned-yet'}</strong>
                </div>
                <div>
                  <span>Mode</span>
                  <strong>{activeFixture?.mode ?? shell.navigationContainer.mode}</strong>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="surface-browser__grid">
          <article className="surface-browser__card">
            <h4>Theme And IA</h4>
            <div className="surface-browser__chips">
              <span>{shell.theme.shellTone ?? 'shell-tone-pending'}</span>
              <span>{shell.theme.layoutShell ?? 'layout-shell-pending'}</span>
              {(shell.theme.localeSupport ?? []).map((locale) => <span key={locale}>{locale}</span>)}
            </div>
            {shell.theme.shellIa?.length ? (
              <ul>
                {shell.theme.shellIa.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : (
              <p>لا توجد IA تفصيلية مفعلة بعد لهذا السطح.</p>
            )}
          </article>

          <article className="surface-browser__card">
            <h4>Constraints</h4>
            <ul>
              {(shell.constraints ?? []).map((constraint) => <li key={constraint}>{constraint}</li>)}
            </ul>
            {shell.currentServiceExclusions?.length ? (
              <>
                <h5>Current Exclusions</h5>
                <ul>
                  {shell.currentServiceExclusions.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </>
            ) : null}
          </article>

          <article className="surface-browser__card">
            <h4>Shell Layout</h4>
            <div className="surface-browser__detail-pairs">
              {Object.entries(shell.layout ?? {}).map(([key, value]) => (
                <div key={key}>
                  <span>{key}</span>
                  <strong>{formatLayoutEntryValue(value)}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export function mountSurfaceBrowserApp(options: SurfaceBrowserAppOptions): void {
  const target = document.getElementById('app');

  if (!target) {
    throw new Error('Missing #app mount element.');
  }

  createRoot(target).render(<SurfaceBrowserApp {...options} />);
}