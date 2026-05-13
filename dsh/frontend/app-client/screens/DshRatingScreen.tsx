import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, TextInput } from 'react-native';

import {
  Box,
  Icon,
  Surface,
  Text,
  TopBar,
  colorPalette,
  spacing,
  useDirection,
  useTheme,
  StateView,
} from '@bthwani/ui-kit';

export type DshRatingScreenProps = {
  state?: 'ready' | 'loading' | 'success' | 'error' | 'cancelled';
  orderId?: string;
  storeName?: string;
  onBack?: () => void;
  onSubmit?: (rating: number, comment: string) => void;
  onSkip?: () => void;
  onRetry?: () => void;
};

export function DshRatingScreen({
  state = 'ready',
  orderId = 'ORD-12345',
  storeName = 'متجر التجربة السعيدة',
  onBack,
  onSubmit,
  onSkip,
  onRetry,
}: DshRatingScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const { theme } = useTheme();
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating > 0 && onSubmit) {
      onSubmit(rating, comment);
    }
  };

  if (state === 'loading') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تقييم الطلب" onBack={onBack} />
        <StateView stateId="loading" title="جاري الإرسال..." description="نحن نقدر رأيك، يرجى الانتظار قليلاً." />
      </Surface>
    );
  }

  if (state === 'success') {
    return (
      <Surface style={styles.root}>
        <TopBar title="شكراً لك" onBack={onBack} />
        <StateView
          stateId="success"
          title="تم استلام تقييمك بنجاح"
          description="شكراً لمشاركتنا تجربتك، تساعدنا ملاحظاتك في تحسين الخدمة."
          actionLabel="العودة للرئيسية"
          onActionPress={onBack}
        />
      </Surface>
    );
  }

  if (state === 'error') {
    return (
      <Surface style={styles.root}>
        <TopBar title="خطأ في الإرسال" onBack={onBack} />
        <StateView
          stateId="recoverableError"
          title="تعذر إرسال التقييم"
          description="حدث خطأ أثناء محاولة حفظ تقييمك. يرجى المحاولة مرة أخرى."
          actionLabel="إعادة المحاولة"
          onActionPress={onRetry}
        />
      </Surface>
    );
  }

  return (
    <Surface style={styles.root}>
      <TopBar 
        title="تقييم التجربة" 
        onBack={onBack}
        rightAction={onSkip ? { icon: 'close-outline', onPress: onSkip } : undefined}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Box padding={spacing[4]} alignItems="center">
          <View style={styles.headerIcon}>
            <Ionicons name="star" size={48} color={colorPalette.orange} />
          </View>
          <Text role="titleLg" style={styles.title}>كيف كانت تجربتك مع {storeName}؟</Text>
          <Text role="bodyMd" style={styles.subtitle}>رأيك يساعدنا في تحسين جودة الخدمة المقدمة لك.</Text>
        </Box>

        <Box paddingHorizontal={spacing[4]} paddingVertical={spacing[6]} alignItems="center">
          <View style={[styles.starsContainer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Pressable key={item} onPress={() => handleRatingPress(item)} style={styles.starPressable}>
                <Ionicons
                  name={rating >= item ? 'star' : 'star-outline'}
                  size={40}
                  color={rating >= item ? colorPalette.orange : colorPalette.deepBlueLighter}
                />
              </Pressable>
            ))}
          </View>
          <Text role="titleMd" style={styles.ratingLabel}>
            {rating === 1 ? 'ضعيف جداً' : 
             rating === 2 ? 'ضعيف' : 
             rating === 3 ? 'مقبول' : 
             rating === 4 ? 'جيد' : 
             rating === 5 ? 'ممتاز' : 'اضغط للتقييم'}
          </Text>
        </Box>

        <Box padding={spacing[4]}>
          <Text role="bodyMd" style={styles.inputLabel}>هل لديك أي ملاحظات إضافية؟ (اختياري)</Text>
          <TextInput
            style={[styles.commentInput, { textAlign: isRtl ? 'right' : 'left' }]}
            placeholder="اكتب تعليقك هنا..."
            placeholderTextColor={colorPalette.deepBlueLighter}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </Box>

        <Box padding={spacing[4]} marginTop={spacing[4]}>
          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: rating > 0 ? colorPalette.deepBlue : colorPalette.deepBlueLighter },
            ]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text role="titleMd" style={styles.submitButtonText}>إرسال التقييم</Text>
          </Pressable>
          
          <Pressable style={styles.skipButton} onPress={onSkip}>
            <Text role="bodyMd" style={styles.skipButtonText}>تخطي الآن</Text>
          </Pressable>
        </Box>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colorPalette.white,
  },
  content: {
    paddingBottom: spacing[8],
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colorPalette.orangeSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: {
    color: colorPalette.deepBlue,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    color: colorPalette.deepBlueLighter,
    textAlign: 'center',
  },
  starsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  starPressable: {
    padding: spacing[2],
  },
  ratingLabel: {
    color: colorPalette.deepBlue,
    marginTop: spacing[2],
  },
  inputLabel: {
    color: colorPalette.deepBlue,
    marginBottom: spacing[2],
  },
  commentInput: {
    backgroundColor: colorPalette.lightSurface,
    borderRadius: 12,
    padding: spacing[4],
    height: 120,
    color: colorPalette.deepBlue,
    borderWidth: 1,
    borderColor: colorPalette.line,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colorPalette.deepBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: colorPalette.white,
  },
  skipButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  skipButtonText: {
    color: colorPalette.deepBlueLighter,
  },
});
