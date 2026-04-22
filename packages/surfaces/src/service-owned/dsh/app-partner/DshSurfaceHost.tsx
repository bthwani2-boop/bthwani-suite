import React from 'react';

export type DshRoute =
  | 'entry'
  | 'home'
  | 'orders-inbox'
  | 'order-detail'
  | 'store-maintenance'
  | 'inventory-management'
  | 'support'
  | 'success';

export type DshCommandTarget = 'home' | 'orders-inbox' | 'order-detail' | 'store-maintenance';

type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
  payload?: unknown;
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
      'orders-inbox': 'orders-inbox',
      'order-detail': 'order-detail',
      'store-maintenance': 'store-maintenance',
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
        <h1>Partner — Entry</h1>
        <p>مخطط شاشة الدخول لشريك المتجر (Partner).</p>
      </div>
    );
  }

  if (route === 'orders-inbox') {
    return (
      <div>
        <h1>Partner — Orders Inbox</h1>
        <button onClick={handleBack}>Back</button>
        <p>قائمة الطلبات placeholder.</p>
      </div>
    );
  }

  if (route === 'order-detail') {
    return (
      <div>
        <h1>Partner — Order Detail</h1>
        <button onClick={handleBack}>Back</button>
        <p>تفاصيل الطلب placeholder.</p>
      </div>
    );
  }

  if (route === 'store-maintenance') {
    return (
      <div>
        <h1>Partner — Store Maintenance</h1>
        <button onClick={handleBack}>Back</button>
        <p>صيانة المتجر placeholder.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Partner — {route}</h1>
      <button onClick={handleBack}>Back</button>
    </div>
  );
}

export default DshSurfaceHost;
