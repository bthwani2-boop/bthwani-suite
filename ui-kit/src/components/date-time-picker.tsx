"use client";
import React, { useState, useMemo } from 'react';
import { View, Pressable, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { colorPalette, spacing, radius, withAlpha, type Direction } from '../foundation';
import { useTheme } from '../providers';
import { Box, Surface, Text } from '../primitives';
import { Icon } from './icons';
import { Modal } from './overlay';
import { Button } from './button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type DateTimePickerProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
  initialDate?: Date;
  initialTime?: string;
  direction?: Direction;
};

export function DateTimePicker({
  visible,
  onClose,
  onConfirm,
  initialDate,
  initialTime = '12:00',
  direction = 'rtl'
}: DateTimePickerProps) {
  const { theme } = useTheme();
  const initialH24 = parseInt(initialTime.split(':')[0]);
  const initialM = parseInt(initialTime.split(':')[1]);

  const [step, setStep] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [viewDate, setViewDate] = useState(initialDate || new Date());

  // UI Hours (1-12)
  const [displayHour, setDisplayHour] = useState(initialH24 % 12 === 0 ? 12 : initialH24 % 12);
  const [selectedMinute, setSelectedMinute] = useState(initialM);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialH24 >= 12 ? 'PM' : 'AM');

  // Animation for step transition
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (step === 'date') {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setStep('time'));
    } else {
      let finalHour = displayHour % 12;
      if (period === 'PM') finalHour += 12;
      const timeString = `${String(finalHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      onConfirm(selectedDate, timeString);
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 'time') {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setStep('date'));
    } else {
      onClose();
    }
  };

  // Calendar Logic
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthDays = useMemo(() => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const daysCount = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);

    const days = [];
    // Padding for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [viewDate]);

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const changeMonth = (offset: number) => {
    const nextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(nextMonth);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const translateXDate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, direction === 'rtl' ? 400 : -400],
  });

  const translateXTime = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [direction === 'rtl' ? -400 : 400, 0],
  });

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.overlay}>
        <Surface tone="raised" radiusToken="xl" style={styles.container}>
          {/* Header */}
          <Box padding={4} layoutDirection="row" style={styles.header}>
            <Pressable onPress={handleBack} style={styles.iconButton}>
              <Icon name={step === 'date' ? 'close' : 'chevron-back'} size={24} color={theme.text} />
            </Pressable>
            <Box style={{ flex: 1, alignItems: 'center' }}>
              <Text role="titleMd" style={styles.title}>
                {step === 'date' ? 'اختيار التاريخ' : 'اختيار الوقت'}
              </Text>
            </Box>
            <View style={{ width: 40 }} />
          </Box>

          <View style={styles.content}>
            {/* Step 1: Calendar */}
            <Animated.View style={[styles.stepContainer, { transform: [{ translateX: translateXDate }], opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
              <Box padding={4} layoutDirection="row" style={styles.calendarHeader}>
                <Pressable onPress={() => changeMonth(-1)} style={styles.monthNav}>
                  <Icon name="chevron-back" size={20} color={theme.brand} />
                </Pressable>
                <Text role="bodyStrong" style={styles.monthTitle}>
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </Text>
                <Pressable onPress={() => changeMonth(1)} style={styles.monthNav}>
                  <Icon name="chevron-forward" size={20} color={theme.brand} />
                </Pressable>
              </Box>

              <View style={styles.weekDays}>
                {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((day) => (
                  <View key={day} style={styles.dayCell}>
                    <Text role="caption" style={styles.weekDayText}>{day}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {monthDays.map((date, index) => (
                  <Pressable
                    key={index}
                    onPress={() => date && setSelectedDate(date)}
                    style={[
                      styles.dayCell,
                      date && isToday(date) && styles.todayCell,
                      date && isSelected(date) && styles.selectedCell,
                    ]}
                  >
                    {date && (
                      <Text
                        role="bodyMd"
                        style={[
                          styles.dayText,
                          isToday(date) && { color: theme.brand },
                          isSelected(date) && { color: colorPalette.white },
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            {/* Step 2: Time Picker */}
            <Animated.View style={[styles.stepContainer, styles.timeStep, { transform: [{ translateX: translateXTime }], opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}>
              <Box gap={6} style={{ alignItems: 'center', width: '100%' }}>
                <View style={styles.timeDisplay}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeValue}>{String(displayHour).padStart(2, '0')}</Text>
                    <Text style={styles.timeLabel}>ساعة</Text>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeValue}>{String(selectedMinute).padStart(2, '0')}</Text>
                    <Text style={styles.timeLabel}>دقيقة</Text>
                  </View>
                </View>

                <Box layoutDirection="row" gap={2} style={styles.periodPicker}>
                  <Pressable
                    onPress={() => setPeriod('AM')}
                    style={[styles.periodButton, period === 'AM' && styles.periodButtonActive]}
                  >
                    <Text style={[styles.periodText, period === 'AM' && styles.periodTextActive]}>صباحاً</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setPeriod('PM')}
                    style={[styles.periodButton, period === 'PM' && styles.periodButtonActive]}
                  >
                    <Text style={[styles.periodText, period === 'PM' && styles.periodTextActive]}>مساءً</Text>
                  </Pressable>
                </Box>

                <View style={styles.wheelsContainer}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.wheel}
                    contentContainerStyle={styles.wheelContent}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <Pressable key={h} onPress={() => setDisplayHour(h)} style={[styles.wheelItem, displayHour === h && styles.wheelItemActive]}>
                        <Text style={[styles.wheelText, displayHour === h && styles.wheelTextActive]}>{h}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.wheel}
                    contentContainerStyle={styles.wheelContent}
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                      <Pressable key={m} onPress={() => setSelectedMinute(m)} style={[styles.wheelItem, selectedMinute === m && styles.wheelItemActive]}>
                        <Text style={[styles.wheelText, selectedMinute === m && styles.wheelTextActive]}>{String(m).padStart(2, '0')}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </Box>
            </Animated.View>
          </View>

          {/* Footer */}
          <Box padding={4} style={styles.footer}>
            <Button
              label={step === 'date' ? 'التالي: اختيار الوقت' : 'تأكيد الموعد'}
              onPress={handleNext}
              fullWidth
              style={styles.confirmButton}
            />
          </Box>
        </Surface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: withAlpha(colorPalette.black, 0.5),
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colorPalette.white,
    overflow: 'hidden',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderSubtle,
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    color: colorPalette.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colorPalette.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    height: 380,
    position: 'relative',
  },
  stepContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing[4],
  },
  calendarHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  monthNav: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colorPalette.brandSoft,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colorPalette.textPrimary,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  weekDayText: {
    fontWeight: '700',
    color: colorPalette.textMuted,
  },
  dayText: {
    fontWeight: '700',
    color: colorPalette.textPrimary,
  },
  todayCell: {
    backgroundColor: colorPalette.brandSoft,
  },
  selectedCell: {
    backgroundColor: colorPalette.accentOrange,
  },
  timeStep: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBox: {
    alignItems: 'center',
    backgroundColor: colorPalette.brandSoft,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 80,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colorPalette.accentOrange,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colorPalette.textMuted,
    marginTop: -4,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: '900',
    color: colorPalette.textMuted,
  },
  periodPicker: {
    backgroundColor: colorPalette.surfaceSecondary,
    borderRadius: 14,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: colorPalette.white,
    shadowColor: colorPalette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '700',
    color: colorPalette.textMuted,
  },
  periodTextActive: {
    color: colorPalette.accentOrange,
  },
  wheelsContainer: {
    flexDirection: 'row',
    height: 120,
    gap: 20,
  },
  wheel: {
    width: 60,
  },
  wheelContent: {
    paddingVertical: 40,
  },
  wheelItem: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemActive: {
    backgroundColor: colorPalette.brandSoft,
    borderRadius: 10,
  },
  wheelText: {
    fontSize: 18,
    fontWeight: '700',
    color: colorPalette.textMuted,
  },
  wheelTextActive: {
    color: colorPalette.accentOrange,
    fontSize: 22,
    fontWeight: '900',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colorPalette.borderSubtle,
  },
  confirmButton: {
    backgroundColor: colorPalette.accentOrange,
    borderColor: colorPalette.accentOrange,
    height: 54,
    borderRadius: 16,
  },
});
