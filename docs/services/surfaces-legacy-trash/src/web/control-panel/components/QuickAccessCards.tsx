'use client';

import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit/i18n';
import { LucideIcon, ArrowUpRight, LayoutGrid } from 'lucide-react';

export interface QuickAccessCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

const cardColors = [
  { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50' },
  { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50' },
  { bg: 'from-blue-500 to-cyan-600', light: 'bg-blue-50' },
];

function Card({ item, index }: { item: QuickAccessCardProps; index: number }) {
  const Icon = item.icon;
  const color = cardColors[index % cardColors.length];

  return (
    <Link
      href={item.href}
      className="group relative rounded-2xl bg-white border border-gray-100 p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50"
    >
      <div className={`
        w-12 h-12 rounded-xl bg-gradient-to-br ${color.bg}
        flex items-center justify-center mb-5
        transition-transform group-hover:scale-110 group-hover:rotate-3
      `}>
        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>

      <h4 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>

      <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}

export interface QuickAccessCardsProps {
  items: QuickAccessCardProps[];
  title?: string;
}

export const QuickAccessCards = ({ items, title }: QuickAccessCardsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title || t('control panel.quick_access.title')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.slice(0, 3).map((item, i) => (
          <Card key={item.href} item={item} index={i} />
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCards;

