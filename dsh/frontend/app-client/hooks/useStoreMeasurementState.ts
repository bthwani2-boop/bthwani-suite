import * as React from 'react';
import type { DshStoreFixtureItem } from '../../shared/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';

type MeasurementPickerAnchor = {
  nativeEvent?: { pageX: number; pageY: number };
  x?: number;
  y?: number;
};

type UseStoreMeasurementStateOptions = {
  setPickerItem: React.Dispatch<React.SetStateAction<DshStoreFixtureItem | null>>;
  setSelectedMeasureOption: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedMeasureQty: React.Dispatch<React.SetStateAction<number>>;
  setPickerAnchor: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setIsAddedToCart: React.Dispatch<React.SetStateAction<boolean>>;
  setAddedItemLabel: React.Dispatch<React.SetStateAction<string>>;
  onAddItemToCart?: (item: DshStoreFixtureItem, payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string }) => void;
  onOpenCart?: (mode?: DshFulfillmentDeliveryMode) => void;
  pickerItem: DshStoreFixtureItem | null;
  selectedMeasureOption: string | null;
  selectedMeasureQty: number;
  selectedMode: DshFulfillmentDeliveryMode;
  resolveMeasurementOptions: (item: DshStoreFixtureItem) => readonly string[];
};

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
}: UseStoreMeasurementStateOptions) {
  const openMeasurementPicker = React.useCallback((item: DshStoreFixtureItem, anchor?: MeasurementPickerAnchor) => {
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
      setPickerAnchor({ x: anchor.x as number, y: anchor.y as number });
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
