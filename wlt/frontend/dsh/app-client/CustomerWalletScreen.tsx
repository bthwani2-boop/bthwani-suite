'use client';

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
	Box,
	Button,
	Card,
	Divider,
	ListItem,
	StateView,
	Surface,
	Text,
	TextField,
	useTheme,
	Badge,
	colorPalette,
	radius,
	spacing,
} from '@bthwani/ui-kit';
import { useWltDshWalletSession } from './useWltDshWalletSession';
import { listLedgerEntries } from '../shared/wallet/client-wallet-runtime.adapter';
import { adaptClientLedgerEntries, formatWltDshAmountLabel } from '../shared';
import type { WltDshClientWalletLedgerRow } from '../shared';

export type CustomerWalletScreenProps = {
	clientId: string;
	bearerToken?: string;
};

export function CustomerWalletScreen({ clientId, bearerToken }: CustomerWalletScreenProps) {
	const { theme } = useTheme();
	const wallet = useWltDshWalletSession(clientId, bearerToken);
	const [transactions, setTransactions] = React.useState<readonly WltDshClientWalletLedgerRow[]>([]);
	const [loadingTx, setLoadingTx] = React.useState<boolean>(false);
	const [offline, setOffline] = React.useState<boolean>(false);
	const [rechargeAmount, setRechargeAmount] = React.useState<string>('');
	const [rechargeError, setRechargeError] = React.useState<string | null>(null);
	const [rechargeSuccess, setRechargeSuccess] = React.useState<boolean>(false);

	const loading = !wallet.hydrated || loadingTx;

	const fetchTransactions = React.useCallback(async () => {
		if (!wallet.linked) return;
		setLoadingTx(true);
		setOffline(false);
		try {
			const res = await listLedgerEntries(clientId, bearerToken, 20, 0);
			setTransactions(adaptClientLedgerEntries(res.entries || []));
		} catch (err) {
			console.error('Failed to fetch ledger entries:', err);
			const isOffline = !globalThis.navigator?.onLine || (err instanceof TypeError && /network|fetch/i.test(String(err)));
			setOffline(isOffline);
		} finally {
			setLoadingTx(false);
		}
	}, [wallet.linked, clientId, bearerToken]);

	const retry = React.useCallback(() => { void fetchTransactions(); }, [fetchTransactions]);

	React.useEffect(() => {
		void fetchTransactions();
	}, [fetchTransactions]);

	const handleRefresh = async () => {
		await wallet.refresh();
		await fetchTransactions();
	};

	const handleRecharge = async () => {
		setRechargeError(null);
		setRechargeSuccess(false);
		const amount = parseFloat(rechargeAmount);
		if (isNaN(amount) || amount <= 0) {
			setRechargeError('يرجى إدخال مبلغ صحيح أكبر من صفر');
			return;
		}

		try {
			wallet.createWalletFundingLink(amount * 100);
			setRechargeSuccess(true);
			setRechargeAmount('');
		} catch (err) {
			setRechargeError('حدث خطأ غير متوقع أثناء الشحن');
		}
	};

	if (loading) {
		return (
			<Surface tone="default" style={styles.centerContainer}>
				<Text role="bodyMd" tone="muted" style={{ textAlign: 'center' }}>
					جاري تحميل بيانات المحفظة...
				</Text>
			</Surface>
		);
	}

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: theme.surface }]}
			refreshControl={
				<RefreshControl refreshing={wallet.refreshing || loadingTx} onRefresh={handleRefresh} />
			}
		>
			<Box gap={4} style={{ padding: spacing[4] }}>
				{/* Modern Arabic Header */}
				<View style={styles.headerRow}>
					<Text role="titleLg" style={{ textAlign: 'right', color: theme.text }}>
						المحفظة الإلكترونية
					</Text>
				</View>

				{offline && (
					<Card tone="warning" gap={2} padding={3}>
						<Text role="bodyStrong" style={{ textAlign: 'right' }}>لا يوجد اتصال بالشبكة</Text>
						<Button label="إعادة المحاولة" tone="secondary" size="sm" onPress={retry} />
					</Card>
				)}

				{/* Wallet status banner */}
				{!wallet.linked ? (
					<Card tone="warning" gap={3} padding={4}>
						<Text role="bodyStrong" style={{ textAlign: 'right' }}>
							المحفظة غير متصلة
						</Text>
						<Text role="bodyMd" tone="muted" style={{ textAlign: 'right' }}>
							يرجى ربط محفظتك لتتمكن من إيداع المبالغ واستخدامها في عمليات الدفع السريع للطلبات.
						</Text>
						<Button
							label="ربط وتفعيل المحفظة الآن"
							tone="primary"
							onPress={async () => {
								await wallet.link();
								await handleRefresh();
							}}
						/>
					</Card>
				) : (
					<>
						{/* Main Balance Display */}
						<Surface tone="raised" padding={4} gap={3} style={styles.balanceCard}>
							<Text role="label" tone="muted" style={{ textAlign: 'right' }}>
								الرصيد المتاح
							</Text>
							<Text role="hero" weight="black" style={[styles.balanceText, { color: theme.brand }]}>
								{formatWltDshAmountLabel(wallet.balance ?? 0)}
							</Text>
							<View style={styles.badgeRow}>
								<Badge label="محفظة نشطة" tone="success" />
								<Badge label="YER (ريال يمني)" tone="info" />
							</View>
						</Surface>

						{/* Quick Recharge Form */}
						<Surface tone="inset" padding={4} gap={3} style={styles.rechargeCard}>
							<Text role="bodyStrong" style={{ textAlign: 'right' }}>
								شحن رصيد المحفظة
							</Text>
							<View style={styles.rechargeInputRow}>
								<TextField
									value={rechargeAmount}
									onChangeText={setRechargeAmount}
									placeholder="أدخل المبلغ بالريال اليمني"
									keyboardType="numeric"
									style={{ flex: 1 }}
								/>
								<Button
									label="شحن"
									tone="primary"
									onPress={handleRecharge}
									disabled={!rechargeAmount}
								/>
							</View>
							{rechargeError && (
								<Text role="bodySm" style={{ color: colorPalette.danger, textAlign: 'right' }}>
									{rechargeError}
								</Text>
							)}
							{rechargeSuccess && (
								<Text role="bodySm" style={{ color: colorPalette.success, textAlign: 'right' }}>
									تم تجهيز رابط الشحن عبر WLT.
								</Text>
							)}
						</Surface>

						{/* Transactions Ledger */}
						<Box gap={2}>
							<Text role="bodyStrong" style={{ textAlign: 'right', marginBottom: spacing[2] }}>
								سجل العمليات الأخير
							</Text>
							{transactions.length === 0 ? (
								<StateView
									kind="empty"
									title="لا توجد عمليات سابقة"
									description="عند قيامك بأي عمليات شحن أو دفع، ستظهر تفاصيلها هنا."
								/>
							) : (
								<Surface tone="default" style={styles.txListContainer}>
									{transactions.map((tx, idx) => {
										const isCredit = tx.direction === 'credit';
										const dateLabel = new Date(tx.createdAt).toLocaleDateString('ar-YE', {
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										});
										return (
											<React.Fragment key={tx.id}>
												{idx > 0 && <Divider />}
												<ListItem
													title={tx.description || tx.typeLabel}
													subtitle={dateLabel}
													meta={
														<View style={{ alignItems: 'flex-start' }}>
															<Text
																role="bodyStrong"
																style={{
																	color: isCredit ? colorPalette.success : colorPalette.danger,
																}}
															>
																{isCredit ? '+' : '-'} {tx.amountLabel}
															</Text>
															<Badge
																label={tx.status === 'COMPLETED' ? 'مكتمل' : 'معلق'}
																tone={tx.status === 'COMPLETED' ? 'success' : 'warning'}
															/>
														</View>
													}
												/>
											</React.Fragment>
										);
									})}
								</Surface>
							)}
						</Box>
					</>
				)}
			</Box>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing[4],
	},
	headerRow: {
		flexDirection: 'row-reverse',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing[2],
	},
	balanceCard: {
		borderRadius: radius.xl,
		alignItems: 'flex-end',
	},
	balanceText: {
		fontSize: 32,
		textAlign: 'right',
		marginVertical: spacing[2],
	},
	badgeRow: {
		flexDirection: 'row-reverse',
		gap: spacing[2],
	},
	rechargeCard: {
		borderRadius: radius.xl,
	},
	rechargeInputRow: {
		flexDirection: 'row-reverse',
		gap: spacing[2],
		alignItems: 'center',
	},
	txListContainer: {
		borderRadius: radius.xl,
		overflow: 'hidden',
	},
});

export default CustomerWalletScreen;
