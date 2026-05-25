import * as React from 'react';
import { useDebounce } from './useDebounce';

export function useStoreInlineSearch({
  headerSearchVisible,
  setHeaderSearchVisible,
  headerSearchQuery,
  setHeaderSearchQuery,
}: any) {
  const debouncedInlineSearchQuery = useDebounce(headerSearchQuery, 250);

  const openInlineSearch = React.useCallback(() => {
    setHeaderSearchVisible(true);
  }, [setHeaderSearchVisible]);

  const closeInlineSearch = React.useCallback(() => {
    setHeaderSearchVisible(false);
    setHeaderSearchQuery('');
  }, [setHeaderSearchQuery, setHeaderSearchVisible]);

  return {
    debouncedInlineSearchQuery,
    openInlineSearch,
    closeInlineSearch,
  };
}
