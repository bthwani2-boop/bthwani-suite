import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Box,
  Icon,
  MobileScrollView,
  Surface,
  Text,
  TopBar,
  colorPalette,
  safeArea,
  spacing,
  useTheme,
  TextField,
  Button,
  Switch,
  ActionStrip,
  Divider,
  radius,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshPreferencesHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  const { theme } = useTheme();

  // Active section for accordion (defaults to 'delivery')
  const [expandedSection, setExpandedSection] = React.useState<'delivery' | 'notifications' | 'privacy' | null>('delivery');

  // Tab 1: Delivery preferences state
  const [deliveryInstructions, setDeliveryInstructions] = React.useState('اتصل قبل الوصول بدقيقتين واترك الطلب عند الباب عند عدم الرد.');

  // Tab 2: Notifications preferences state
  const [orderProgressAlerts, setOrderProgressAlerts] = React.useState(true);
  const [smartArrivalBell, setSmartArrivalBell] = React.useState(true);
  const [promotionalAlerts, setPromotionalAlerts] = React.useState(true);
  const [systemAlerts, setSystemAlerts] = React.useState(false);

  // Tab 3: Experience & Privacy preferences state
  const [quickOrder, setQuickOrder] = React.useState(true);
  const [autoSaveAddresses, setAutoSaveAddresses] = React.useState(true);
  const [highPrivacy, setHighPrivacy] = React.useState(false);
  const [accessibilityMode, setAccessibilityMode] = React.useState(false);

  // Status message state
  const [statusMsg, setStatusMsg] = React.useState('');
  const [statusTone, setStatusTone] = React.useState<'success' | 'danger'>('success');

  const handleSave = () => {
    setStatusMsg('تم حفظ جميع التفضيلات والتعديلات بنجاح وآمن!');
    setStatusTone('success');
    setTimeout(() => {
      setStatusMsg('');
    }, 3000);
  };

  const handleReset = () => {
    setDeliveryInstructions('اتصل قبل الوصول بدقيقتين واترك الطلب عند الباب عند عدم الرد.');
    setOrderProgressAlerts(true);
    setSmartArrivalBell(true);
    setPromotionalAlerts(true);
    setSystemAlerts(false);
    setQuickOrder(true);
    setAutoSaveAddresses(true);
    setHighPrivacy(false);
    setAccessibilityMode(false);
    setStatusMsg('تم إعادة التفضيلات إلى القيم الافتراضية بنجاح.');
    setStatusTone('success');
    setTimeout(() => {
      setStatusMsg('');
    }, 3000);
  };

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title="تفضيلات التوصيل"
        subtitle="إعدادات خاصة بالتسليم والاستبدال"
        primaryActionLabel="العودة لمساحتي"
        onPrimaryAction={onBack}
        onRetry={onRetry}
      />
    );
  }

  const quickSuggestions = [
    'اترك الطلب عند الباب دون طرق.',
    'اتصل قبل الوصول بخمس دقائق.',
    'سلم الطلب يدوياً للمستلم فقط.',
  ];

  const toggleSection = (section: 'delivery' | 'notifications' | 'privacy') => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="تفضيلات التوصيل"
        actions={onBack ? [{
          id: 'back',
          icon: <Icon name="chevron-back" mirrored size={18} />,
          accessibilityLabel: 'العودة',
          onPress: onBack,
        }] : []}
      />

      <MobileScrollView
        fill
        padding={4}
        gap={4}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        {statusMsg ? (
          <Surface
            tone="raised"
            padding={3}
            style={{
              backgroundColor: statusTone === 'success' ? colorPalette.successSoft : colorPalette.dangerSoft,
              borderColor: statusTone === 'success' ? colorPalette.successSoft : colorPalette.dangerSoft,
              borderWidth: 1,
              borderRadius: radius.sm2,
            }}
          >
            <Box align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <Icon
                name={statusTone === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={statusTone === 'success' ? colorPalette.success : colorPalette.danger}
              />
              <Text
                role="bodySm"
                weight="bold"
                style={{
                  color: statusTone === 'success' ? colorPalette.successStrong : colorPalette.dangerStrong,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {statusMsg}
              </Text>
            </Box>
          </Surface>
        ) : null}

        {/* Action Strip List (Completely Flat, No Containers) */}
        <View style={{ paddingTop: spacing[2] }}>
          <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right', paddingHorizontal: spacing[4], marginBottom: spacing[2] }}>
            خيارات التفضيلات
          </Text>

          <Divider />

          {/* 1. Delivery Section Strip */}
          <View>
            <ActionStrip
              icon="car"
              title="تعليمات الكابتن والتسليم"
              subtitle={deliveryInstructions ? (deliveryInstructions.length > 40 ? deliveryInstructions.substring(0, 40) + '...' : deliveryInstructions) : 'حدد ملاحظاتك وتوجيهاتك للكابتن'}
              expanded={expandedSection === 'delivery'}
              onPress={() => toggleSection('delivery')}
              hideDivider
            >
              <Box gap={3} style={{ paddingTop: spacing[2] }}>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  ملاحظات أو توجيهات تظهر للكابتن لمساعدته في العثور على موقعك وتوصيل الطلب بسهولة وسرعة.
                </Text>
                <TextField
                  value={deliveryInstructions}
                  onChangeText={setDeliveryInstructions}
                  placeholder="أدخل تعليمات التوصيل هنا..."
                  multiline
                  numberOfLines={3}
                  style={{ textAlign: 'right', color: theme.text, minHeight: 80 }}
                />

                {/* Quick Suggestion Chips */}
                <Box gap={2} style={{ marginTop: spacing[1], flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
                  {quickSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      onPress={() => setDeliveryInstructions(suggestion)}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: spacing[3],
                        backgroundColor: theme.fieldBackground,
                        borderRadius: radius.lg2,
                        borderWidth: 1,
                        borderColor: theme.line,
                      }}
                    >
                      <Text role="bodySm" style={{ color: theme.text }}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </Box>
              </Box>
            </ActionStrip>
          </View>

          <Divider />

          {/* 2. Notifications Section Strip */}
          <View>
            <ActionStrip
              icon="notifications"
              title="إعدادات التنبيهات"
              subtitle="إشعارات حالة الطلب، جرس الوصول، والعروض"
              expanded={expandedSection === 'notifications'}
              onPress={() => toggleSection('notifications')}
              hideDivider
            >
              <Box gap={4} style={{ paddingTop: spacing[2] }}>
                <Switch
                  label="إشعارات حالة الطلب المباشرة"
                  description="تلقي تحديثات فورية عند قبول الطلب، خروج الكابتن، والوصول."
                  value={orderProgressAlerts}
                  onValueChange={setOrderProgressAlerts}
                />

                <Divider />

                <Switch
                  label="تفعيل جرس الوصول الذكي"
                  description="إرسال تنبيه بصوت رنين مرتفع ونغمة مميزة عند اقتراب الكابتن."
                  value={smartArrivalBell}
                  onValueChange={setSmartArrivalBell}
                />

                <Divider />

                <Switch
                  label="العروض والتخفيضات الحصرية"
                  description="تنبيهات مخصصة لأقوى التخفيضات، الهدايا، وكوبونات التوصيل المجاني."
                  value={promotionalAlerts}
                  onValueChange={setPromotionalAlerts}
                />

                <Divider />

                <Switch
                  label="تنبيهات النظام الأساسية"
                  description="إشعارات الأمان والخصوصية والتحديثات الهامة للبنية التحتية للتطبيق."
                  value={systemAlerts}
                  onValueChange={setSystemAlerts}
                />
              </Box>
            </ActionStrip>
          </View>

          <Divider />

          {/* 3. Privacy & Experience Section Strip */}
          <View>
            <ActionStrip
              icon="lock-closed"
              title="الخصوصية وتسهيلات التجربة"
              subtitle="الطلب السريع، حفظ العناوين، ووضع الخصوصية العالي"
              expanded={expandedSection === 'privacy'}
              onPress={() => toggleSection('privacy')}
              hideDivider
            >
              <Box gap={4} style={{ paddingTop: spacing[2] }}>
                <Switch
                  label="الطلب السريع بلمسة واحدة"
                  description="إتمام الطلب مباشرة باستخدام عنوانك وطريقة الدفع الافتراضية."
                  value={quickOrder}
                  onValueChange={setQuickOrder}
                />

                <Divider />

                <Switch
                  label="حفظ المواقع والعناوين تلقائياً"
                  description="حفظ العناوين الجديدة تلقائياً لتسهيل الاستخدام مستقبلاً."
                  value={autoSaveAddresses}
                  onValueChange={setAutoSaveAddresses}
                />

                <Divider />

                <Switch
                  label="تفعيل وضع الخصوصية العالي"
                  description="حظر الكباتن والمناديب من رؤية اسمك الكامل أو رقمك الفعلي."
                  value={highPrivacy}
                  onValueChange={setHighPrivacy}
                />

                <Divider />

                <Switch
                  label="تسهيلات الوصول وقراءة الشاشة"
                  description="تكبير الخطوط وزيادة التباين البصري وتوافق قارئ الشاشة."
                  value={accessibilityMode}
                  onValueChange={setAccessibilityMode}
                />
              </Box>
            </ActionStrip>
          </View>

          <Divider />
        </View>

        {/* Global Save & Reset Actions */}
        <Box gap={2} style={{ marginTop: spacing[4] }}>
          <Button
            label="حفظ كل التفضيلات والتغييرات"
            tone="brand"
            onPress={handleSave}
            style={{ width: '100%' }}
          />

          <Button
            label="إعادة تعيين إلى الافتراضي"
            tone="ghost"
            onPress={handleReset}
            style={{ width: '100%' }}
          />
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshPreferencesHubScreen;
