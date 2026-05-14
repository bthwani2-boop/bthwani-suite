'use client';

import React from 'react';
import { AppearanceOptionCard } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import { useControlPanelAppearance } from './appearance';
import styles from './control-panel-shell.module.css';

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

export function ControlPanelAppearanceScreen() {
  const { hydrated, mode, setMode } = useControlPanelAppearance();

  return (
    <WebPageFrame
      eyebrow="Control Panel Settings"
      title="المظهر"
      description="اختيار موحد للوحة التحكم مع حفظ محلي وتطبيق فوري على السطح الحالي."
      centered={false}
      maxWidth={960}
    >
      <WebSectionCard
        title="التهيئة الحالية"
        description={hydrated ? 'يتم حفظ الاختيار محليًا واستعادته عند فتح لوحة التحكم.' : 'جارٍ استعادة اختيار المظهر المحفوظ...'}
      >
        <div className={styles.appearanceStack}>
          {appearanceOptions.map((option) => (
            <AppearanceOptionCard
              key={option.mode}
              title={option.title}
              description={option.description}
              mode={option.mode}
              modeLabel={option.mode === 'lightPremium' ? 'Light Premium' : 'Dark Glass'}
              statusLabel={mode === option.mode ? 'مفعّل الآن' : 'اضغط للتفعيل'}
              selected={mode === option.mode}
              onPress={() => setMode(option.mode)}
            />
          ))}
        </div>
      </WebSectionCard>
    </WebPageFrame>
  );
}

export default ControlPanelAppearanceScreen;
