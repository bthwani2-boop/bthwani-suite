// Auto-generated screen for wlt_statements_export
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

interface auto_wlt_statements_exportProps {
  
}

export const auto_wlt_statements_export: React.FC<auto_wlt_statements_exportProps> = (props) => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('content');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState<'last_month' | 'last_3_months' | 'last_6_months' | 'custom'>('last_month');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setState('loading');

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate success
      setState('content');
      setIsExporting(false);

      // In real app, this would trigger download or show success message
      alert(t('wlt.statements_success_alert'));

    } catch (error) {
      setState('error');
      setIsExporting(false);
    }
  };

  const renderContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('wlt.statements_export_title')}</Text>
      <Text style={styles.subtitle}>{t('wlt.statements_export_subtitle')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('wlt.statements_file_format')}</Text>
        <View style={styles.optionsContainer}>
          {[
            { key: 'pdf', label: 'PDF', description: t('wlt.statements_format_pdf') },
            { key: 'csv', label: 'CSV', description: t('wlt.statements_format_csv') },
            { key: 'excel', label: 'Excel', description: t('wlt.statements_format_excel') }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionCard,
                exportFormat === option.key && styles.optionCardSelected
              ]}
              onPress={() => setExportFormat(option.key as typeof exportFormat)}
            >
              <Text style={[
                styles.optionLabel,
                exportFormat === option.key && styles.optionLabelSelected
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.optionDescription,
                exportFormat === option.key && styles.optionDescriptionSelected
              ]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('wlt.statements_date_range')}</Text>
        <View style={styles.optionsContainer}>
          {[
            { key: 'last_month', label: t('wlt.statements_last_month') },
            { key: 'last_3_months', label: t('wlt.statements_last_3_months') },
            { key: 'last_6_months', label: t('wlt.statements_last_6_months') },
            { key: 'custom', label: t('wlt.statements_custom') }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.dateOption,
                dateRange === option.key && styles.dateOptionSelected
              ]}
              onPress={() => setDateRange(option.key as typeof dateRange)}
            >
              <Text style={[
                styles.dateOptionText,
                dateRange === option.key && styles.dateOptionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t('wlt.statements_info_title')}</Text>
        <Text style={styles.infoText}>• {t('wlt.statements_info_1')}</Text>
        <Text style={styles.infoText}>• {t('wlt.statements_info_2')}</Text>
        <Text style={styles.infoText}>• {t('wlt.statements_info_3')}</Text>
      </View>

      <TouchableOpacity
        style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
        onPress={handleExport}
        disabled={isExporting}
      >
        <Text style={styles.exportButtonText}>
          {isExporting ? t('wlt.statements_exporting') : t('wlt.statements_export_btn')}
        </Text>
      </TouchableOpacity>

      <View style={styles.securityNote}>
        <Text style={styles.securityNoteText}>🔒 {t('wlt.statements_security_note')}</Text>
      </View>
    </ScrollView>
  );

  return (
    <ScreenWrapper
      state={state}
      onErrorAction={() => setState('content')}
    >
      {renderContent()}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  optionsContainer: {
    gap: BTHWANI_SPACING.sm,
  },
  optionCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: BTHWANI_COLORS.primaryContainer,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  optionLabelSelected: {
    color: BTHWANI_COLORS.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  optionDescriptionSelected: {
    color: BTHWANI_COLORS.onSurface,
  },
  dateOption: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateOptionSelected: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: BTHWANI_COLORS.primaryContainer,
  },
  dateOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
  },
  dateOptionTextSelected: {
    color: BTHWANI_COLORS.primary,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: BTHWANI_COLORS.surfaceVariant,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
    lineHeight: 20,
  },
  exportButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    backgroundColor: BTHWANI_COLORS.successContainer,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
  },
  securityNoteText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSuccessContainer,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default auto_wlt_statements_export;

