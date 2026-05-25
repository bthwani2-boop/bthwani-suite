import * as React from 'react';

export function useStoreMeasurementState({
  setPickerItem,
  setSelectedMeasureOption,
  setSelectedMeasureQty,
  setPickerAnchor,
  setIsAddedToCart,
  setAddedItemLabel,
  onAddItemToCart,
  onOpenCart,
  pickerItem,
  selectedMeasureOption,
  selectedMeasureQty,
  selectedMode,
  resolveMeasurementOptions,
}: any) {
  const openMeasurementPicker = React.useCallback((item: any, anchor?: any) => {
    const options = resolveMeasurementOptions(item);
    setPickerItem(item);
    setSelectedMeasureOption(options[0] ?? null);
    setSelectedMeasureQty(1);
    setIsAddedToCart(false);
    if (anchor?.nativeEvent) {
      setPickerAnchor({
        x: anchor.nativeEvent.pageX,
        y: anchor.nativeEvent.pageY,
      });
    } else if (anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) {
      setPickerAnchor(anchor);
    } else {
      setPickerAnchor({ x: 32, y: 360 });
    }
  }, [resolveMeasurementOptions, setIsAddedToCart, setPickerAnchor, setPickerItem, setSelectedMeasureOption, setSelectedMeasureQty]);

  const closeMeasurementPicker = React.useCallback(() => {
    setPickerItem(null);
    setTimeout(() => {
      setSelectedMeasureOption(null);
      setSelectedMeasureQty(1);
      setIsAddedToCart(false);
    }, 300);
  }, [setPickerItem, setSelectedMeasureOption, setSelectedMeasureQty, setIsAddedToCart]);

  const handleAddToCart = React.useCallback(() => {
    if (!pickerItem || pickerItem.isAvailable === false) return;
    onAddItemToCart?.(pickerItem, {
      quantity: Number.isFinite(selectedMeasureQty) && selectedMeasureQty > 0 ? selectedMeasureQty : 1,
      measurementOption: selectedMeasureOption,
      deliveryMode: selectedMode,
    });
    setAddedItemLabel(pickerItem.name);
    setIsAddedToCart(true);
  }, [onAddItemToCart, pickerItem, selectedMeasureOption, selectedMeasureQty, selectedMode, setAddedItemLabel, setIsAddedToCart]);

  const handleGoToCart = React.useCallback(() => {
    setIsAddedToCart(false);
    closeMeasurementPicker();
    onOpenCart?.(selectedMode);
  }, [closeMeasurementPicker, onOpenCart, selectedMode, setIsAddedToCart]);

  const handleContinueShopping = React.useCallback(() => {
    setIsAddedToCart(false);
    closeMeasurementPicker();
  }, [closeMeasurementPicker, setIsAddedToCart]);

  return {
    openMeasurementPicker,
    closeMeasurementPicker,
    handleAddToCart,
    handleGoToCart,
    handleContinueShopping,
  };
}
