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
  SegmentedControl,
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
          <Box flexDirection="row-reverse" justifyContent="space-between" alignItems="center" gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>بيانات الحساب الشخصي</Text>
            <Box flexDirection="row-reverse" alignItems="center" gap={1}>
              <Icon name="checkmark-circle" size={16} color={colorPalette.green600} />
              <Text role="bodySm" style={{ color: colorPalette.green600, fontWeight: 'bold' }}>نشط وآمن</Text>
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
                        color: passwordStatusTone === 'success' ? colorPalette.green600 : colorPalette.red600
                      }}
                    >
                      {passwordStatusMsg}
                    </Text>
                  ) : null}

                  <Box flexDirection="row-reverse" gap={2}>
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
                  style={{ width: '100%', backgroundColor: colorPalette.red50, borderColor: colorPalette.red200, borderWidth: 1 }}
                >
                  <Text role="bodyStrong" style={{ color: colorPalette.red600 }}>حذف الحساب</Text>
                </Button>
              ) : (
                <Box gap={2} padding={3} style={{ backgroundColor: colorPalette.red50, borderRadius: 15, borderWidth: 1, borderColor: colorPalette.red200 }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right', color: colorPalette.red800 }}>تنبيه أمان حساس وحرِج!</Text>
                  <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.red700 }}>
                    حذف الحساب سيؤدي إلى مسح كافة البيانات والطلبات والمحفظة بشكل نهائي ولا يمكن استرجاعها.
                  </Text>
                  <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.red700, marginTop: 4 }}>
                    لتأكيد الإجراء, يرجى كتابة "حذف" في الحقل أدناه:
                  </Text>

                  <TextField
                    value={deleteConfirmText}
                    onChangeText={setDeleteConfirmText}
                    placeholder="اكتب حذف لتأكيد الطلب"
                    style={{ textAlign: 'right', color: colorPalette.red800, backgroundColor: theme.fieldBackground, borderColor: colorPalette.red200 }}
                  />

                  {deleteStatusMsg ? (
                    <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.green600, fontWeight: 'bold', marginTop: 4 }}>
                      {deleteStatusMsg}
                    </Text>
                  ) : null}

                  <Box flexDirection="row-reverse" gap={2} style={{ marginTop: spacing[2] }}>
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
                      style={{ flex: 1, backgroundColor: deleteConfirmText === 'حذف' ? colorPalette.red600 : colorPalette.red200 }}
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

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<'delivery' | 'notifications' | 'privacy'>('delivery');

  // Tab 1: Delivery preferences state
  const [deliveryInstructions, setDeliveryInstructions] = React.useState('اتصل قبل الوصول بدقيقتين واترك الطلب عند الباب عند عدم الرد.');
  const [substitutionPref, setSubstitutionPref] = React.useState('chat_first');
  const [contactPref, setContactPref] = React.useState('in_app');

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
    setSubstitutionPref('chat_first');
    setContactPref('in_app');
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="تفضيلات التوصيل"
      />

      {/* Segmented Control Tab Switcher */}
      <Box padding={4} style={{ borderBottomWidth: 1, borderColor: theme.line }}>
        <SegmentedControl
          size="md"
          fullWidth
          options={[
            { value: 'delivery', label: 'التوصيل' },
            { value: 'notifications', label: 'التنبيهات' },
            { value: 'privacy', label: 'الخصوصية والتجربة' },
          ]}
          value={activeTab}
          onValueChange={(nextVal) => setActiveTab(nextVal as 'delivery' | 'notifications' | 'privacy')}
        />
      </Box>

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
              backgroundColor: statusTone === 'success' ? colorPalette.green50 : colorPalette.red50,
              borderColor: statusTone === 'success' ? colorPalette.green200 : colorPalette.red200,
              borderWidth: 1,
              borderRadius: 12,
            }}
          >
            <Box flexDirection="row-reverse" alignItems="center" gap={2}>
              <Icon
                name={statusTone === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={statusTone === 'success' ? colorPalette.green600 : colorPalette.red600}
              />
              <Text
                role="bodySm"
                style={{
                  color: statusTone === 'success' ? colorPalette.green700 : colorPalette.red700,
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

        {activeTab === 'delivery' && (
          <Box gap={4}>
            {/* Delivery Instructions */}
            <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16 }}>
              <Box flexDirection="row-reverse" justifyContent="space-between" alignItems="center">
                <Text role="bodyStrong" style={{ color: theme.text }}>تعليمات الكابتن والتسليم</Text>
                <Icon name="car" size={20} tone="brand" />
              </Box>
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
              <Box flexDirection="row-reverse" flexWrap="wrap" gap={2} style={{ marginTop: spacing[1] }}>
                {quickSuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() => setDeliveryInstructions(suggestion)}
                    style={{
                      paddingVertical: spacing[1.5],
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
            </Surface>

            {/* Substitution Preferences */}
            <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16 }}>
              <Box flexDirection="row-reverse" justifyContent="space-between" alignItems="center">
                <Text role="bodyStrong" style={{ color: theme.text }}>تفضيلات استبدال السلع</Text>
                <Icon name="swap-horizontal" size={20} tone="brand" />
              </Box>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                كيف يتصرف المتجر أو الكابتن في حال عدم توفر أحد الأصناف المطلوبة في سلتك.
              </Text>
              <SegmentedControl
                size="sm"
                fullWidth
                options={[
                  { value: 'chat_first', label: 'المحادثة أولاً' },
                  { value: 'auto_similar', label: 'بديل تلقائي' },
                  { value: 'refund', label: 'استرداد المبلغ' },
                ]}
                value={substitutionPref}
                onValueChange={setSubstitutionPref}
              />
            </Surface>

            {/* Contact Preferences */}
            <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16 }}>
              <Box flexDirection="row-reverse" justifyContent="space-between" alignItems="center">
                <Text role="bodyStrong" style={{ color: theme.text }}>طريقة التواصل المفضلة</Text>
                <Icon name="chatbubbles" size={20} tone="brand" />
              </Box>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                تحديد الوسيلة المفضلة للكابتن للتواصل معك أثناء تجهيز أو توصيل الطلب.
              </Text>
              <SegmentedControl
                size="sm"
                fullWidth
                options={[
                  { value: 'in_app', label: 'محادثة التطبيق' },
                  { value: 'phone_call', label: 'مكالمة هاتفية' },
                ]}
                value={contactPref}
                onValueChange={setContactPref}
              />
            </Surface>
          </Box>
        )}

        {activeTab === 'notifications' && (
          <Box gap={4}>
            <Surface tone="raised" padding={4} gap={4} style={{ borderRadius: 16 }}>
              <Box flexDirection="row-reverse" justifyContent="space-between" alignItems="center" style={{ borderBottomWidth: 1, borderColor: theme.line, paddingBottom: spacing[2] }}>
                <Text role="bodyStrong" style={{ color: theme.text }}>إعدادات التنبيهات</Text>
                <Icon name="notifications" size={20} tone="brand" />
              </Box>

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
            </Surface>
          </Box>
        )}

        {activeTab === 'privacy' && (
          <Box gap={4}>
            <Surface tone="raised" padding={4} gap={4} style={{ borderRadius: 16 }}>
              <Box flexDirection="row-reverse" justifyContent="space-between" alignItems="center" style={{ borderBottomWidth: 1, borderColor: theme.line, paddingBottom: spacing[2] }}>
                <Text role="bodyStrong" style={{ color: theme.text }}>الخصوصية وتسهيلات التجربة</Text>
                <Icon name="lock-closed" size={20} tone="brand" />
              </Box>

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
            </Surface>
          </Box>
        )}

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
