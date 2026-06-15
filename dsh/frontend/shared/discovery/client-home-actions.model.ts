// Canonical location: dsh/frontend/shared/discovery/client-home-actions.model.ts
// Authority: dsh/frontend/shared/discovery — client home actions topic model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export type ClientHomeActionsModelProps = {
  homeActions: any;
};

export function useDshClientHomeActionsTopicModel({
  homeActions,
}: ClientHomeActionsModelProps) {
  const { handleClientBottomNavSelect } = homeActions;

  return {
    handleClientBottomNavSelect,
  };
}
