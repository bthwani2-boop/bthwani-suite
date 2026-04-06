import React from 'react';
import { ScrollView, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthScreenHeader, BthSectionHeader } from '../../components';
import { BthSurface } from '../../primitives';

export type BthDetailScreenShellProps = {
  title: string;
  subtitle?: string;
  sections: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>;
};

export function BthDetailScreenShell({ title, subtitle, sections }: BthDetailScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <BthScreenHeader title={title} subtitle={subtitle} />
      {sections.map((section, index) => (
        <BthSurface key={`${section.title}-${index}`}>
          <BthSectionHeader title={section.title} subtitle={section.subtitle} />
          <View>{section.content}</View>
        </BthSurface>
      ))}
    </ScrollView>
  );
}
