import * as React from 'react';
import type { DshHomeCategory } from '../discovery/dsh-home-types';

type UseHomeBackHandlerParams = {
  categoriesSheetVisible: boolean;
  shortsVisible: boolean;
  inlineSearchVisible: boolean;
  serviceDialVisible: boolean;
  activeCategoryId: string;
  categoryItems: DshHomeCategory[];
  sheinInlineVisible: boolean;
  awnakInlineVisible: boolean;
  selectCategoryPage: (categoryId: string) => void;
  setCategoriesSheetVisible: (visible: boolean) => void;
  setInlineSearchQuery: (query: string) => void;
  setInlineSearchVisible: (visible: boolean) => void;
  setServiceDialVisible: (visible: boolean) => void;
  setShortsVisible: (visible: boolean) => void;
  onRegisterBackHandler?: (handler: (() => boolean) | null) => void;
};

/**
 * Encapsulates home screen back-button logic and registration.
 * Called from DshHomeGetScreen; receives all needed state/setters as params
 * to avoid duplicate useHomeState instantiation.
 */
export function useHomeBackHandler({
  categoriesSheetVisible,
  shortsVisible,
  inlineSearchVisible,
  serviceDialVisible,
  activeCategoryId,
  categoryItems,
  sheinInlineVisible,
  awnakInlineVisible,
  selectCategoryPage,
  setCategoriesSheetVisible,
  setInlineSearchQuery,
  setInlineSearchVisible,
  setServiceDialVisible,
  setShortsVisible,
  onRegisterBackHandler,
}: UseHomeBackHandlerParams): void {
  const homeBackHandler = React.useCallback(() => {
    if (categoriesSheetVisible) { setCategoriesSheetVisible(false); return true; }
    if (shortsVisible) { setShortsVisible(false); return true; }
    if (inlineSearchVisible) { setInlineSearchVisible(false); setInlineSearchQuery(''); return true; }
    if (serviceDialVisible) { setServiceDialVisible(false); return true; }
    if (activeCategoryId !== 'all') {
      const matched = categoryItems.find((c) => c.id === activeCategoryId);
      if (matched?.renderMode === 'manual-order') {
        const formShowing =
          (activeCategoryId === 'shein' && sheinInlineVisible) ||
          (activeCategoryId === 'awnak' && awnakInlineVisible);
        if (!formShowing) { selectCategoryPage('all'); return true; }
      }
    }
    return false;
  }, [
    categoriesSheetVisible,
    shortsVisible,
    inlineSearchVisible,
    serviceDialVisible,
    activeCategoryId,
    categoryItems,
    sheinInlineVisible,
    awnakInlineVisible,
    selectCategoryPage,
    setCategoriesSheetVisible,
    setInlineSearchQuery,
    setInlineSearchVisible,
    setServiceDialVisible,
    setShortsVisible,
  ]);

  React.useEffect(() => {
    onRegisterBackHandler?.(homeBackHandler);
    return () => { onRegisterBackHandler?.(null); };
  }, [onRegisterBackHandler, homeBackHandler]);
}
