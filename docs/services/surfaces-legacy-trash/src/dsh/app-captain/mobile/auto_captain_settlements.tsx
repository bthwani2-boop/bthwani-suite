// Auto-generated screen for captain_settlements
// Surface: app-captain | Service: dsh
// Operation: POST /api/captain/withdrawals
// Description: Captain settlements and withdrawal requests

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import {
  buildWithdrawalRequestsMock,
  buildBankAccountsMock,
  type WithdrawalRequest,
  type BankAccount,
} from '../../hooks';

interface AutoCaptainSettlementsProps {
  navigation?: any;
}

export const AutoCaptainSettlements: React.FC<AutoCaptainSettlementsProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // const requestsResponse = await api.get('/api/captain/withdrawals');
      // const accountsResponse = await api.get('/api/captain/bank-accounts');

      const mockWithdrawalRequests = buildWithdrawalRequestsMock(t);
      const mockBankAccounts = buildBankAccountsMock(t);

      setWithdrawalRequests(mockWithdrawalRequests);
      setBankAccounts(mockBankAccounts);
      setSelectedBankAccount(mockBankAccounts.find(acc => acc.isDefault) || null);
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_captain_settlements.errorMessage'));
      } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    const amount = parseFloat(withdrawalAmount);

    if (!amount || amount <= 0) {
      Alert.alert(t('common.error'), t('surfaces.dsh_enter_valid_amount'));
      return;
    }

    if (amount < 50) {
      Alert.alert(t('common.error'), t('surfaces.dsh_min_withdrawal'));
      return;
    }

    if (!selectedBankAccount) {
      Alert.alert(t('common.error'), t('surfaces.dsh_select_bank_account'));
      return;
    }

    try {
      setIsSubmitting(true);

      // const response = await api.post('/api/captain/withdrawals', {
      //   amount,
      //   bankAccountId: selectedBankAccount.id
      // });

      // Mock success for now
      Alert.alert(
        t('surfaces.dsh_success_title'),
        t('surfaces.dsh_withdrawal_success', { amount: String(amount) }),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setWithdrawalAmount('');
              loadData(); // Reload data
            }
          }
        ]
      );

    } catch (err) {
      Alert.alert(t('common.error'), t('surfaces.dsh_withdrawal_failed'));
      } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colorTokens.success['600'];
      case 'processing': return colorTokens.warning['500'];
      case 'pending': return colorTokens.primary['500'];
      case 'rejected': return colorTokens.error['500'];
      default: return colorTokens.neutral['500'];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('surfaces.dsh_status_completed');
      case 'processing': return t('surfaces.dsh_status_processing');
      case 'pending': return t('surfaces.dsh_status_pending');
      case 'rejected': return t('surfaces.dsh_status_rejected');
      default: return t('surfaces.dsh_status_unspecified');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('surfaces.dsh_loading_settlements')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Withdrawal Request Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('surfaces.dsh_new_withdrawal')}</Text>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('surfaces.dsh_withdrawal_amount_label')}</Text>
            <TextInput
              style={styles.textInput}
              value={withdrawalAmount}
              onChangeText={setWithdrawalAmount}
              placeholder={t('surfaces.dsh_enter_amount')}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
            <Text style={styles.helperText}>{t('surfaces.dsh_min_50')}</Text>
          </View>

          {/* Bank Account Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('surfaces.dsh_bank_account_label')}</Text>
            {bankAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  selectedBankAccount?.id === account.id && styles.selectedAccount
                ]}
                onPress={() => setSelectedBankAccount(account)}
                disabled={isSubmitting}
              >
                <View style={styles.accountInfo}>
                  <Text style={styles.bankName}>{account.bankName}</Text>
                  <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                  <Text style={styles.accountHolder}>{account.accountHolder}</Text>
                </View>
                {account.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>افتراضي</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleWithdrawalRequest}
            disabled={isSubmitting}
          >
            <Text style={[styles.submitButtonText, isSubmitting && styles.disabledButtonText]}>
              {isSubmitting ? t('dsh.app-captain.mobile.auto_captain_settlements.submitButtonSubmitting') : 'إرسال طلب السحب'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Withdrawal History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>سجل طلبات السحب</Text>
          {withdrawalRequests.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد طلبات سحب سابقة</Text>
          ) : (
            withdrawalRequests.map((request) => (
              <View key={request.id} style={styles.requestItem}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestAmount}>{request.amount.toFixed(2)} ريال</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                  </View>
                </View>
                <View style={styles.requestDetails}>
                  <Text style={styles.bankInfo}>
                    {request.bankName} - {request.accountNumber}
                  </Text>
                  <Text style={styles.requestDate}>
                    تم الطلب: {request.requestedAt}
                  </Text>
                  {request.processedAt && (
                    <Text style={styles.processedDate}>
                      تم المعالجة: {request.processedAt}
                    </Text>
                  )}
                  {request.notes && (
                    <Text style={styles.notesText}>{request.notes}</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.surface.secondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colorTokens.text.tertiary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colorTokens.error['500'],
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colorTokens.primary['500'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colorTokens.neutral['800'],
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colorTokens.neutral['300'],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  helperText: {
    fontSize: 12,
    color: colorTokens.neutral['500'],
    marginTop: 4,
  },
  accountOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorTokens.neutral['300'],
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  selectedAccount: {
    borderColor: colorTokens.primary['500'],
    backgroundColor: colorTokens.primary['50'],
  },
  accountInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: colorTokens.neutral['800'],
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: colorTokens.text.tertiary,
    marginBottom: 2,
  },
  accountHolder: {
    fontSize: 14,
    color: colorTokens.text.tertiary,
  },
  defaultBadge: {
    backgroundColor: colorTokens.success['600'],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colorTokens.success['600'],
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: colorTokens.neutral['300'],
  },
  disabledButtonText: {
    color: colorTokens.neutral['400'],
  },
  emptyText: {
    fontSize: 16,
    color: colorTokens.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  requestItem: {
    backgroundColor: colorTokens.surface.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  requestDetails: {
    marginTop: 8,
  },
  bankInfo: {
    fontSize: 14,
    color: colorTokens.text.tertiary,
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: colorTokens.text.tertiary,
    marginBottom: 2,
  },
  processedDate: {
    fontSize: 12,
    color: colorTokens.success['600'],
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: colorTokens.warning['500'],
    fontStyle: 'italic',
  },
});

export default AutoCaptainSettlements;
