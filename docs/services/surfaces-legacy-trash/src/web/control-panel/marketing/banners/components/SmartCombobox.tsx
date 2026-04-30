'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { ChevronDown } from 'lucide-react';

export type SmartComboboxOption = { id: string; label: string } | string;

interface SmartComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: SmartComboboxOption[];
  placeholder?: string;
  /** ترجمة "اكتب للبحث" */
  searchPlaceholder?: string;
  /** أقصى اقتراحات في القائمة */
  maxSuggestions?: number;
  /** تحويل الخيار إلى نص للعرض (إن كان كائناً) */
  getOptionLabel?: (opt: SmartComboboxOption) => string;
  /** تحويل الخيار إلى قيمة (إن كان كائناً) */
  getOptionValue?: (opt: SmartComboboxOption) => string;
  id?: string;
  'aria-label'?: string;
}

function normalizeOption(opt: SmartComboboxOption): { id: string; label: string } {
  if (typeof opt === 'string') return { id: opt, label: opt };
  return { id: opt.id, label: opt.label };
}

export function SmartCombobox({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  maxSuggestions = 10,
  getOptionLabel,
  getOptionValue,
  id,
  'aria-label': ariaLabel,
}: SmartComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => setQuery(value), [value]);
  const listRef = useRef<HTMLUListElement>(null);

  const normalized = useMemo(
    () => options.map((o) => (typeof o === 'string' ? { id: o, label: o } : { id: o.id, label: o.label })),
    [options]
  );

  const filtered = useMemo(() => {
    const q = (query ?? '').trim().toLowerCase();
    if (!q) return normalized.slice(0, maxSuggestions);
    return normalized
      .filter((o) => o.label.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
      .slice(0, maxSuggestions);
  }, [normalized, query, maxSuggestions]);

  const handleSelect = useCallback(
    (item: { id: string; label: string }) => {
      const val = getOptionValue ? getOptionValue(item as SmartComboboxOption) : item.label;
      onChange(val);
      setQuery(val);
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange, getOptionValue]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setQuery(v);
      onChange(v);
      setOpen(true);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setOpen(true);
    setQuery(value);
  }, [value]);

  const handleBlur = useCallback(() => {
    setTimeout(() => setOpen(false), 180);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    []
  );

  return (
    <div className="relative w-full">
      <div
        className="flex items-center rounded-lg border"
        style={{
          borderColor: semanticRoles.border,
          backgroundColor: semanticRoles.surface,
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={open ? 'smart-combobox-list' : undefined}
          className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm outline-none focus:ring-0"
          style={{
            color: semanticRoles.text,
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          className="p-2"
          style={{ color: semanticRoles.textSecondary }}
          aria-hidden
          onClick={() => inputRef.current?.focus()}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          id="smart-combobox-list"
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-lg border shadow-lg"
          style={{
            borderColor: semanticRoles.border,
            backgroundColor: semanticRoles.surface,
          }}
        >
          {filtered.map((item) => (
            <li
              key={item.id}
              role="option"
              className="cursor-pointer px-3 py-2 text-sm hover:bg-black/5"
              style={{
                color: semanticRoles.text,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(item);
              }}
            >
              {getOptionLabel ? getOptionLabel(item as SmartComboboxOption) : item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
