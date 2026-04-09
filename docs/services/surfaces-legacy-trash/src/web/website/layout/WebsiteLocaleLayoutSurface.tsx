/**
 * Website Locale Layout Surface
 *
 * Architecture Rule: §86 SSoT - Screen logic in packages/surfaces only
 * Direction from shared boot-level direction contract in ui-kit.
 */

import type { ReactNode } from 'react';
import { getBootDirection } from '@bthwani/ui-kit';

export interface WebsiteLocaleLayoutSurfaceProps {
  children: ReactNode;
  locale: string;
  navigation?: ReactNode;
  footer?: ReactNode;
}

export function WebsiteLocaleLayoutSurface({
  children,
  locale,
  navigation,
  footer,
}: WebsiteLocaleLayoutSurfaceProps) {
  return (
    <html lang={locale} dir={getBootDirection(locale)}>
      <body>
        {navigation}
        <main>{children}</main>
        {footer}
      </body>
    </html>
  );
}
