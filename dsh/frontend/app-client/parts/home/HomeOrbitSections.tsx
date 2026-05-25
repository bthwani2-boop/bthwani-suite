import * as React from 'react';
import { CategoryOrbitCarousel, ServiceOrbitCarousel, spacing } from '@bthwani/ui-kit';

import type { DshServiceId } from '../../contracts/dsh-home-types';
import { dshHomeServiceDialFixtures } from '../../data/home.preview-data';

const serviceDialAnchorLayout = {
  x: spacing[3],
  y: spacing[14],
  width: 46,
  height: 46,
};

export const HomeCategoryDialSection = React.memo(function HomeCategoryDialSection({
  props,
  homeState,
  categoriesDialItems,
  selectCategoryPage,
}: any) {
  return (
    <CategoryOrbitCarousel
      visible={homeState.categoriesSheetVisible}
      anchorLayout={homeState.categoriesDialLayout}
      items={categoriesDialItems}
      onClose={() => homeState.setCategoriesSheetVisible(false)}
      onSelect={(item: any) => {
        selectCategoryPage(item.key);
        homeState.setCategoriesSheetVisible(false);
        if (item.key === 'awnak') {
          props.onOpenCategory?.('awnak');
          return;
        }

        if (item.key === 'shein') {
          props.onOpenSheinInfo?.();
        }
      }}
    />
  );
});

export const HomeServiceDialSection = React.memo(function HomeServiceDialSection({
  props,
  homeState,
}: any) {
  return (
    <ServiceOrbitCarousel
      visible={homeState.serviceDialVisible}
      anchorLayout={serviceDialAnchorLayout}
      items={dshHomeServiceDialFixtures}
      onClose={() => homeState.setServiceDialVisible(false)}
      onSelect={(item: any) => {
        homeState.setServiceDialVisible(false);

        if (item.key === 'dsh') {
          return;
        }

        if (item.key === 'wlt') {
          props.onOpenWallet?.();
          return;
        }

        props.onOpenService?.(item.key as DshServiceId);
      }}
    />
  );
});
