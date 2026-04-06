import React from 'react';
import { ScrollView, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthScreenHeader, BthSectionHeader } from '../../components';

export type DashboardSection = {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
};

export type BthDashboardShellProps = {
  title: string;
  subtitle?: string;
  hero?: React.ReactNode;
  sections?: DashboardSection[];
};

export function BthDashboardShell({ title, subtitle, hero, sections = [] }: BthDashboardShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <BthScreenHeader title={title} subtitle={subtitle} />
      {hero ? <View>{hero}</View> : null}
      {sections.map((section, index) => (
        <View key={`${section.title}-${index}`} style={{ gap: spacing[3] }}>
          <BthSectionHeader title={section.title} subtitle={section.subtitle} />
          <View>{section.content}</View>
        </View>
      ))}
    </ScrollView>
  );
}
