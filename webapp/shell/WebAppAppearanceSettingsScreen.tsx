'use client';

import React from 'react';
import { AppearanceOptionCard } from '@bthwani/ui-kit';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import styles from './shared-web-shell.module.css';
import { useWebAppAppearance } from './appearance';

const appearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'فاتح أبيض',
    description: 'واجهة فاتحة واضحة، والزجاج يظهر فقط فيما يحدده المطور أثناء مراجعة الشاشات',
  },
  {
    mode: 'darkGlass',
    title: 'داكن زجاجي',
    description: 'مظهر داكن فاخر مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري',
  },
] as const;

export function WebAppAppearanceSettingsScreen() {
  const { hydrated, mode, setMode } = useWebAppAppearance();

  return (
    <WebPageFrame
      eyebrow="BThwani WebApp Settings"
      title="المظهر"
      description="إعداد ضيق ومباشر للمظهر بدون إنشاء نظام حساب إضافي."
      centered
      maxWidth={920}
    >
      <WebSectionCard
        title="اختيار المظهر"
        description={hydrated ? 'يتم حفظ الاختيار محليًا واستعادته عند كل زيارة.' : 'جارٍ استعادة اختيار المظهر المحفوظ...'}
      >
        <div className={styles.stack}>
          {appearanceOptions.map((option) => (
            <AppearanceOptionCard
              key={option.mode}
              title={option.title}
              description={option.description}
              mode={option.mode}
              modeLabel={option.mode === 'lightPremium' ? 'Light Premium' : 'Dark Glass'}
              statusLabel={mode === option.mode ? 'مفعّل الآن' : 'اختيار جاهز'}
              selected={mode === option.mode}
              onPress={() => setMode(option.mode)}
            />
          ))}
        </div>
      </WebSectionCard>
    </WebPageFrame>
  );
}

export default WebAppAppearanceSettingsScreen;
