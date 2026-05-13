import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  KeyValueList,
  ListItem,
  SectionHeader,
  Surface,
  Text,
  useTheme,
  colorPalette,
  spacing,
  radius,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';

export type DshCaptainPickupDropoffScreenProps = {
  mode: 'pickup' | 'arrival' | 'dropoff';
  orderId: string;
  storeName: string;
  customerName: string;
  address: string;
  itemsCount: number;
  onConfirm: () => void;
  onReportIssue: () => void;
  onBack?: () => void;
};

export function DshCaptainPickupDropoffScreen({
  mode = 'pickup',
  orderId = 'ORD-9021',
  storeName = 'Burger Lab',
  customerName = 'أحمد محمد',
  address = 'حي العليا، الرياض',
  itemsCount = 3,
  onConfirm,
  onReportIssue,
  onBack,
}: DshCaptainPickupDropoffScreenProps) {
  const { theme } = useTheme();

  const config = {
    pickup: {
      title: 'استلام من المتجر',
      subtitle: 'تأكد من استلام جميع الأصناف قبل المغادرة.',
      badge: 'مرحلة الاستلام',
      targetLabel: 'المتجر',
      targetValue: storeName,
      cta: 'تأكيد الاستلام',
      checklist: [
        'التأكد من رقم الطلب مطق مع الفاتورة',
        'التحقق من حالة التغليف ودرجة الحرارة',
        'استلام جميع ملحقات الطلب (مشروبات، صوصات)',
      ],
    },
    arrival: {
      title: 'وصول للعميل',
      subtitle: 'أبلغ العميل بوصولك للموقع المحدد.',
      badge: 'وصلت للموقع',
      targetLabel: 'العميل',
      targetValue: customerName,
      cta: 'تأكيد الوصول',
      checklist: [
        'ركن المركبة في مكان آمن',
        'التحقق من دقة الموقع الجغرافي',
        'تجهيز الطلب للتسليم',
      ],
    },
    dropoff: {
      title: 'تسليم الطلب',
      subtitle: 'سلم الطلب للعميل وأنهِ المهمة.',
      badge: 'مرحلة التسليم',
      targetLabel: 'العميل',
      targetValue: customerName,
      cta: 'تأكيد التسليم النهائي',
      checklist: [
        'تسليم الطلب للعميل مباشرة',
        'التأكد من استلام المبلغ (في حال الدفع النقدي)',
        'شكر العميل وطلب تقييم الخدمة',
      ],
    },
  }[mode];

  return (
    <DshOperationScreen
      title={config.title}
      subtitle={config.subtitle}
      onBack={onBack}
      content={
        <Box gap={3}>
          <Surface tone="brand" gap={3}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Badge label={config.badge} tone="warning" />
              <Text role="caption" tone="soft">#{orderId}</Text>
            </Box>
            
            <KeyValueList
              items={[
                { label: config.targetLabel, value: config.targetValue, tone: 'brand' },
                { label: 'العنوان', value: address },
                { label: 'عدد الأصناف', value: `${itemsCount} أصناف`, tone: 'success' },
              ]}
            />
          </Surface>

          <Surface tone="raised" gap={3}>
            <SectionHeader 
              title="قائمة التحقق" 
              subtitle="يرجى مراجعة النقاط التالية لضمان جودة الخدمة." 
            />
            <Box gap={2}>
              {config.checklist.map((item, index) => (
                <View key={index} style={styles.checkItem}>
                  <View style={styles.checkCircle}>
                    <Icon name="checkmark" size={12} color={colorPalette.white} />
                  </View>
                  <Text role="bodySm" style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </Box>
          </Surface>

          {mode === 'arrival' && (
            <Surface tone="inset" padding={3} radiusToken="lg">
              <Box layoutDirection="row" align="center" gap={3}>
                <Icon name="call-outline" size={20} tone="brand" />
                <View style={{ flex: 1 }}>
                  <Text role="bodyStrong">اتصال بالعميل</Text>
                  <Text role="caption" tone="muted">يمكنك الاتصال بالعميل لتنسيق الاستلام.</Text>
                </View>
                <Button label="اتصل" size="sm" tone="primary" />
              </Box>
            </Surface>
          )}

          <Box paddingVertical={spacing[2]}>
            <Pressable onPress={onReportIssue} style={styles.issueButton}>
              <Icon name="warning-outline" size={16} color={colorPalette.orange} />
              <Text role="bodySm" style={styles.issueText}>أواجه مشكلة في {mode === 'pickup' ? 'الاستلام' : 'التسليم'}</Text>
            </Pressable>
          </Box>
        </Box>
      }
      primaryActionLabel={config.cta}
      onPrimaryAction={onConfirm}
      secondaryActionLabel="الرجوع"
      onSecondaryAction={onBack}
    />
  );
}

const styles = StyleSheet.create({
  checkItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colorPalette.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    color: colorPalette.deepBlue,
    textAlign: 'right',
  },
  issueButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colorPalette.orange,
    borderRadius: radius.md,
    borderStyle: 'dashed',
  },
  issueText: {
    color: colorPalette.orange,
  },
});
