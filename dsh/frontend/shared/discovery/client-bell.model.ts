// Canonical location: dsh/frontend/shared/discovery/client-bell.model.ts
// Authority: dsh/frontend/shared/discovery — client notification bell model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export type ClientBellModelProps = {
  notificationsModel: any;
};

export function useDshClientBellModel({
  notificationsModel,
}: ClientBellModelProps) {
  const { handleServiceLauncherPress } = notificationsModel;

  return {
    handleServiceLauncherPress,
  };
}
