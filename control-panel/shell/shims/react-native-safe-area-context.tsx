import React from 'react';

export const SafeAreaInsetsContext = React.createContext({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export function useSafeAreaInsets() {
  return React.useContext(SafeAreaInsetsContext);
}

export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      {children}
    </SafeAreaInsetsContext.Provider>
  );
}

export const SafeAreaView = ({ children, style }: any) => (
  <div style={style}>{children}</div>
);

export default {
  useSafeAreaInsets,
  SafeAreaProvider,
  SafeAreaView,
  SafeAreaInsetsContext,
};
