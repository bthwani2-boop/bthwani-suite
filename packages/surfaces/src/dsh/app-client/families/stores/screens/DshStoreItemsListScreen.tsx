import React from 'react';
import { DshStoreItemsScreen, type DshStoreItemsScreenProps } from './DshStoreItemsScreen';

export type DshStoreItemsListScreenProps = DshStoreItemsScreenProps;

export function DshStoreItemsListScreen(props: DshStoreItemsListScreenProps) {
  return <DshStoreItemsScreen {...props} />;
}

export default DshStoreItemsListScreen;