// dsh_partner_manager_invite — Staff access management
// Surface: app-partner | §30 States: Loading/Error/Content

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  BTHWANI_COLORS,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

import {
  inviteDshPartnerManager,
  getDshPartnerStaffAccounts,
  activateDshPartnerStaffWithCode,
  deactivateDshPartnerStaffAccount,
  updateDshPartnerStaffPermissions,
  updateDshPartnerStaffShifts,
  type DshPartnerStaffAccount,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import {
  buildPartnerStaffFixture,
  type PartnerShiftDay,
} from '../../fixtures/partnerStaff';

const PERMISSION_OPTIONS = [
  'manage_orders',
  'manage_staff',
  'manage_menu',
  'manage_finances',
] as const;
type PermissionOption = (typeof PERMISSION_OPTIONS)[number];
const BASIC_PERMISSION_OPTIONS = ['manage_orders'] as const;
const ADVANCED_PERMISSION_OPTIONS = [
  'manage_staff',
  'manage_menu',
  'manage_finances',
] as const;
const ROLE_OPTIONS = ['employee', 'supervisor'] as const;
const SHIFT_DAYS: PartnerShiftDay[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];
const SHIFT_REPEAT_OPTIONS = ['daily', 'weekly', 'monthly'] as const;

export const AutoDshPartnerManagerInvite: React.FC<{
  navigation?: any;
  route?: { params?: { partner_id?: string } };
}> = ({ route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      writingDirection: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    }),
    [isRTL]
  );
  const roleLabelMap = useMemo(
    () => ({
      employee: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.role.employee'
      ),
      supervisor: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.role.supervisor'
      ),
    }),
    [t]
  );
  const permissionLabelMap = useMemo(
    () => ({
      manage_orders: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permission.manage_orders'
      ),
      manage_staff: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permission.manage_staff'
      ),
      manage_menu: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permission.manage_menu'
      ),
      manage_finances: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permission.manage_finances'
      ),
    }),
    [t]
  );
  const permissionDescriptionMap = useMemo(
    () => ({
      manage_orders: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permissionDescription.manage_orders'
      ),
      manage_staff: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permissionDescription.manage_staff'
      ),
      manage_menu: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permissionDescription.manage_menu'
      ),
      manage_finances: t(
        'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permissionDescription.manage_finances'
      ),
    }),
    [t]
  );

  const maxEmployees = 3;

  const partnerId = (route?.params?.partner_id ?? 'me').trim() || 'me';
  const actorRole = 'owner' as const;

  const [phone, setPhone] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]>('employee');
  const [permissions, setPermissions] = useState<string[]>(['manage_orders']);
  const [showAdvancedPermissions, setShowAdvancedPermissions] = useState(false);
  const [activePermissionHint, setActivePermissionHint] =
    useState<PermissionOption | null>(null);
  const permissionHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [shiftDay, setShiftDay] = useState('sun');
  const [shiftFrom, setShiftFrom] = useState('09:00');
  const [shiftTo, setShiftTo] = useState('17:00');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [shiftRepeat, setShiftRepeat] =
    useState<(typeof SHIFT_REPEAT_OPTIONS)[number]>('weekly');
  const [selectedDays, setSelectedDays] = useState<PartnerShiftDay[]>(['sun']);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [staffAccounts, setStaffAccounts] = useState<DshPartnerStaffAccount[]>(
    []
  );
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteCodeExpiresAt, setInviteCodeExpiresAt] = useState<string | null>(
    null
  );
  const [activationPhone, setActivationPhone] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [activationSheetVisible, setActivationSheetVisible] = useState(false);
  const [state, setState] = useState<ScreenState>('content');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [usingFixtureData, setUsingFixtureData] = useState(false);

  const loadAccounts = useCallback(async () => {
    const list = await getDshPartnerStaffAccounts(partnerId);
    if (list.length > 0) {
      setStaffAccounts(list);
      setUsingFixtureData(false);
      return;
    }
    setStaffAccounts(buildPartnerStaffFixture());
    setUsingFixtureData(true);
  }, [partnerId]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    const dayMap: PartnerShiftDay[] = [
      'sun',
      'mon',
      'tue',
      'wed',
      'thu',
      'fri',
      'sat',
    ];
    const autoDay = dayMap[scheduleDate.getDay()] ?? 'sun';
    setShiftDay(autoDay);
    setSelectedDays(prev =>
      prev.includes(autoDay) ? prev : [...prev, autoDay]
    );
  }, [scheduleDate]);

  useEffect(() => {
    return () => {
      if (permissionHintTimeoutRef.current) {
        clearTimeout(permissionHintTimeoutRef.current);
      }
    };
  }, []);

  const togglePermission = useCallback((permission: string) => {
    setPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  }, []);

  const handlePermissionPress = useCallback(
    (permission: PermissionOption) => {
      togglePermission(permission);
      setActivePermissionHint(permission);
      if (permissionHintTimeoutRef.current) {
        clearTimeout(permissionHintTimeoutRef.current);
      }
      permissionHintTimeoutRef.current = setTimeout(() => {
        setActivePermissionHint(current =>
          current === permission ? null : current
        );
      }, 2200);
    },
    [togglePermission]
  );

  const formatTime = useCallback((d: Date): string => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

  const toggleSelectedDay = useCallback((day: PartnerShiftDay) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }, []);

  const submit = useCallback(async () => {
    const normalizedPhone = phone.replace(/\s+/g, '').trim();
    const normalizedName = employeeName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const isPhoneValid = /^\+?\d{8,15}$/.test(normalizedPhone);
    const isEmailValid =
      !normalizedEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    const isShiftDayValid = SHIFT_DAYS.includes(
      shiftDay as (typeof SHIFT_DAYS)[number]
    );
    const isShiftTimeValid =
      /^([01]\d|2[0-3]):([0-5]\d)$/.test(shiftFrom) &&
      /^([01]\d|2[0-3]):([0-5]\d)$/.test(shiftTo);

    const needsSpecificDays =
      shiftRepeat === 'weekly' || shiftRepeat === 'monthly';
    if (
      !normalizedName ||
      !isPhoneValid ||
      !isEmailValid ||
      !isShiftDayValid ||
      !isShiftTimeValid ||
      permissions.length === 0 ||
      (needsSpecificDays && selectedDays.length === 0)
    ) {
      setErrorMessage(
        t('dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail')
      );
      setState('error');
      return;
    }

    setState('loading');
    setErrorMessage(null);

    try {
      const inviteResult = await inviteDshPartnerManager(
        partnerId,
        normalizedEmail,
        role,
        permissions,
        {
          name: normalizedName,
          phone: normalizedPhone,
          actorRole,
          shifts: [
            ...(needsSpecificDays ? selectedDays : [shiftDay]).map(day => ({
              day,
              from: shiftFrom,
              to: shiftTo,
              date: scheduleDate.toISOString().slice(0, 10),
              repeat: shiftRepeat,
              days: needsSpecificDays ? selectedDays : undefined,
            })),
          ],
        }
      );
      setInviteCode(inviteResult.inviteCode ?? null);
      setInviteCodeExpiresAt(inviteResult.inviteCodeExpiresAt ?? null);
      setActivationPhone(normalizedPhone);
      setActivationCode(inviteResult.inviteCode ?? '');
      setActivationSheetVisible(false);
      setDone(true);
      setState('content');
      await loadAccounts();
    } catch (e) {
      setErrorMessage(
        e instanceof Error
          ? e.message
          : t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail'
            )
      );
      setState('error');
    }
  }, [
    phone,
    employeeName,
    email,
    permissions,
    t,
    partnerId,
    role,
    actorRole,
    shiftDay,
    shiftFrom,
    shiftTo,
    scheduleDate,
    shiftRepeat,
    selectedDays,
    loadAccounts,
  ]);

  const handleDeactivate = useCallback(
    async (targetPhone: string) => {
      setState('loading');
      try {
        await deactivateDshPartnerStaffAccount(
          targetPhone,
          partnerId,
          actorRole
        );
        await loadAccounts();
        setState('content');
      } catch (e) {
        setErrorMessage(
          e instanceof Error
            ? e.message
            : t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail'
              )
        );
        setState('error');
      }
    },
    [partnerId, actorRole, loadAccounts, t]
  );

  const handleQuickToggleOrderPermission = useCallback(
    async (account: DshPartnerStaffAccount) => {
      const has = account.permissions.includes('manage_orders');
      const next = has
        ? account.permissions.filter(p => p !== 'manage_orders')
        : [...account.permissions, 'manage_orders'];
      setState('loading');
      try {
        await updateDshPartnerStaffPermissions(
          account.phone,
          next,
          partnerId,
          actorRole
        );
        await loadAccounts();
        setState('content');
      } catch (e) {
        setErrorMessage(
          e instanceof Error
            ? e.message
            : t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail'
              )
        );
        setState('error');
      }
    },
    [partnerId, actorRole, loadAccounts, t]
  );

  const handleApplyDefaultShift = useCallback(
    async (account: DshPartnerStaffAccount) => {
      setState('loading');
      try {
        await updateDshPartnerStaffShifts(
          account.phone,
          (selectedDays.length > 0 ? selectedDays : [shiftDay]).map(day => ({
            day,
            from: shiftFrom,
            to: shiftTo,
            date: scheduleDate.toISOString().slice(0, 10),
            repeat: shiftRepeat,
            days: selectedDays,
          })),
          partnerId,
          actorRole
        );
        await loadAccounts();
        setState('content');
      } catch (e) {
        setErrorMessage(
          e instanceof Error
            ? e.message
            : t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail'
              )
        );
        setState('error');
      }
    },
    [
      selectedDays,
      shiftDay,
      shiftFrom,
      shiftTo,
      scheduleDate,
      shiftRepeat,
      partnerId,
      actorRole,
      loadAccounts,
      t,
    ]
  );

  const handleActivateWithCode = useCallback(async () => {
    const phoneValue = activationPhone.replace(/\s+/g, '').trim();
    const codeValue = activationCode.trim();
    if (!/^\+?\d{8,15}$/.test(phoneValue) || !/^\d{4}$/.test(codeValue)) {
      setErrorMessage(
        t('dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail')
      );
      setState('error');
      return;
    }
    setState('loading');
    try {
      const ok = await activateDshPartnerStaffWithCode(
        phoneValue,
        codeValue,
        partnerId
      );
      if (!ok)
        throw new Error(
          t('dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail')
        );
      await loadAccounts();
      setState('content');
      setDone(true);
      setActivationSheetVisible(false);
    } catch (e) {
      setErrorMessage(
        e instanceof Error
          ? e.message
          : t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail'
            )
      );
      setState('error');
    }
  }, [activationPhone, activationCode, partnerId, loadAccounts, t]);

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state='loading'
        loadingMessage={t(
          'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.loadingMessage'
        )}
        screenName='auto_dsh_partner_manager_invite'
        operationName='dsh_partner_manager_invite'
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state='error'
        errorMessage={
          errorMessage ??
          t('dsh.app-partner.mobile.auto_dsh_partner_manager_invite.inviteFail')
        }
        screenName='auto_dsh_partner_manager_invite'
        operationName='dsh_partner_manager_invite'
        onErrorAction={() => {
          setState('content');
          setErrorMessage(null);
        }}
      />
    );
  }

  return (
    <ScreenWrapper state='content'>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, textAlignStart]}>
          {t('dsh.app-partner.mobile.auto_dsh_partner_manager_invite.title')}
        </Text>

        <Text style={[styles.hint, textAlignStart]}>
          {t(
            'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.employeeHint',
            { max: maxEmployees }
          )}
        </Text>

        <View style={styles.sectionCard}>
          <TextInput
            style={[styles.input, textAlignStart]}
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder={t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.employeeNameLabel'
            )}
            placeholderTextColor={semanticRoles.onSurfaceMuted}
            autoCapitalize='words'
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, textAlignStart]}
            value={phone}
            onChangeText={setPhone}
            placeholder={t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.phoneLabel'
            )}
            placeholderTextColor={semanticRoles.onSurfaceMuted}
            keyboardType='phone-pad'
            autoCapitalize='none'
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, textAlignStart]}
            value={email}
            onChangeText={setEmail}
            placeholder={t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.emailLabel'
            )}
            placeholderTextColor={semanticRoles.onSurfaceMuted}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.roleLabel'
            )}
          </Text>
          <View style={styles.chipsRow}>
            {ROLE_OPTIONS.map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.chip, role === r && styles.chipActive]}
                onPress={() => setRole(r)}
              >
                <Text
                  style={[styles.chipText, role === r && styles.chipTextActive]}
                >
                  {roleLabelMap[r]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permissionsTitle'
            )}
          </Text>
          <Text style={[styles.permissionsHint, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.permissionsHint'
            )}
          </Text>
          <Text style={[styles.shiftLabel, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.basicPermissionsTitle'
            )}
          </Text>
          <View style={styles.chipsRow}>
            {BASIC_PERMISSION_OPTIONS.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  permissions.includes(p) && styles.chipActive,
                ]}
                onPress={() => handlePermissionPress(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    permissions.includes(p) && styles.chipTextActive,
                  ]}
                >
                  {permissionLabelMap[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.advancedToggleBtn}
            onPress={() => setShowAdvancedPermissions(prev => !prev)}
          >
            <Text style={styles.advancedToggleBtnText}>
              {showAdvancedPermissions
                ? t(
                    'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.hideAdvancedPermissions'
                  )
                : t(
                    'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.showAdvancedPermissions'
                  )}
            </Text>
          </TouchableOpacity>
          {showAdvancedPermissions ? (
            <>
              <Text style={[styles.shiftLabel, textAlignStart]}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.advancedPermissionsTitle'
                )}
              </Text>
              <View style={styles.chipsRow}>
                {ADVANCED_PERMISSION_OPTIONS.map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.chip,
                      permissions.includes(p) && styles.chipActive,
                    ]}
                    onPress={() => handlePermissionPress(p)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        permissions.includes(p) && styles.chipTextActive,
                      ]}
                    >
                      {permissionLabelMap[p]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}
          {activePermissionHint ? (
            <View style={styles.permissionBubble}>
              <Text style={[styles.permissionBubbleTitle, textAlignStart]}>
                {permissionLabelMap[activePermissionHint]}
              </Text>
              <Text style={[styles.permissionBubbleText, textAlignStart]}>
                {permissionDescriptionMap[activePermissionHint]}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.sectionTitle, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.shiftTitle'
            )}
          </Text>
          <Text style={[styles.shiftHelper, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.shiftHelper'
            )}
          </Text>
          <View style={styles.scheduleHeaderRow}>
            <TouchableOpacity
              style={styles.calendarBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.calendarBtnText}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.calendarButtonIcon'
                )}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.scheduleDateText, textAlignStart]}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.selectedDateLabel',
                {
                  date: scheduleDate.toLocaleDateString(),
                  day: t(
                    `dsh.app-partner.mobile.auto_dsh_partner_manager_invite.day.${shiftDay}`
                  ),
                }
              )}
            </Text>
          </View>
          <View style={styles.chipsRow}>
            <TouchableOpacity
              style={[styles.timeBtn]}
              onPress={() => setShowFromTimePicker(true)}
            >
              <Text style={styles.timeBtnLabel}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.shiftFromLabel'
                )}
              </Text>
              <Text style={styles.timeBtnValue}>{shiftFrom}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeBtn]}
              onPress={() => setShowToTimePicker(true)}
            >
              <Text style={styles.timeBtnLabel}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.shiftToLabel'
                )}
              </Text>
              <Text style={styles.timeBtnValue}>{shiftTo}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.shiftLabel, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.shiftRepeatLabel'
            )}
          </Text>
          <View style={styles.chipsRow}>
            {SHIFT_REPEAT_OPTIONS.map(repeat => (
              <TouchableOpacity
                key={repeat}
                style={[
                  styles.chip,
                  shiftRepeat === repeat && styles.chipActive,
                ]}
                onPress={() => setShiftRepeat(repeat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    shiftRepeat === repeat && styles.chipTextActive,
                  ]}
                >
                  {t(
                    `dsh.app-partner.mobile.auto_dsh_partner_manager_invite.repeat.${repeat}`
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {shiftRepeat === 'weekly' || shiftRepeat === 'monthly' ? (
            <>
              <Text style={[styles.shiftLabel, textAlignStart]}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.specificDaysLabel'
                )}
              </Text>
              <View style={styles.chipsRow}>
                {SHIFT_DAYS.map(d => (
                  <TouchableOpacity
                    key={`specific-${d}`}
                    style={[
                      styles.chip,
                      selectedDays.includes(d) && styles.chipActive,
                    ]}
                    onPress={() => toggleSelectedDay(d)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedDays.includes(d) && styles.chipTextActive,
                      ]}
                    >
                      {t(
                        `dsh.app-partner.mobile.auto_dsh_partner_manager_invite.day.${d}`
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}
          {showDatePicker ? (
            <DateTimePicker
              value={scheduleDate}
              mode='date'
              display={Platform.OS === 'android' ? 'calendar' : 'default'}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (event.type === 'dismissed' || !date) return;
                setScheduleDate(date);
              }}
            />
          ) : null}
          {showFromTimePicker ? (
            <DateTimePicker
              value={new Date(`${scheduleDate.toDateString()} ${shiftFrom}`)}
              mode='time'
              display={Platform.OS === 'android' ? 'clock' : 'default'}
              onChange={(event, date) => {
                setShowFromTimePicker(false);
                if (event.type === 'dismissed' || !date) return;
                setShiftFrom(formatTime(date));
              }}
            />
          ) : null}
          {showToTimePicker ? (
            <DateTimePicker
              value={new Date(`${scheduleDate.toDateString()} ${shiftTo}`)}
              mode='time'
              display={Platform.OS === 'android' ? 'clock' : 'default'}
              onChange={(event, date) => {
                setShowToTimePicker(false);
                if (event.type === 'dismissed' || !date) return;
                setShiftTo(formatTime(date));
              }}
            />
          ) : null}
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => void submit()}>
          <Text style={styles.btnText}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.btnText'
            )}
          </Text>
        </TouchableOpacity>

        {done && inviteCode ? (
          <View style={styles.doneWrap}>
            <Text style={[styles.done, textAlignStart]}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.doneText'
              )}{' '}
              | CODE: {inviteCode}
              {inviteCodeExpiresAt ? ` (${inviteCodeExpiresAt})` : ''}
            </Text>
            <TouchableOpacity
              style={styles.activateRevealBtn}
              onPress={() => setActivationSheetVisible(true)}
            >
              <Text style={styles.activateRevealBtnText}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.continueActivationCta'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, textAlignStart]}>
          {t(
            'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.accountsTitle'
          )}
        </Text>
        <View style={styles.fixtureActionsRow}>
          <TouchableOpacity
            style={[
              styles.fixtureActionBtn,
              usingFixtureData && styles.fixtureActionBtnActive,
            ]}
            onPress={() => {
              setStaffAccounts(buildPartnerStaffFixture());
              setUsingFixtureData(true);
            }}
          >
            <Text
              style={[
                styles.fixtureActionBtnText,
                usingFixtureData && styles.fixtureActionBtnTextActive,
              ]}
            >
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.useFixtureCta'
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.fixtureActionBtn,
              !usingFixtureData && styles.fixtureActionBtnActive,
            ]}
            onPress={() => void loadAccounts()}
          >
            <Text
              style={[
                styles.fixtureActionBtnText,
                !usingFixtureData && styles.fixtureActionBtnTextActive,
              ]}
            >
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.useLiveDataCta'
              )}
            </Text>
          </TouchableOpacity>
        </View>
        {usingFixtureData ? (
          <Text style={[styles.fixtureInfo, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.fixtureInfo'
            )}
          </Text>
        ) : null}
        {staffAccounts.map(account => (
          <View key={account.phone} style={styles.card}>
            <Text style={[styles.cardTitle, textAlignStart]}>
              {account.name ??
                t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.unnamedEmployee'
                )}{' '}
              - {account.phone}
            </Text>
            <Text style={[styles.cardMeta, textAlignStart]}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.accountMeta',
                {
                  active: String(account.active),
                  permissions: account.permissions.join(', ') || '-',
                }
              )}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.cardBtn}
                onPress={() => void handleQuickToggleOrderPermission(account)}
              >
                <Text style={styles.cardBtnText}>
                  {t(
                    'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.toggleOrderPermissionText'
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardBtn}
                onPress={() => void handleApplyDefaultShift(account)}
              >
                <Text style={styles.cardBtnText}>
                  {t(
                    'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.applyShiftPresetText'
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cardBtn, styles.cardDanger]}
                onPress={() => void handleDeactivate(account.phone)}
              >
                <Text style={styles.cardBtnText}>
                  {t(
                    'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.deactivateText'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={activationSheetVisible}
        animationType='slide'
        transparent
        onRequestClose={() => setActivationSheetVisible(false)}
      >
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheetCard}>
            <Text style={[styles.sectionTitle, textAlignStart]}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.activateSectionTitle'
              )}
            </Text>
            <TextInput
              style={[styles.input, textAlignStart]}
              value={activationPhone}
              onChangeText={setActivationPhone}
              placeholder={t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.phoneLabel'
              )}
              placeholderTextColor={semanticRoles.onSurfaceMuted}
              keyboardType='phone-pad'
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TextInput
              style={[styles.input, textAlignStart]}
              value={activationCode}
              onChangeText={setActivationCode}
              placeholder={t(
                'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.activationCodeLabel'
              )}
              placeholderTextColor={semanticRoles.onSurfaceMuted}
              keyboardType='number-pad'
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => void handleActivateWithCode()}
            >
              <Text style={styles.btnText}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.activateButtonText'
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetDismissBtn}
              onPress={() => setActivationSheetVisible(false)}
            >
              <Text style={styles.sheetDismissBtnText}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_manager_invite.hideActivationCta'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  hint: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 20,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginTop: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.sm,
  },
  permissionsHint: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  permissionBubble: {
    marginTop: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.sm,
  },
  permissionBubbleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: 4,
  },
  permissionBubbleText: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    lineHeight: 17,
  },
  advancedToggleBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    backgroundColor: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  advancedToggleBtnText: {
    fontSize: 12,
    color: semanticRoles.onSurface,
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  chipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  chipText: { color: semanticRoles.onSurface, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: semanticRoles.primaryCTAText },
  shiftHelper: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  shiftLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  fixtureActionsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  fixtureActionBtn: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  fixtureActionBtnActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  fixtureActionBtnText: {
    color: semanticRoles.onSurface,
    fontSize: 12,
    fontWeight: '600',
  },
  fixtureActionBtnTextActive: { color: semanticRoles.primaryCTAText },
  fixtureInfo: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  calendarBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BTHWANI_COLORS.surface,
  },
  calendarBtnText: { fontSize: 14 },
  scheduleDateText: { flex: 1, fontSize: 13, color: semanticRoles.onSurface },
  timeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  timeBtnLabel: {
    fontSize: 11,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: 4,
  },
  timeBtnValue: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.onSurface,
  },
  btn: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xs,
  },
  btnSecondary: {
    backgroundColor: semanticRoles.primaryCTA,
    opacity: 0.9,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  btnText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  done: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    marginTop: BTHWANI_SPACING.md,
  },
  doneWrap: { marginTop: BTHWANI_SPACING.md, marginBottom: BTHWANI_SPACING.md },
  activateRevealBtn: {
    marginTop: BTHWANI_SPACING.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  activateRevealBtnText: {
    color: semanticRoles.primaryCTA,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  cardTitle: {
    color: semanticRoles.onSurface,
    fontWeight: '700',
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardMeta: {
    color: semanticRoles.onSurfaceMuted,
    fontSize: 12,
    marginBottom: BTHWANI_SPACING.sm,
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  cardBtn: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cardDanger: { backgroundColor: semanticRoles.error },
  cardBtnText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 11,
    fontWeight: '700',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: BTHWANI_SPACING.contentH,
    borderTopWidth: 1,
    borderColor: semanticRoles.outline,
  },
  sheetDismissBtn: {
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
  },
  sheetDismissBtnText: {
    color: semanticRoles.onSurfaceMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default AutoDshPartnerManagerInvite;
