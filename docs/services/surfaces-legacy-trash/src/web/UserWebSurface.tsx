// UserWebSurface - Web Surface Aggregator
// §86 Stage A: Isolation Complete, §87 SSoT in surfaces
// Zero Defects Implementation - Core Screens Only (Phase 1)

import React, { useState } from 'react';

// §87 Universal Surface Props Interface
export interface WebSurfaceProps {
  router?: any;   // Next.js router (injected by shell)
  theme: any;     // Material-UI Theme (injected by shell)
  platform?: 'web'; // Platform context (optional, defaults to web)
}
/** Alias for index.web.ts re-exports */
export type UserWebSurfaceProps = WebSurfaceProps;

// §86 Error Boundary for Crash-Proof Guarantee
import { ErrorBoundary } from '@bthwani/ui-kit';

// §86 Feature Flag System for Safe Rollout
import { useFeatureFlag } from '@bthwani/ui-kit';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';

// §86 Home Screen Component (SSoT in surfaces)
const WebHomeScreen = () => {
  const isNewSurfaceEnabled = useFeatureFlag('user-web-surface-v1');

  if (!isNewSurfaceEnabled) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🏗️ BTHWANI Web App</h1>
        <p>جاري تطوير الواجهة الجديدة</p>
        <p>🚧 Surface Under Development</p>
        <p>Feature Flag: user-web-surface-v1 = DISABLED</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🌐 BTHWANI Web Home</h1>
      <p>✅ UserWebSurface Active</p>
      <p>Web interface ready</p>
    </div>
  );
};

// §87 Main Surface Component with Simple Routing (Phase 1)
export const UserWebSurface: React.FC<WebSurfaceProps> = ({
  router,
  theme,
  platform = 'web'
}) => {
  // §86 Simple state-based routing for Phase 1
  const [currentRoute, setCurrentRoute] = useState<'home'>('home');

  // §86 Feature Flag Protection for entire surface
  const isSurfaceEnabled = useFeatureFlag('user-web-surface-v1');

  // §86 Route navigation function
  const navigateTo = (route: string) => {
    setCurrentRoute(route as any);
  };

  if (!isSurfaceEnabled) {
    return (
      <ErrorBoundary>
        <WebHomeScreen />
      </ErrorBoundary>
    );
  }

  // §86 Render current route based on state
  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <WebHomeScreen />;
      default:
        return <WebHomeScreen />;
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: colorTokens.surface.secondary }}>
        {/* §86 Simple Header */}
        <header style={{
          height: '60px',
          backgroundColor: theme?.palette?.primary?.main || colorTokens.primary['600'],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px BTHWANI_COLORS.overlay10'
        }}>
          <h1 style={{
            color: 'white',
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            BTHWANI Web
          </h1>
        </header>

        {/* §86 Route Content */}
        <main style={{ flex: 1 }}>
          {renderCurrentRoute()}
        </main>
      </div>
    </ErrorBoundary>
  );
};

// §87 Export with proper typing
export default UserWebSurface;
