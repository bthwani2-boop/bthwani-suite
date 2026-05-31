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
} from '@bthwani/ui-kit';
import {
  DshBenefitsHubScreen,
  type DshBenefitsInitialSection,
} from './BenefitsScreen';
import { DshOperationScreen, type DshOperationScreenState } from '../parts/OperationScreen';

export type DshMySpaceSubScreenProps = {
  state?: DshOperationScreenState;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshWalletHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="المحفظة"
      subtitle="الرصيد، الاسترداد، وطرق الدفع"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshLoyaltyHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return renderBenefitsCompatibilityScreen('loyalty', { state, onRetry, onBack });
}

function renderBenefitsCompatibilityScreen(
  initialSection: DshBenefitsInitialSection,
  props: DshMySpaceSubScreenProps,
) {
  const { onBack, onRetry, state = 'ready' } = props;

  return (
    <DshBenefitsHubScreen
      initialSection={initialSection}
      onBack={onBack}
      onRetry={onRetry}
      state={state}
    />
  );
}

export function DshSubscriptionsHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return renderBenefitsCompatibilityScreen('subscription', { state, onRetry, onBack });
}

export function DshAddressesHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="العناوين المحفوظة"
      subtitle="إدارة مواقع التوصيل والاستلام"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshLocationHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="الموقع الحالي"
      subtitle="تحديد وتحديث موقعك الميداني"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshIdentityHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  const { theme } = useTheme();

  // Profile data state
  const [displayName, setDisplayName] = React.useState('أحمد الحربي');
  const [phoneNumber, setPhoneNumber] = React.useState('+966 50 123 4567');
  const [email, setEmail] = React.useState('ahmed.harbi@example.com');

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = React.useState('');
  const [passwordStatusTone, setPasswordStatusTone] = React.useState<'success' | 'danger' | 'default'>('default');

  // Deletion state
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
  const [deleteStatusMsg, setDeleteStatusMsg] = React.useState('');

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title="الملف الشخصي"
        subtitle="البيانات الشخصية والأمان"
        onRetry={onRetry}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="الملف الشخصي"
      />

      <MobileScrollView
        fill
        padding={4}
        gap={4}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        <View style={{ gap: spacing[3] }}>
          {/* Header & Verification Status Badge */}
          <Box align="center" gap={2} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
            <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>بيانات الحساب الشخصي</Text>
            <Box align="center" gap={1} style={{ flexDirection: 'row-reverse' }}>
              <Icon name="checkmark-circle" size={16} color={colorPalette.success} />
              <Text role="bodySm" style={{ color: colorPalette.success, fontWeight: 'bold' }}>نشط وآمن</Text>
            </Box>
          </Box>

          {/* Details / Fields */}
          <Box gap={3} style={{ marginTop: spacing[2] }}>
            {/* Display Name Input */}
            <Box gap={1}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>الاسم الظاهر</Text>
              <TextField
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="الاسم الظاهر"
                style={{ textAlign: 'right', color: theme.text }}
              />
            </Box>

            {/* Mobile Number Input */}
            <Box gap={1}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>رقم الجوال</Text>
              <TextField
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="رقم الجوال"
                style={{ textAlign: 'right', color: theme.text }}
                keyboardType="phone-pad"
              />
            </Box>

            {/* Email Address Input */}
            <Box gap={1}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>البريد الإلكتروني</Text>
              <TextField
                value={email}
                onChangeText={setEmail}
                placeholder="البريد الإلكتروني"
                style={{ textAlign: 'right', color: theme.text }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Box>

            {/* Change Password Action Section */}
            <Box style={{ borderTopWidth: 1, borderColor: theme.line, paddingTop: spacing[3], marginTop: spacing[1] }}>
              {!isChangingPassword ? (
                <Button
                  label="تغيير كلمة المرور"
                  tone="brand"
                  onPress={() => setIsChangingPassword(true)}
                  style={{ width: '100%' }}
                />
              ) : (
                <Box gap={3}>
                  <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>تحديث كلمة المرور</Text>

                  <Box gap={1}>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>كلمة المرور الجديدة</Text>
                    <TextField
                      value={password}
                      onChangeText={setPassword}
                      placeholder="أدخل كلمة المرور الجديدة"
                      secureTextEntry
                      style={{ textAlign: 'right', color: theme.text }}
                    />
                  </Box>

                  <Box gap={1}>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>تأكيد كلمة المرور</Text>
                    <TextField
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="أعد كتابة كلمة المرور للتأكيد"
                      secureTextEntry
                      style={{ textAlign: 'right', color: theme.text }}
                    />
                  </Box>

                  {passwordStatusMsg ? (
                    <Text
                      role="bodySm"
                      style={{
                        textAlign: 'right',
                        color: passwordStatusTone === 'success' ? colorPalette.success : colorPalette.danger
                      }}
                    >
                      {passwordStatusMsg}
                    </Text>
                  ) : null}

                  <Box gap={2} style={{ flexDirection: 'row-reverse' }}>
                    <Button
                      label="حفظ كلمة المرور"
                      tone="brand"
                      onPress={() => {
                        if (!password || !confirmPassword) {
                          setPasswordStatusMsg('يرجى ملء جميع الحقول المطلوبة');
                          setPasswordStatusTone('danger');
                          return;
                        }
                        if (password !== confirmPassword) {
                          setPasswordStatusMsg('كلمتا المرور غير متطابقتين');
                          setPasswordStatusTone('danger');
                          return;
                        }
                        setPasswordStatusMsg('تم تحديث كلمة المرور بنجاح وآمن');
                        setPasswordStatusTone('success');
                        setTimeout(() => {
                          setIsChangingPassword(false);
                          setPassword('');
                          setConfirmPassword('');
                          setPasswordStatusMsg('');
                        }, 2000);
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button
                      label="إلغاء"
                      tone="ghost"
                      onPress={() => {
                        setIsChangingPassword(false);
                        setPassword('');
                        setConfirmPassword('');
                        setPasswordStatusMsg('');
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Danger Zone: Delete Account */}
            <Box style={{ borderTopWidth: 1, borderColor: theme.line, paddingTop: spacing[3], marginTop: spacing[2] }}>
              {!isDeletingAccount ? (
                <Button
                  tone="danger"
                  onPress={() => setIsDeletingAccount(true)}
                  style={{ width: '100%', backgroundColor: colorPalette.dangerSoft, borderColor: colorPalette.dangerSoft, borderWidth: 1 }}
                >
                  <Text role="bodyStrong" style={{ color: colorPalette.danger }}>حذف الحساب</Text>
                </Button>
              ) : (
                <Box gap={2} padding={3} style={{ backgroundColor: colorPalette.dangerSoft, borderRadius: 15, borderWidth: 1, borderColor: colorPalette.dangerSoft }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right', color: colorPalette.dangerStrong }}>تنبيه أمان حساس وحرِج!</Text>
                  <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.dangerStrong }}>
                    حذف الحساب سيؤدي إلى مسح كافة البيانات والطلبات والمحفظة بشكل نهائي ولا يمكن استرجاعها.
                  </Text>
                  <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.dangerStrong, marginTop: 4 }}>
                    لتأكيد الإجراء, يرجى كتابة "حذف" في الحقل أدناه:
                  </Text>

                  <TextField
                    value={deleteConfirmText}
                    onChangeText={setDeleteConfirmText}
                    placeholder="اكتب حذف لتأكيد الطلب"
                    style={{ textAlign: 'right', color: colorPalette.dangerStrong, backgroundColor: theme.fieldBackground, borderColor: colorPalette.dangerSoft }}
                  />

                  {deleteStatusMsg ? (
                    <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.success, fontWeight: 'bold', marginTop: 4 }}>
                      {deleteStatusMsg}
                    </Text>
                  ) : null}

                  <Box gap={2} style={{ marginTop: spacing[2], flexDirection: 'row-reverse' }}>
                    <Button
                      label="حذف الحساب نهائياً"
                      disabled={deleteConfirmText !== 'حذف'}
                      tone="danger"
                      onPress={() => {
                        setDeleteStatusMsg('تم إرسال طلب حذف الحساب للإدارة للمراجعة بنجاح.');
                        setTimeout(() => {
                          setIsDeletingAccount(false);
                          setDeleteConfirmText('');
                          setDeleteStatusMsg('');
                        }, 2000);
                      }}
                      style={{ flex: 1, backgroundColor: deleteConfirmText === 'حذف' ? colorPalette.danger : colorPalette.dangerSoft }}
                    />
                    <Button
                      label="تراجع"
                      tone="ghost"
                      onPress={() => {
                        setIsDeletingAccount(false);
                        setDeleteConfirmText('');
                        setDeleteStatusMsg('');
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </View>
      </MobileScrollView>
    </View>
  );
}

export function DshCommercialHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return renderBenefitsCompatibilityScreen('offers', { state, onRetry, onBack });
}

export function DshAppearanceHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="المظهر"
      subtitle="فاتح أبيض أو داكن زجاجي"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

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
              borderRadius: 12,
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
                style={{
                  color: statusTone === 'success' ? colorPalette.successStrong : colorPalette.dangerStrong,
                  fontWeight: 'bold',
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
                        borderRadius: 20,
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
