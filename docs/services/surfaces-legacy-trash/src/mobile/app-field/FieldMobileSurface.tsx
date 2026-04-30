// FieldMobileSurface - Mobile Surface Aggregator for Field App
// §86 §87 SSoT in surfaces; dynamic route map; theme tokens for UX
// §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
// Supports DSH and ARB field operations

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ErrorBoundary } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useFieldType } from './FieldTypeContext';
import { FieldTypeSelectScreen } from '../../field/FieldTypeSelectScreen';
import { FieldHomeScreen } from '../../field/FieldHomeScreen';
import {
  getFieldScreenComponent,
  getFieldDefaultRoute,
  ROUTE_HOME,
  ROUTE_FIELD_TYPE_SELECT,
} from './fieldRouteMap';
import {
  FieldBottomNavigationBar,
  FieldTopAppBar,
  type FieldState,
  type FieldTopBarState,
  type RightActionType,
  type FieldStatus,
  type GPSStatus,
} from './components';
import { FirstLaunchScreen } from '../components/FirstLaunchScreen';
import { useFirstLaunchSeen } from '../components/useFirstLaunchSeen';
import { TouchDebugOverlay } from '../components/TouchDebugOverlay';

export interface MobileSurfaceProps {
  navigation?: any;
  theme?: any;
  platform?: 'mobile';
}

// Inner component that uses the context
const FieldMobileSurfaceInner: React.FC<MobileSurfaceProps> = ({
  navigation: injectedNavigation,
  theme,
  platform = 'mobile',
}) => {
  const { t } = useI18n();
  const { fieldType, isLoading } = useFieldType();
  const [currentScreen, setCurrentScreen] = useState<string>(
    getFieldDefaultRoute()
  );
  const [previousScreen, setPreviousScreen] = useState<string>(
    getFieldDefaultRoute()
  );

  // Field state management
  const [fieldState, setFieldState] = useState<FieldState>('idle');
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>('available');
  const [gpsStatus, setGpsStatus] = useState<GPSStatus>('on');
  const [signalStrength, setSignalStrength] = useState<number>(4);
  const [taskInfo, setTaskInfo] = useState<
    { title: string; subtitle?: string } | undefined
  >();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // Reset to home when field type changes
  useEffect(() => {
    if (fieldType) {
      setCurrentScreen(ROUTE_HOME);
      setPreviousScreen(ROUTE_HOME);
    }
  }, [fieldType]);

  const adapterNavigate = (name: string) => {
    const Component = getFieldScreenComponent(name);
    if (Component) {
      setPreviousScreen(currentScreen);
      setCurrentScreen(name);
    } else {
      // If screen not found, navigate to home
      setPreviousScreen(currentScreen);
      setCurrentScreen(ROUTE_HOME);
    }
  };

  const navProps = { navigation: { navigate: adapterNavigate } };

  // Determine right action based on state
  const getRightAction = (): {
    type: RightActionType;
    onPress: () => void;
    badge?: number;
  } => {
    if (fieldState === 'issue') {
      return {
        type: 'support',
        onPress: () => adapterNavigate('platform_field_support'),
      };
    }
    if (fieldState === 'on_task') {
      return {
        type: 'call',
        onPress: () => {},
      };
    }
    if (notificationCount > 0) {
      return {
        type: 'bell',
        onPress: () => adapterNavigate(t('surfaces.FieldNotifications')),
        badge: notificationCount,
      };
    }
    return {
      type: 'settings',
      onPress: () => adapterNavigate('platform_field_settings'),
    };
  };

  const shouldShowBottomNav =
    currentScreen !== ROUTE_FIELD_TYPE_SELECT && fieldType !== null;
  const shouldShowTopBar =
    currentScreen !== ROUTE_FIELD_TYPE_SELECT && fieldType !== null;

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Simple loading indicator */}
        </View>
      </View>
    );
  }

  // Show type selection screen if no field type is selected
  if (!fieldType) {
    return (
      <ErrorBoundary>
        <FieldTypeSelectScreen navigation={navProps.navigation} />
      </ErrorBoundary>
    );
  }

  // Handle navigation to type select screen
  if (currentScreen === ROUTE_FIELD_TYPE_SELECT) {
    return (
      <ErrorBoundary>
        <FieldTypeSelectScreen navigation={navProps.navigation} />
      </ErrorBoundary>
    );
  }

  // Get the screen component for current route
  const ScreenComponent = getFieldScreenComponent(currentScreen);

  // If screen is Home or component not found, show FieldHomeScreen
  const renderScreen = () => {
    if (currentScreen === ROUTE_HOME || !ScreenComponent) {
      return (
        <FieldHomeScreen
          navigation={navProps.navigation}
          fieldType={fieldType}
          isLoading={false}
        />
      );
    }

    return (
      <ScreenComponent navigation={navProps.navigation} fieldType={fieldType} />
    );
  };

  // Render with navigation components
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <TouchDebugOverlay surfaceId='app-field' currentScreen={currentScreen} />
        {/* Top App Bar */}
        {shouldShowTopBar && (
          <FieldTopAppBar
            fieldState={fieldState as FieldTopBarState}
            fieldStatus={fieldStatus}
            gpsStatus={gpsStatus}
            signalStrength={signalStrength}
            taskInfo={taskInfo}
            rightAction={getRightAction()}
            onSOSPress={
              fieldState === 'issue'
                ? () => adapterNavigate('platform_field_support')
                : undefined
            }
          />
        )}

        {/* Main Screen Content */}
        <View style={styles.screenContainer}>{renderScreen()}</View>

        {/* Bottom Navigation */}
        {shouldShowBottomNav && (
          <FieldBottomNavigationBar
            currentScreen={currentScreen}
            onNavigate={adapterNavigate}
            fieldState={fieldState}
            notificationCount={notificationCount}
          />
        )}
      </View>
    </ErrorBoundary>
  );
};

const APP_FIELD_FIRST_LAUNCH_KEY = 'app-field';

// Main component - FieldTypeProvider is provided by Shell
export const FieldMobileSurface: React.FC<MobileSurfaceProps> = props => {
  const {
    hasSeen,
    setSeen,
    isLoading: firstLaunchLoading,
  } = useFirstLaunchSeen(APP_FIELD_FIRST_LAUNCH_KEY);

  if (firstLaunchLoading) return null;
  if (hasSeen === false) {
    return <FirstLaunchScreen onContinue={setSeen} />;
  }
  return <FieldMobileSurfaceInner {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
  },
});


