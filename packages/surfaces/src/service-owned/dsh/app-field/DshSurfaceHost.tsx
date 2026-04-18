import React from 'react';

export type DshRoute =
  | 'entry'
  | 'home'
  | 'store-activation'
  | 'visit-log'
  | 'geo-pin'
  | 'inventory-management'
  | 'support'
  | 'success';

export type DshCommandTarget = 'home' | 'store-activation' | 'visit-log' | 'geo-pin';

type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
  payload?: any;
};

type DshSurfaceHostProps = {
  command?: DshNavigationCommand;
  onExit?: () => void;
  initialRoute?: DshRoute;
};

export function DshSurfaceHost({ command, onExit, initialRoute = 'entry' }: DshSurfaceHostProps) {
  const [route, setRoute] = React.useState<DshRoute>(initialRoute);
  const routeHistoryRef = React.useRef<DshRoute[]>([initialRoute]);

  React.useEffect(() => {
    if (!command) return;
    const map: Record<DshCommandTarget, DshRoute> = {
      home: 'home',
      'store-activation': 'store-activation',
      'visit-log': 'visit-log',
      'geo-pin': 'geo-pin',
    };
    const next = map[command.target] ?? initialRoute;
    if (next !== route) {
      routeHistoryRef.current.push(next);
      setRoute(next);
    }
  }, [command, initialRoute, route]);

  const handleBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeHistoryRef.current.pop();
      setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1]);
    } else {
      onExit?.();
    }
  }, [onExit]);

  if (route === 'entry') {
    return (
      <div>
        <h1>Field — Entry</h1>
        <p>مخطط شاشة الدخول لموظف الميدان (Field).</p>
      </div>
    );
  }

  if (route === 'store-activation') {
    return (
      <div>
        <h1>Field — Store Activation</h1>
        <button onClick={handleBack}>Back</button>
        <p>تفعيل المتجر placeholder.</p>
      </div>
    );
  }

  if (route === 'visit-log') {
    return (
      <div>
        <h1>Field — Visit Log</h1>
        <button onClick={handleBack}>Back</button>
        <p>سجل الزيارات placeholder.</p>
      </div>
    );
  }

  if (route === 'geo-pin') {
    return (
      <div>
        <h1>Field — Geo Pin</h1>
        <button onClick={handleBack}>Back</button>
        <p>تحديد الموقع الجغرافي placeholder.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Field — {route}</h1>
      <button onClick={handleBack}>Back</button>
    </div>
  );
}

export default DshSurfaceHost;
