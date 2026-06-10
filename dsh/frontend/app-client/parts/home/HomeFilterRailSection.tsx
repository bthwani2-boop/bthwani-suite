import * as React from 'react';
import { BThwaniFilterRail } from '@bthwani/ui-kit';
import type { HomeScreenShellProps } from './HomeScreenShell';

type HomeFilterRailSectionProps = Pick<HomeScreenShellProps, 'filterRail' | 'homeState' | 'styles'>;

export const HomeFilterRailSection = React.memo(function HomeFilterRailSection({
  filterRail,
  homeState,
  styles,
}: HomeFilterRailSectionProps) {
  return (
    <BThwaniFilterRail
      items={filterRail.homeFilterRailItems}
      selectedId={homeState.activeRailItemId}
      onSelectedIdChange={filterRail.handleHomeFilterRailChange}
      isSelected={filterRail.isHomeFilterRailItemSelected}
      sticky
      style={styles.filtersRail}
      testID="home-filter-rail"
    />
  );
});
