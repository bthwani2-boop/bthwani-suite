import * as React from 'react';
import { SearchTopBar, ModernPremiumHeader } from '@bthwani/ui-kit';

export const HomeHeaderSection = React.memo(function HomeHeaderSection({
  props,
  homeState,
  uiText,
  styles,
  isRtl,
  ticker,
  openInlineSearch,
  closeInlineSearch,
  openServiceDial,
  handleOpenCartFromHeader,
  handleOpenMySpace,
}: any) {
  if (homeState.inlineSearchVisible) {
    return (
      <SearchTopBar
        value={homeState.inlineSearchQuery}
        onChangeText={homeState.setInlineSearchQuery}
        onClose={closeInlineSearch}
        variant="main"
        autoFocus
        placeholder="ابحث عن متجر، خدمة، أو فئة..."
        style={styles.brandTopBarShell}
      />
    );
  }

  return (
    <ModernPremiumHeader
      title={uiText.topBar.brandName}
      locationLabel={uiText.topBar.location}
      onSearchPress={openInlineSearch}
      onCartPress={handleOpenCartFromHeader}
      onNotificationsPress={props.onOpenNotifications}
      onProfilePress={handleOpenMySpace}
      onLauncherPress={openServiceDial}
      notificationCount={props.notificationCount}
      cartCount={props.cartCount}
      searchPlaceholder="ماذا تريد أن تطلب اليوم؟"
      tickerMessage={ticker.tickerState?.message ?? ''}
      onTickerPress={ticker.handleTickerAction}
      onLocationPress={undefined}
      direction={isRtl ? 'rtl' : 'ltr'}
    />
  );
});
