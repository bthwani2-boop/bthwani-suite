/**
 * PartnerTopAppBar — DSH store-style header
 * - Row 1: ledger · search · profile | title | trailing spacer
 * - Row 1 (DSH): أيقونة قائمة فروع/متاجر تفتح Modal منسدل؛ الاختيار يُغلق القائمة
 * - Issue mode: SOS + title + spacer (no store row)
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import type { PartnerStoreSwitcherFixtureItem } from '../../../dsh/partnerStoreSwitcherFixtures';

export type PartnerTopBarState = 'idle' | 'on_task' | 'issue';

const HEADER_ICON_SIZE = 22;
const BRANCH_MENU_ICON_SIZE = 24;
const TOP_BAR_MIN_HEIGHT = 56;
const HEADER_ICON_BUTTON_SIZE = 40;

export interface PartnerTopBarStoreSwitcher {
  stores: PartnerStoreSwitcherFixtureItem[];
  activeScope: string;
  onSelectScope: (scope: string) => void;
  allStoresScope: string;
}

interface PartnerTopAppBarProps {
  partnerDisplayName?: string;
  partnerState: PartnerTopBarState;
  taskInfo?: {
    title: string;
    subtitle?: string;
  };
  onProfilePress: () => void;
  onSearchPress: () => void;
  onLedgerPress: () => void;
  onNotificationsPress?: () => void;
  notificationsBadgeCount?: number;
  profileActionBadgeCount?: number;
  onSOSPress?: () => void;
  /** DSH only: multi-store picker in header */
  dshStoreSwitcher?: PartnerTopBarStoreSwitcher | null;
}

const getStateBackground = (state: PartnerTopBarState) => {
  switch (state) {
    case 'issue':
      return (
        semanticRoles.captainState?.issue?.background ||
        semanticRoles.stateError.background
      );
    case 'on_task':
      return (
        semanticRoles.captainState?.pickup?.background ||
        semanticRoles.stateInfo.background
      );
    case 'idle':
    default:
      return semanticRoles.surface;
  }
};

type MenuRow =
  | { kind: 'all'; id: string; primary: string; secondary?: string }
  | { kind: 'store'; id: string; primary: string; secondary?: string };

export const PartnerTopAppBar: React.FC<PartnerTopAppBarProps> = ({
  partnerDisplayName,
  partnerState,
  taskInfo,
  onProfilePress,
  onSearchPress,
  onLedgerPress,
  onNotificationsPress,
  notificationsBadgeCount = 0,
  profileActionBadgeCount = 0,
  onSOSPress,
  dshStoreSwitcher,
}) => {
  const { isRTL, rowStyle, t, textAlignStartStyle } = useDirection();
  const { height: windowHeight } = useWindowDimensions();
  const [branchMenuVisible, setBranchMenuVisible] = useState(false);

  const backgroundColor = getStateBackground(partnerState);
  const isIssueMode = partnerState === 'issue';
  const iconColor = semanticRoles.textMuted;

  const fallbackName = t('partner.PartnerTopAppBar.fallbackName');
  const resolvedName = (partnerDisplayName?.trim() || fallbackName) as string;

  const subtitleLine =
    partnerState === 'issue'
      ? taskInfo?.title || t('partner.PartnerTopAppBar.issueTitle')
      : partnerState === 'on_task' && taskInfo?.title
        ? taskInfo.title
        : undefined;

  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 } as const;

  const switcher = dshStoreSwitcher;
  const showStoreRow = !!switcher && switcher.stores.length > 1 && !isIssueMode;
  const showBranchMenuButton = showStoreRow;

  const headerActionsCount =
    (showBranchMenuButton ? 4 : 3) + (onNotificationsPress ? 1 : 0);
  const headerActionsClusterWidth =
    HEADER_ICON_BUTTON_SIZE * headerActionsCount +
    BTHWANI_SPACING.xs * Math.max(0, headerActionsCount - 1);

  const titleBlockStyle = !isIssueMode
    ? [
        styles.titleBlock,
        {
          paddingStart: headerActionsClusterWidth,
          paddingEnd: headerActionsClusterWidth,
        },
      ]
    : styles.titleBlock;

  // Title is absolutely centered, so we don't need horizontal spacer reservations.
  // Keep endSpacer to preserve minimal height only.
  const endSpacer = <View style={styles.headerEndSpacer} />;

  const menuRows: MenuRow[] = useMemo(() => {
    if (!switcher || !showStoreRow) return [];
    const allLabel = t('partner.PartnerHomeScreen.allStoresChip');
    const rows: MenuRow[] = [
      {
        kind: 'all',
        id: switcher.allStoresScope,
        primary: allLabel,
      },
    ];
    for (const s of switcher.stores) {
      rows.push({
        kind: 'store',
        id: s.id,
        primary: s.name,
      });
    }
    return rows;
  }, [showStoreRow, switcher, t]);

  const closeBranchMenu = useCallback(() => setBranchMenuVisible(false), []);

  const openBranchMenu = useCallback(() => setBranchMenuVisible(true), []);

  const onPickScope = useCallback(
    (scope: string) => {
      switcher?.onSelectScope(scope);
      setBranchMenuVisible(false);
    },
    [switcher]
  );

  const menuMaxHeight = Math.min(windowHeight * 0.55, 420);
  const branchMenuButton = showBranchMenuButton ? (
    <TouchableOpacity
      style={styles.headerBranchMenuButton}
      onPress={openBranchMenu}
      activeOpacity={0.75}
      hitSlop={hitSlop}
      accessibilityRole='button'
      accessibilityLabel={t('partner.PartnerTopAppBar.a11yBranchesMenu')}
      accessibilityState={{ expanded: branchMenuVisible }}
    >
      <View style={styles.headerBranchMenuIconRow}>
        <Ionicons
          name='git-branch-outline'
          size={BRANCH_MENU_ICON_SIZE}
          color={semanticRoles.primaryCTA}
        />
        <Ionicons
          name='chevron-down'
          size={16}
          color={semanticRoles.textMuted}
          style={styles.branchMenuChevron}
        />
      </View>
    </TouchableOpacity>
  ) : null;

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor }]}>
      <View style={[styles.headerRow, { minHeight: TOP_BAR_MIN_HEIGHT }]}>
        {isIssueMode && onSOSPress ? (
          <>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={onSOSPress}
              activeOpacity={0.7}
              accessibilityRole='button'
              accessibilityLabel={t('partner.PartnerTopAppBar.a11ySOS')}
            >
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
            <View style={styles.titleBlock}>
              <Text
                style={[
                  styles.storeTitle,
                  isIssueMode && styles.storeTitleIssue,
                ]}
                numberOfLines={1}
              >
                {resolvedName}
              </Text>
              {!!subtitleLine && (
                <Text
                  style={[
                    styles.taskSubtitle,
                    isIssueMode && styles.taskSubtitleIssue,
                  ]}
                  numberOfLines={1}
                >
                  {subtitleLine}
                </Text>
              )}
            </View>
            {endSpacer}
          </>
        ) : (
          <>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onLedgerPress}
                activeOpacity={0.7}
                hitSlop={hitSlop}
                accessibilityRole='button'
                accessibilityLabel={t('partner.PartnerTopAppBar.a11yLedger')}
              >
                <Ionicons
                  name='receipt-outline'
                  size={HEADER_ICON_SIZE}
                  color={iconColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onSearchPress}
                activeOpacity={0.7}
                hitSlop={hitSlop}
                accessibilityRole='button'
                accessibilityLabel={t('partner.PartnerTopAppBar.a11ySearch')}
              >
                <Ionicons
                  name='search-outline'
                  size={HEADER_ICON_SIZE}
                  color={iconColor}
                />
              </TouchableOpacity>

              {onNotificationsPress ? (
                <TouchableOpacity
                  style={styles.headerIconButton}
                  onPress={onNotificationsPress}
                  activeOpacity={0.7}
                  hitSlop={hitSlop}
                  accessibilityRole='button'
                  accessibilityLabel={t(
                    'partner.PartnerTopAppBar.a11yNotifications'
                  )}
                >
                  <View style={styles.profileIconWrap}>
                    <Ionicons
                      name='notifications-outline'
                      size={HEADER_ICON_SIZE}
                      color={iconColor}
                    />
                    {notificationsBadgeCount > 0 ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {notificationsBadgeCount > 9
                            ? '9+'
                            : notificationsBadgeCount}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ) : null}

              {!isRTL ? branchMenuButton : null}

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onProfilePress}
                activeOpacity={0.7}
                hitSlop={hitSlop}
                accessibilityRole='button'
                accessibilityLabel={t('partner.PartnerTopAppBar.a11yProfile')}
              >
                <View style={styles.profileIconWrap}>
                  <Ionicons
                    name='person-outline'
                    size={HEADER_ICON_SIZE}
                    color={iconColor}
                  />
                  {profileActionBadgeCount > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {profileActionBadgeCount > 9
                          ? '9+'
                          : profileActionBadgeCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>

              {isRTL ? branchMenuButton : null}
            </View>

            <View style={titleBlockStyle}>
              <Text style={styles.storeTitle} numberOfLines={1}>
                {resolvedName}
              </Text>
              {!!subtitleLine && (
                <Text style={styles.taskSubtitle} numberOfLines={1}>
                  {subtitleLine}
                </Text>
              )}
            </View>

            {endSpacer}
          </>
        )}
      </View>

      <Modal
        visible={branchMenuVisible && showStoreRow}
        transparent
        animationType='fade'
        statusBarTranslucent
        onRequestClose={closeBranchMenu}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeBranchMenu}
            accessibilityRole='button'
            accessibilityLabel={t('partner.PartnerTopAppBar.a11yBranchesMenu')}
          />
          <View
            style={[styles.menuSheet, { maxHeight: menuMaxHeight }]}
            accessibilityViewIsModal
          >
            <Text style={[styles.menuSheetTitle, textAlignStartStyle]}>
              {t('partner.PartnerTopAppBar.branchesMenuTitle')}
            </Text>
            <ScrollView
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={menuRows.length > 6}
              bounces={menuRows.length > 6}
            >
              {menuRows.map(row => {
                const selected = switcher!.activeScope === row.id;
                return (
                  <TouchableOpacity
                    key={row.id}
                    style={[
                      styles.menuRow,
                      selected && styles.menuRowSelected,
                      rowStyle,
                    ]}
                    onPress={() => onPickScope(row.id)}
                    activeOpacity={0.65}
                    accessibilityRole='button'
                    accessibilityState={{ selected }}
                    accessibilityLabel={row.primary}
                  >
                    <View style={styles.menuRowTextWrap}>
                      <Text
                        style={[styles.menuRowPrimary, textAlignStartStyle]}
                        numberOfLines={2}
                      >
                        {row.primary}
                      </Text>
                      {row.secondary ? (
                        <Text
                          style={[styles.menuRowSecondary, textAlignStartStyle]}
                          numberOfLines={1}
                        >
                          {row.secondary}
                        </Text>
                      ) : null}
                    </View>
                    {selected ? (
                      <Ionicons
                        name='checkmark-circle'
                        size={22}
                        color={semanticRoles.primaryCTA}
                        style={styles.menuRowCheck}
                      />
                    ) : (
                      <View style={styles.menuRowCheckPlaceholder} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: BTHWANI_SPACING.xs,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.md,
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerEndSpacer: {
    minHeight: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBranchMenuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor:
      (semanticRoles as any).surfaceSubtle ?? semanticRoles.surface,
  },
  headerBranchMenuIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileIconWrap: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: {
    position: 'absolute',
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
    marginHorizontal: 0,
    paddingHorizontal: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    pointerEvents: 'none',
  },
  storeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  storeTitleIssue: {
    color: semanticRoles.primaryCTAText,
  },
  taskSubtitle: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  taskSubtitleIssue: {
    color: semanticRoles.primaryCTAText,
    opacity: 0.95,
  },
  badge: {
    position: 'absolute',
    top: -4,
    end: -4,
    backgroundColor: semanticRoles.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: semanticRoles.surface,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  sosButton: {
    backgroundColor: semanticRoles.stateError.icon,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: 8,
    marginEnd: BTHWANI_SPACING.xs,
  },
  sosText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '700',
  },
  storeMenuBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: semanticRoles.surface,
    gap: BTHWANI_SPACING.sm,
  },
  storeMenuMeta: {
    flex: 1,
    minWidth: 0,
  },
  storeSwitchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs / 2,
  },
  storeSwitchMeta: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  branchMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surfaceSubtle ?? semanticRoles.surface,
  },
  branchMenuChevron: {
    marginStart: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  menuSheet: {
    marginHorizontal: BTHWANI_SPACING.md,
    marginTop: Platform.OS === 'ios' ? 8 : 12,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  menuSheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  menuRow: {
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: semanticRoles.border,
  },
  menuRowSelected: {
    backgroundColor: semanticRoles.surfaceSubtle ?? semanticRoles.surface,
  },
  menuRowTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  menuRowPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  menuRowSecondary: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  menuRowCheck: {
    marginStart: BTHWANI_SPACING.sm,
  },
  menuRowCheckPlaceholder: {
    width: 22,
    marginStart: BTHWANI_SPACING.sm,
  },
});
