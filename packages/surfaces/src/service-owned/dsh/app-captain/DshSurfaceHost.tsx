import React from 'react';

export type DshRoute =
  | 'entry'
  | 'home'
  | 'wallet'
  | 'support'
  | 'success';

export type DshCommandTarget = 'home' | 'orders-inbox' | 'order-detail' | 'wallet';

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
      'orders-inbox': 'orders-inbox',
      'order-detail': 'order-detail',
      wallet: 'wallet',
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
        <h1>Captain — Entry</h1>
        <p>مخطط شاشة الدخول لقائد الخدمة (Captain).</p>
      </div>
    );
  }

  if (route === 'orders-inbox') {
    return (
      <div>
        <h1>Captain — Orders Inbox</h1>
        <button onClick={handleBack}>Back</button>
        <p>قائمة المهام placeholder.</p>
      </div>
    );
  }

  if (route === 'order-detail') {
    return (
      <div>
        <h1>Captain — Order Detail</h1>
        <button onClick={handleBack}>Back</button>
        <p>تفاصيل المهمة placeholder.</p>
      </div>
    );
  }

  if (route === 'wallet') {
    return (
      <div>
        <h1>Captain — Wallet</h1>
        <button onClick={handleBack}>Back</button>
        <p>محفظة القائد placeholder.</p>
      </div>
    );
  }

  if (route === 'support') {
    return (
      <div>
        <h1>Captain — Support</h1>
        <button onClick={handleBack}>Back</button>
        <p>شاشات الدعم placeholder.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Captain — {route}</h1>
      <button onClick={handleBack}>Back</button>
    </div>
  );
}

export default DshSurfaceHost;

