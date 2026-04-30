import React from 'react';

export type DshRoute =
  | 'entry'
  | 'home'
  | 'orders-inbox'
  | 'order-detail'
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
        <h1>الكابتن — المدخل</h1>
        <p>مخطط شاشة الدخول لقائد الخدمة.</p>
      </div>
    );
  }

  if (route === 'orders-inbox') {
    return (
      <div>
        <h1>الكابتن — صندوق الطلبات</h1>
        <button onClick={handleBack}>عودة</button>
        <p>قائمة الطلبات placeholder.</p>
      </div>
    );
  }

  if (route === 'order-detail') {
    return (
      <div>
        <h1>الكابتن — تفاصيل الطلب</h1>
        <button onClick={handleBack}>عودة</button>
        <p>تفاصيل الطلب placeholder.</p>
      </div>
    );
  }

  if (route === 'wallet') {
    return (
      <div>
        <h1>الكابتن — المحفظة</h1>
        <button onClick={handleBack}>عودة</button>
        <p>محفظة القائد placeholder.</p>
      </div>
    );
  }

  if (route === 'support') {
    return (
      <div>
        <h1>الكابتن — الدعم</h1>
        <button onClick={handleBack}>عودة</button>
        <p>شاشات الدعم placeholder.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>الكابتن — {route}</h1>
      <button onClick={handleBack}>عودة</button>
    </div>
  );
}

export default DshSurfaceHost;
