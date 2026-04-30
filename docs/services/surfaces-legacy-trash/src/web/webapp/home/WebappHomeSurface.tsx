/**
 * Webapp Home Surface
 * 
 * Architecture Rule: §86 SSoT - Screen logic in packages/surfaces only
 * This surface is used by apps/web/webapp/app/page.tsx as a thin wrapper
 */

import React from 'react';
import { useI18n } from '@bthwani/ui-kit';

export function WebappHomeSurface() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="text-sm opacity-90">
          {t('web.webapp.home.WebappHomeSurface.placeholder')}
        </p>
      </div>
      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold">Welcome to BTH Web Application</h1>
      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            User Surface{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Main user interface for BTH platform.
          </p>
        </div>
      </div>
    </main>
  );
}
