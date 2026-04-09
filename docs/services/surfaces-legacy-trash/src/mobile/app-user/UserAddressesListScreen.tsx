// Auto-generated unified screen for UserAddressesList
// Surface: app-user | Service: user
// §30 States: Loading / Error / Empty / Success / Content
// §86 Unified app-user screen — عناويني

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenState,
  ScreenWrapper,
  colorTokens,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

import { buildAddressesListMock } from '../fixtures/addressesList';
import type { Address } from '../fixtures/addressesList';

interface UserAddressesListScreenProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const UserAddressesListScreen: React.FC<
  UserAddressesListScreenProps
> = ({ onNavigate, navigation }) => {
  const { t, textAlignStartStyle } = useDirection();
  const NS = 'mobile.app-user.UserAddressesListScreen';
  const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        // Backend integration call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadAddresses();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const addresses = useMemo(() => buildAddressesListMock(t, NS), [t]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return '🏠';
      case 'work':
        return '🏢';
      case 'other':
        return '📍';
      default:
        return '📍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return t(`${NS}.home`);
      case 'work':
        return t(`${NS}.typeWork`);
      case 'other':
        return t(`${NS}.typeOther`);
      default:
        return type;
    }
  };

  const handleSetDefault = (addressId: string) => {
    Alert.alert(t(`${NS}.setDefaultTitle`), t(`${NS}.setDefaultMessage`), [
      { text: t(`${NS}.cancel`), style: 'cancel' },
      {
        text: t(`${NS}.confirm`),
        onPress: () => {
          Alert.alert(t(`${NS}.done`), t(`${NS}.setDefaultSuccess`));
        },
      },
    ]);
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert(t(`${NS}.deleteTitle`), t(`${NS}.deleteMessage`, { label }), [
      { text: t(`${NS}.cancel`), style: 'cancel' },
      {
        text: t(`${NS}.delete`),
        style: 'destructive',
        onPress: () => {
          Alert.alert(t(`${NS}.done`), t(`${NS}.addressDeleted`));
        },
      },
    ]);
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressType}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
          <Text style={styles.typeLabel}>{getTypeLabel(item.type)}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>{t(`${NS}.default`)}</Text>
          </View>
        )}
      </View>

      <Text style={styles.addressLabel}>{item.label}</Text>

      <View style={styles.addressDetails}>
        <Text style={styles.addressLine}>
          {item.building && `${item.building}, `}
          {item.floor && `الطابق ${item.floor}, `}
          {item.apartment && `شقة ${item.apartment}`}
        </Text>
        <Text style={styles.addressLine}>
          {item.street}, {item.district}
        </Text>
        <Text style={styles.addressLine}>{item.city}</Text>
        {item.additionalNotes && (
          <Text style={styles.notesText}>📝 {item.additionalNotes}</Text>
        )}
      </View>

      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleNavigate('UserAddressUpdate')}
        >
          <Text style={styles.actionText}>✏️ تعديل</Text>
        </TouchableOpacity>

        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionText}>⭐ {t(`${NS}.default`)}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAddress(item.id, item.label)}
        >
          <Text style={styles.deleteText}>🗑️ {t(`${NS}.delete`)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.my_addresses')}</Text>
            <Text style={styles.subtitle}>
              {t('profile.manage_delivery_addresses')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleNavigate('UserAddressCreate')}
          >
            <Text style={styles.addText}>
              ➕ {t('profile.add_new_address')}
            </Text>
          </TouchableOpacity>

          {addresses.length > 0 ? (
            <View style={styles.addressesSection}>
              <Text style={[styles.sectionTitle, textAlignStartStyle]}>
                {t('profile.saved_addresses_count', {
                  count: addresses.length,
                })}
              </Text>
              <FlatList
                data={addresses}
                keyExtractor={item => item.id}
                renderItem={renderAddress}
                contentContainerStyle={styles.addressesList}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.emptyTitle}>{t(`${NS}.emptyTitle`)}</Text>
              <Text style={styles.emptyText}>{t(`${NS}.emptyText`)}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleNavigate('UserAddressCreate')}
              >
                <Text style={styles.addText}>{t(`${NS}.addText`)}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('UserProfile')}
          >
            <Text style={styles.backText}>{t(`${NS}.backText`)}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_العناوين')}
      errorMessage={t('surfaces.فشل_في_تحميل_العناوين')}
      onErrorAction={handleRetry}
      screenName='UserAddressesListScreen'
      operationName='user_addresses_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  addText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  addressesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  addressesList: {
    padding: BTHWANI_SPACING.contentH,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  addressCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: 'semanticRoles.shadow',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  addressType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.sm,
  },
  typeLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  defaultBadge: {
    backgroundColor: colorTokens.success['600'],
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  addressDetails: {
    marginBottom: BTHWANI_SPACING.md,
  },
  addressLine: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    lineHeight: 20,
  },
  notesText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontStyle: 'italic',
    marginTop: BTHWANI_SPACING.xs,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colorTokens.error['50'],
    padding: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 12,
    color: colorTokens.error['600'],
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  backText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserAddressesListScreen;
