import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CartConfirmationBlock,
  Icon,
  Text,
  colorPalette,
  shadowPresets,
} from '@bthwani/ui-kit';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import {
  formatCurrencyValue,
  normalizeDisplayText,
  resolveMeasurementUnitPrice,
} from '../shared/store-formatting';

// ---------------------------------------------------------------------------
// Appearance token subset passed from the Store screen shell.
// Matches the keys used by measurePopoverCard, overlay, and buttons.
// ---------------------------------------------------------------------------
export type StoreMeasurementAppearance = {
  overlaySoft: string;
  activeActionBackground: string;
  activeActionBorder: string;
  accent: string;
  modalSurface: string;
  modalBorder: string;
  primaryText: string;
  secondaryText: string;
  subtleSurface: string;
  /** theme.brandContrast — contrast text in dark glass mode */
  brandContrastColor: string;
  /** tokens.glassMutedText — price text in dark glass selected chip */
  glassMutedTextColor: string;
  isDarkGlass: boolean;
};

export type StoreMeasurementSheetProps = {
  pickerItem: DshStoreGetMenuItem | null;
  activeMeasurementOptions: readonly string[];
  selectedMeasureOption: string | null;
  setSelectedMeasureOption: (option: string | null) => void;
  selectedMeasureQty: number;
  setSelectedMeasureQty: React.Dispatch<React.SetStateAction<number>>;
  isAddedToCart: boolean;
  addedItemLabel: string;
  measurePopoverTop: number;
  appearance: StoreMeasurementAppearance;
  onClose: () => void;
  onAddToCart: () => void;
  onGoToCart: () => void;
  onContinueShopping: () => void;
};

/**
 * Measurement/quantity picker modal extracted from the Store screen shell.
 * No internal state — all state owned by the Store screen hooks/shell.
 * Isolated so measurement changes don't re-render the main menu FlatList.
 */
export const StoreMeasurementSheet = React.memo(function StoreMeasurementSheet({
  pickerItem,
  activeMeasurementOptions,
  selectedMeasureOption,
  setSelectedMeasureOption,
  selectedMeasureQty,
  setSelectedMeasureQty,
  isAddedToCart,
  addedItemLabel,
  measurePopoverTop,
  appearance,
  onClose,
  onAddToCart,
  onGoToCart,
  onContinueShopping,
}: StoreMeasurementSheetProps) {
  const {
    overlaySoft,
    activeActionBackground,
    activeActionBorder,
    accent,
    modalSurface,
    modalBorder,
    primaryText,
    secondaryText,
    subtleSurface,
    brandContrastColor,
    glassMutedTextColor,
    isDarkGlass,
  } = appearance;

  const selectedMeasureUnitPrice = React.useMemo(() => {
    if (!pickerItem || !selectedMeasureOption) return 0;
    return resolveMeasurementUnitPrice(pickerItem, selectedMeasureOption);
  }, [pickerItem, selectedMeasureOption]);

  const selectedMeasureTotalPrice = React.useMemo(
    () => selectedMeasureUnitPrice * selectedMeasureQty,
    [selectedMeasureQty, selectedMeasureUnitPrice],
  );

  return (
    <Modal
      visible={Boolean(pickerItem)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={[styles.measureOverlay, { backgroundColor: overlaySoft }]} onPress={onClose}>
        <View style={[styles.measurePopoverWrap, { top: measurePopoverTop }]} pointerEvents="box-none">
          <View style={styles.measurePopoverDock}>
            <View style={[styles.measureOriginBubble, { backgroundColor: activeActionBackground }]}>
              <Icon name="cart-outline" size={18} color={isDarkGlass ? brandContrastColor : colorPalette.white} />
              <View style={styles.measureOriginPlusBadge}>
                <Icon name="add" size={10} color={accent} />
              </View>
            </View>

            <Pressable
              style={[styles.measurePopoverCard, { backgroundColor: modalSurface, borderColor: modalBorder }]}
              onPress={(event) => event.stopPropagation()}
            >
              {pickerItem ? (
                <>
                  <View style={styles.measurePopoverHeader}>
                    <Text style={[styles.measureSheetTitle, { color: primaryText }]}>
                      {normalizeDisplayText(pickerItem.name)}
                    </Text>
                  </View>

                  {isAddedToCart ? (
                    <CartConfirmationBlock
                      title="تمت إضافة المنتج للسلة"
                      subtitle={
                        addedItemLabel
                          ? `${addedItemLabel}${selectedMeasureOption ? ` (${selectedMeasureOption})` : ''}`
                          : undefined
                      }
                      onGoToCart={onGoToCart}
                      onContinueShopping={onContinueShopping}
                      isDarkGlass={isDarkGlass}
                    />
                  ) : (
                    <>
                      <View style={styles.measureOptionsGrid}>
                        {activeMeasurementOptions.map((option) => {
                          const selected = selectedMeasureOption === option;
                          const optionPrice = formatCurrencyValue(
                            resolveMeasurementUnitPrice(pickerItem, option),
                          );
                          return (
                            <TouchableOpacity
                              key={option}
                              style={[
                                styles.measureOptionChip,
                                { backgroundColor: modalSurface, borderColor: modalBorder },
                                selected && styles.measureOptionChipActive,
                                selected
                                  ? { backgroundColor: activeActionBackground, borderColor: activeActionBorder }
                                  : null,
                              ]}
                              activeOpacity={0.88}
                              onPress={() => setSelectedMeasureOption(option)}
                            >
                              <Text
                                style={[
                                  styles.measureOptionText,
                                  { color: selected ? (isDarkGlass ? brandContrastColor : colorPalette.white) : primaryText },
                                  selected && styles.measureOptionTextActive,
                                ]}
                              >
                                {option}
                              </Text>
                              <Text
                                style={[
                                  styles.measureOptionPriceText,
                                  { color: selected ? (isDarkGlass ? glassMutedTextColor : colorPalette.brandSurface) : secondaryText },
                                  selected && styles.measureOptionPriceTextActive,
                                ]}
                              >
                                {optionPrice}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <View style={styles.measureQtyRow}>
                        <TouchableOpacity
                          style={[styles.measureQtyGhostButton, { backgroundColor: subtleSurface, borderColor: modalBorder }]}
                          activeOpacity={0.85}
                          onPress={() => setSelectedMeasureQty((current) => Math.max(1, current - 1))}
                        >
                          <Icon name="remove" size={18} color={secondaryText} />
                        </TouchableOpacity>

                        <View style={[styles.measureQtyValuePill, { backgroundColor: subtleSurface, borderColor: modalBorder }]}>
                          <Text style={[styles.measureQtyValueText, { color: primaryText }]}>
                            {selectedMeasureQty}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[styles.measureQtyPrimaryButton, { backgroundColor: activeActionBackground, borderColor: activeActionBorder }]}
                          activeOpacity={0.9}
                          onPress={() => setSelectedMeasureQty((current) => current + 1)}
                        >
                          <Icon name="add" size={18} color={isDarkGlass ? brandContrastColor : colorPalette.white} />
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.measureFooterBar, { borderColor: modalBorder }]}>
                        <View style={[styles.measurePriceValueBox, { backgroundColor: modalSurface }]}>
                          <Text style={[styles.measurePriceValueText, { color: primaryText }]}>
                            {formatCurrencyValue(selectedMeasureTotalPrice || selectedMeasureUnitPrice)}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[styles.measureConfirmButton, { backgroundColor: activeActionBackground }]}
                          activeOpacity={0.9}
                          onPress={onAddToCart}
                        >
                          <Text style={[styles.measureConfirmText, { color: isDarkGlass ? brandContrastColor : colorPalette.white }]}>
                            أضف للسلة
                          </Text>
                          <Icon name="cart-outline" size={16} color={isDarkGlass ? brandContrastColor : colorPalette.white} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </>
              ) : null}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  measureOverlay: {
    flex: 1,
  },
  measurePopoverWrap: {
    position: 'absolute',
    left: 10,
    right: 10,
  },
  measurePopoverDock: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  measureOriginBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colorPalette.brand,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: colorPalette.brandSurface,
  },
  measureOriginPlusBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colorPalette.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
  },
  measurePopoverCard: {
    flex: 1,
    maxWidth: 280,
    backgroundColor: colorPalette.white,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colorPalette.line,
    gap: 6,
    ...shadowPresets.raised,
  },
  measurePopoverHeader: {
    alignItems: 'flex-end',
    gap: 1,
  },
  measureSheetTitle: {
    color: colorPalette.ink,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
  },
  measureOptionsGrid: {
    flexDirection: 'row-reverse',
    gap: 4,
    justifyContent: 'space-between',
  },
  measureOptionChip: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colorPalette.white,
    borderWidth: 1,
    borderColor: colorPalette.line,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  measureOptionChipActive: {
    backgroundColor: colorPalette.brand,
    borderColor: colorPalette.brandStrong,
  },
  measureOptionText: {
    color: colorPalette.ink,
    fontSize: 12,
    fontWeight: '800',
  },
  measureOptionTextActive: {
    color: colorPalette.white,
  },
  measureOptionPriceText: {
    color: colorPalette.inkMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  measureOptionPriceTextActive: {
    color: colorPalette.brandSurface,
  },
  measureQtyRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  measureQtyGhostButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colorPalette.surfaceAlt,
    borderWidth: 1,
    borderColor: colorPalette.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureQtyPrimaryButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colorPalette.brand,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colorPalette.brand,
  },
  measureQtyValuePill: {
    minWidth: 56,
    height: 38,
    borderRadius: 16,
    backgroundColor: colorPalette.brandSoft,
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  measureQtyValueText: {
    color: colorPalette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  measureFooterBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorPalette.line,
    marginTop: 4,
  },
  measurePriceValueBox: {
    minWidth: 72,
    backgroundColor: colorPalette.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  measurePriceValueText: {
    color: colorPalette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  measureConfirmButton: {
    flex: 1,
    backgroundColor: colorPalette.brand,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  measureConfirmText: {
    color: colorPalette.white,
    fontSize: 13.5,
    fontWeight: '900',
  },
});
