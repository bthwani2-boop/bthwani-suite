import React, { useState } from 'react';
import { Box, Button, Surface, Text, SearchField, useTheme } from '@bthwani/ui-kit';

export type FilterDropdownProps = {
  titleText: string;
  options: readonly string[];
  selected: readonly string[];
  onChange: (nextValues: string[]) => void;
  onClose: () => void;
};

export const FilterDropdown = ({ titleText, options, selected, onChange, onClose }: FilterDropdownProps) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()));

  return (
    <Surface tone="raised" padding={2} gap={2} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, width: 200, marginTop: 4 }}>
      <Box padding={1} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
        <SearchField
          placeholder={`بحث في ${titleText}...`}
          value={search}
          onChangeText={setSearch}
        />
      </Box>
      <Box style={{ maxHeight: 150 }}>
        {filteredOptions.length === 0 ? (
           <Box padding={2} align="center">
             <Text role="caption" tone="muted">لا توجد نتائج</Text>
           </Box>
        ) : filteredOptions.map((opt) => (
          <Box key={opt} layoutDirection="row" align="center" gap={2} paddingY={1}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, opt]);
                else onChange(selected.filter((selectedOption) => selectedOption !== opt));
              }}
              style={{ accentColor: theme.brandHeaderBackground }}
            />
            <Text role="caption" style={{ flex: 1, textAlign: 'right' }}>{opt}</Text>
          </Box>
        ))}
      </Box>
      <Box layoutDirection="row" justify="space-between" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8 }}>
         <Button label="تطبيق" tone="brand" size="sm" onPress={onClose} />
         <Button label="مسح" tone="secondary" size="sm" onPress={() => { onChange([]); onClose(); }} />
      </Box>
    </Surface>
  );
};
