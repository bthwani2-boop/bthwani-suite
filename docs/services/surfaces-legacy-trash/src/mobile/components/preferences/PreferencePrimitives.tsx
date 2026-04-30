import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  ViewStyle,
} from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
  useI18n,
} from '@bthwani/ui-kit';

import type { SupportedLanguage } from '@bthwani/ui-kit';

type ScreenState = 'default' | 'scrollable';

const SUPPORTED_LOCALES: SupportedLanguage[] = ['ar', 'en'];

export interface PreferenceScreenLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /**
   * Optional style override for outer container.
   */
  style?: ViewStyle;
  /**
   * Default is scrollable. Use 'default' if the consumer wraps with its own ScrollView.
   */
  mode?: ScreenState;
}

export const PreferenceScreenLayout: React.FC<PreferenceScreenLayoutProps> = ({
  title,
  subtitle,
  children,
  style,
  mode = 'scrollable',
}) => {
  const { isRTL } = useI18n();
  const direction = isRTL ? 'rtl' : 'ltr';
  const header = (
    <View style={styles.header}>
      {title ? (
        <Text
          style={styles.screenTitle}
          numberOfLines={2}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={styles.screenSubtitle}
          numberOfLines={3}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  const content = (
    <View style={[styles.layoutInner, { direction }, style]}>
      {header}
      {children}
    </View>
  );

  if (mode === 'scrollable') {
    return (
      <ScrollView
        style={styles.layoutContainer}
        contentContainerStyle={styles.layoutScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.layoutContainer}>{content}</View>;
};

export interface PreferenceSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  title,
  description,
  children,
}) => {
  const { isRTL } = useI18n();

  return (
    <View style={[styles.section, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {title ? (
        <Text
          style={styles.sectionTitle}
          numberOfLines={2}
        >
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text
          style={styles.sectionDescription}
          numberOfLines={3}
        >
          {description}
        </Text>
      ) : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
};

export interface PreferenceCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export interface PreferenceRowProps {
  leadingSlot?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailingSlot?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export const PreferenceRow: React.FC<PreferenceRowProps> = ({
  leadingSlot,
  title,
  subtitle,
  trailingSlot,
  onPress,
  disabled,
}) => {
  const { isRTL } = useI18n();
  const direction = isRTL ? 'rtl' : 'ltr';
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      disabled={disabled}
      style={[styles.row, { direction, flexDirection: 'row' }]}
      {...(onPress ? { activeOpacity: 0.7 } : {})}
    >
      {leadingSlot ? <View style={styles.rowLeading}>{leadingSlot}</View> : null}
      <View style={styles.rowContent}>
        <Text
          style={styles.rowTitle}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={styles.rowSubtitle}
            numberOfLines={3}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailingSlot ? (
        <View style={styles.rowTrailing}>{trailingSlot}</View>
      ) : null}
    </Container>
  );
};

export interface PreferenceSwitchRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const PreferenceSwitchRow: React.FC<PreferenceSwitchRowProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
}) => {
  return (
    <PreferenceRow
      title={title}
      subtitle={subtitle}
      trailingSlot={
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: semanticRoles.textMuted,
            true: semanticRoles.primaryCTA,
          }}
          thumbColor={
            value ? semanticRoles.primaryCTAText : semanticRoles.surface
          }
        />
      }
    />
  );
};

export interface PreferenceNavigationRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export const PreferenceNavigationRow: React.FC<PreferenceNavigationRowProps> =
  ({ title, subtitle, onPress, disabled }) => {
    const { isRTL } = useI18n();
    const chevron = isRTL ? '←' : '→';

    return (
      <PreferenceRow
        title={title}
        subtitle={subtitle}
        trailingSlot={<Text style={styles.navChevron}>{chevron}</Text>}
        onPress={onPress}
        disabled={disabled}
      />
    );
  };

export interface PreferenceSegmentedLanguageRowProps {
  title: string;
  subtitle?: string;
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
}

export const PreferenceSegmentedLanguageRow: React.FC<
  PreferenceSegmentedLanguageRowProps
> = ({ title, subtitle, value, onChange }) => {
  const { t } = useI18n();
  const { rowDirection } = useDirection();

  return (
    <View>
      <PreferenceRow
        title={title}
        subtitle={subtitle}
        trailingSlot={
          <View
            style={[
              styles.segmentedContainer,
              { flexDirection: rowDirection },
            ]}
          >
            {SUPPORTED_LOCALES.map(locale => {
              const selected = value === locale;
              return (
                <TouchableOpacity
                  key={locale}
                  style={[
                    styles.segmentedOption,
                    selected && styles.segmentedOptionSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onChange(locale)}
                >
                  <Text
                    style={[
                      styles.segmentedOptionText,
                      selected && styles.segmentedOptionTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {t(`preferences.lang_${locale}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  layoutScrollContent: {
    paddingBottom: BTHWANI_SPACING.xl,
  },
  layoutInner: {
    paddingTop: BTHWANI_SPACING.contentV,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  screenSubtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionBody: {
    gap: BTHWANI_SPACING.sm,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.contentV,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeading: {
    width: 32,
    marginEnd: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
    marginEnd: BTHWANI_SPACING.md,
  },
  rowTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  rowSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: semanticRoles.textMuted,
  },
  rowTrailing: {
    minWidth: 56,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  navChevron: {
    fontSize: 18,
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  segmentedContainer: {
    height: 44,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: 4,
    gap: 4,
  },
  segmentedOption: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  segmentedOptionSelected: {
    backgroundColor: semanticRoles.surface,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: semanticRoles.textMuted,
  },
  segmentedOptionTextSelected: {
    color: semanticRoles.text,
    fontWeight: '700',
  },
});


