import React from 'react';

interface PreferenceScreenLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PreferenceScreenLayout: React.FC<PreferenceScreenLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {(title || subtitle) && (
        <header className="space-y-2">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </div>
  );
};

interface PreferenceSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="space-y-4">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </section>
  );
};

interface PreferenceCardProps {
  children: React.ReactNode;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-5 py-4">
      {children}
    </div>
  );
};

interface PreferenceRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailingSlot?: React.ReactNode;
}

export const PreferenceRow: React.FC<PreferenceRowProps> = ({
  title,
  subtitle,
  trailingSlot,
}) => {
  return (
    <div className="flex items-center justify-between min-h-[68px] gap-4">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-sm font-medium text-gray-900 truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-600 line-clamp-2">
            {subtitle}
          </div>
        )}
      </div>
      {trailingSlot && (
        <div className="min-w-[56px] flex items-center justify-end">
          {trailingSlot}
        </div>
      )}
    </div>
  );
};

