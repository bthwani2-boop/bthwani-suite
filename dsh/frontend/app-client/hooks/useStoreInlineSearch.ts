import * as React from 'react';
import { useDebounce } from './useDebounce';

type UseStoreInlineSearchOptions = {
  headerSearchVisible: boolean;
  setHeaderSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  headerSearchQuery: string;
  setHeaderSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export function useStoreInlineSearch({
  setHeaderSearchVisible,
  headerSearchQuery,
  setHeaderSearchQuery,
}: UseStoreInlineSearchOptions) {
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
