'use client';

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
	Box,
	Card,
	Divider,
	ListItem,
	StateView,
	Surface,
	Text,
	useTheme,
	Badge,
	colorPalette,
	radius,
	spacing,
  typographyRoles,
} from '@bthwani/ui-kit';
import { useWltDshPartnerWalletSummary } from './useWltDshPartnerWalletSummary';
import { formatWltDshAmountLabel } from '../shared';

export type PartnerSettlementScreenProps = {
	partnerId?: string;
	bearerToken?: string | null;
};

export function PartnerSettlementScreen({ partnerId = 'partner-dev-001', bearerToken }: PartnerSettlementScreenProps) {
	const { theme } = useTheme();
	const { partnerSummary, summaryTransactions, warnings } = useWltDshPartnerWalletSummary(partnerId, bearerToken);
	const [refreshing, setRefreshing] = React.useState<boolean>(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		// Wait brief moment to simulate refresh / re-mount hooks triggers
		await new Promise((resolve) => setTimeout(resolve, 500));
		setRefreshing(false);
	};

	const hasError = warnings && warnings.length > 0 && warnings[0].startsWith('WLT runtime blocked');

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: theme.surface }]}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
		>
			<Box gap={4} style={{ padding: spacing[4] }}>
				{/* Header */}
				<View style={styles.headerRow}>
					<Text role="titleMd" style={{ textAlign: 'right', color: theme.text }}>
						تسويات المتجر والمالية
					</Text>
				</View>

				{/* Errors/Warnings */}
				{hasError && (
					<Card tone="danger" padding={3}>
						<Text role="bodyMd" style={{ color: theme.danger, textAlign: 'right' }}>
							{warnings[0]}
						</Text>
					</Card>
				)}

				{/* Summary Metrics Cards */}
				<View style={styles.metricsRow}>
					<Surface tone="raised" padding={3} gap={1} style={[styles.metricCard, { flex: 1 }]}>
						<Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
							إجمالي المبيعات
						</Text>
						<Text role="bodyStrong" weight="black" style={[styles.metricValue, { color: theme.brand }]}>
							{formatWltDshAmountLabel(partnerSummary.grossSalesMinorUnits)}
						</Text>
					</Surface>

					<Surface tone="raised" padding={3} gap={1} style={[styles.metricCard, { flex: 1 }]}>
						<Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
							صافي مستحقات التسوية
						</Text>
						<Text role="bodyStrong" weight="black" style={[styles.metricValue, { color: theme.success }]}>
							{formatWltDshAmountLabel(partnerSummary.netSettlementMinorUnits)}
						</Text>
					</Surface>
				</View>

				{/* Active Cycle Details */}
				<Surface tone="inset" padding={4} gap={3} style={styles.cycleCard}>
					<Text role="bodyStrong" style={{ textAlign: 'right' }}>
						دورة التسوية الحالية
					</Text>
					<Divider />
					<View style={styles.cycleInfoRow}>
						<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
							تاريخ البدء: {partnerSummary.cycleStartDate}
						</Text>
						<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
							تاريخ الانتهاء: {partnerSummary.cycleEndDate}
						</Text>
					</View>
					<View style={styles.cycleStatusRow}>
						<Text role="bodySm" style={{ textAlign: 'right' }}>
							الحالة:
						</Text>
						<Badge
							label={
								partnerSummary.cycleStatus === 'COMPLETED'
									? 'مكتملة ومدفوعة'
									: partnerSummary.cycleStatus === 'PENDING'
									? 'جاهزة للمراجعة'
									: 'معلقة'
							}
							tone={partnerSummary.cycleStatus === 'COMPLETED' ? 'success' : 'warning'}
						/>
					</View>
				</Surface>

				{/* Settlements History */}
				<Box gap={2}>
					<Text role="bodyStrong" style={{ textAlign: 'right', marginBottom: spacing[2] }}>
						سجل التسويات والعمليات المكتملة
					</Text>
					{summaryTransactions.length === 0 ? (
						<StateView
							kind="empty"
							title="لا توجد تسويات سابقة"
							description="سيتم سرد جميع تسويات مبيعات متجرك هنا فور حدوثها."
						/>
					) : (
						<Surface tone="default" style={styles.listContainer}>
							{summaryTransactions.map((tx, idx) => {
								return (
									<React.Fragment key={tx.id}>
										{idx > 0 && <Divider />}
										<ListItem
											title={tx.title}
											subtitle={`${tx.timeLabel} • ${tx.subtitle}`}
											meta={
												<View style={{ alignItems: 'flex-start' }}>
													<Text role="bodyStrong" style={{ color: tx.amountTone === 'success' ? theme.success : theme.danger }}>
														{tx.amountLabel}
													</Text>
													{tx.statusLabel ? (
														<Badge
															label={tx.statusLabel}
															tone={tx.statusTone ?? 'warning'}
														/>
													) : null}
												</View>
											}
										/>
									</React.Fragment>
								);
							})}
						</Surface>
					)}
				</Box>
			</Box>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerRow: {
		flexDirection: 'row-reverse',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing[2],
	},
	metricsRow: {
		flexDirection: 'row-reverse',
		gap: spacing[3],
	},
	metricCard: {
		borderRadius: radius.xl,
		alignItems: 'flex-end',
	},
	metricValue: {
		fontSize: typographyRoles.titleMd.fontSize,
		marginTop: spacing[1],
	},
	cycleCard: {
		borderRadius: radius.xl,
	},
	cycleInfoRow: {
		flexDirection: 'row-reverse',
		justifyContent: 'space-between',
	},
	cycleStatusRow: {
		flexDirection: 'row-reverse',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: spacing[2],
		marginTop: spacing[1],
	},
	listContainer: {
		borderRadius: radius.xl,
		overflow: 'hidden',
	},
});

export default PartnerSettlementScreen;
