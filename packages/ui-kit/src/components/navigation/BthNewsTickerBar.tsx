import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
};

export function BthNewsTickerBar({ statusLabel, message, onPress }: BthNewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const tickerScrollRef = React.useRef<ScrollView>(null);
  const tickerContentWidthRef = React.useRef(0);
  const tickerOffsetRef = React.useRef(0);
  const tickerViewportWidthRef = React.useRef(0);
  const tickerGap = 80;
  const sanitizedMessage = message.trim();
  const barDirection = direction === 'rtl' ? 'row' : 'row-reverse';

  React.useEffect(() => {
    tickerOffsetRef.current = 0;
    tickerScrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [sanitizedMessage]);

  React.useEffect(() => {
    if (!sanitizedMessage) {
      return;
    }

    const interval = setInterval(() => {
      const totalWidth = tickerContentWidthRef.current;
      const viewportWidth = tickerViewportWidthRef.current;

      if (totalWidth <= 0 || viewportWidth <= 0 || totalWidth <= viewportWidth) {
        return;
      }

      const segmentWidth = (totalWidth - tickerGap) / 2;
      const resetAt = segmentWidth + tickerGap;

      if (tickerOffsetRef.current <= 0) {
        tickerOffsetRef.current = resetAt;
      }

      tickerOffsetRef.current -= 1;

      if (tickerOffsetRef.current <= 0) {
        tickerOffsetRef.current = resetAt;
      }

      tickerScrollRef.current?.scrollTo({ x: tickerOffsetRef.current, animated: false });
    }, 50);

    return () => clearInterval(interval);
  }, [sanitizedMessage]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${statusLabel}: ${sanitizedMessage}`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 30,
        borderRadius: 15,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.16)',
        paddingHorizontal: spacing[1],
        paddingVertical: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View
        style={{
          flexDirection: barDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[2],
        }}
      >
        <View
          style={{
            minWidth: 70,
            borderRadius: 12,
            backgroundColor: theme.info,
            paddingHorizontal: spacing[2],
            paddingVertical: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BthText role="caption" tone="inverse">{statusLabel}</BthText>
        </View>

          <ScrollView
            ref={tickerScrollRef}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            style={{ flex: 1, minWidth: 0 }}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onLayout={(event) => {
              tickerViewportWidthRef.current = event.nativeEvent.layout.width;
            }}
            onContentSizeChange={(width) => {
              tickerContentWidthRef.current = width;
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 1,
              }}
            >
              <BthText role="bodySm" tone="inverse" numberOfLines={1} style={{ opacity: 0.95 }}>
                {sanitizedMessage}
              </BthText>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingStart: tickerGap,
                paddingVertical: 1,
              }}
            >
              <BthText role="bodySm" tone="inverse" numberOfLines={1} style={{ opacity: 0.95 }}>
                {sanitizedMessage}
              </BthText>
            </View>
          </ScrollView>
      </View>
    </Pressable>
  );
}
