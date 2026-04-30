'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit/i18n';
import {
  Search,
  Command,
  ArrowRight,
  Package,
  DollarSign,
  Users,
  Truck,
  Shield,
  Headphones,
  TrendingUp,
  Settings,
  FileText,
  Zap,
  Clock,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DirectionalIcon from './DirectionalIcon';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  category: 'action' | 'navigation' | 'recent' | 'favorite';
  keywords?: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  customItems?: CommandItem[];
}

const CATEGORY_ORDER = ['action', 'favorite', 'recent', 'navigation'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  action: 'Quick Actions',
  favorite: 'Favorites',
  recent: 'Recent',
  navigation: 'Navigation',
};

export function CommandPalette({ isOpen, onClose, customItems }: CommandPaletteProps) {
  const { t, isRTL } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultItems: CommandItem[] = useMemo(() => [
    {
      id: 'approve-payouts',
      title: t('control panel.command.approve_payouts'),
      subtitle: t('control panel.command.approve_payouts_desc'),
      href: '/finance/payouts?status=pending',
      icon: DollarSign,
      category: 'action',
      keywords: ['approve', 'payout', 'finance', 'money', 'مالية', 'دفع'],
      shortcut: '⌘P',
    },
    {
      id: 'view-orders',
      title: t('control panel.command.view_orders'),
      subtitle: t('control panel.command.view_orders_desc'),
      href: '/operations/dsh/orders',
      icon: Package,
      category: 'action',
      keywords: ['orders', 'delivery', 'طلبات', 'توصيل'],
      shortcut: '⌘O',
    },
    {
      id: 'fleet-status',
      title: t('control panel.command.fleet_status'),
      subtitle: t('control panel.command.fleet_status_desc'),
      href: '/fleet/availability',
      icon: Truck,
      category: 'action',
      keywords: ['fleet', 'captain', 'availability', 'أسطول', 'كابتن'],
    },
    {
      id: 'support-tickets',
      title: t('control panel.command.support_tickets'),
      subtitle: t('control panel.command.support_tickets_desc'),
      href: '/support',
      icon: Headphones,
      category: 'action',
      keywords: ['support', 'ticket', 'help', 'دعم', 'تذاكر'],
    },
    {
      id: 'nav-operations',
      title: t('control panel.nav.operations'),
      href: '/operations',
      icon: Package,
      category: 'navigation',
      keywords: ['operations', 'عمليات'],
    },
    {
      id: 'nav-finance',
      title: t('control panel.nav.finance'),
      href: '/finance',
      icon: DollarSign,
      category: 'navigation',
      keywords: ['finance', 'مالية'],
    },
    {
      id: 'nav-fleet',
      title: t('control panel.nav.fleet'),
      href: '/fleet',
      icon: Truck,
      category: 'navigation',
      keywords: ['fleet', 'أسطول'],
    },
    {
      id: 'nav-marketing',
      title: t('control panel.nav.marketing'),
      href: '/marketing',
      icon: TrendingUp,
      category: 'navigation',
      keywords: ['marketing', 'تسويق'],
    },
    {
      id: 'nav-governance',
      title: t('control panel.nav.governance'),
      href: '/governance',
      icon: Shield,
      category: 'navigation',
      keywords: ['governance', 'حوكمة'],
    },
    {
      id: 'nav-analytics',
      title: t('control panel.nav.analytics'),
      href: '/analytics',
      icon: TrendingUp,
      category: 'navigation',
      keywords: ['analytics', 'تحليلات'],
    },
    {
      id: 'nav-partner',
      title: t('control panel.nav.partner'),
      href: '/partner',
      icon: Users,
      category: 'navigation',
      keywords: ['partner', 'شريك'],
    },
    {
      id: 'nav-settings',
      title: t('control panel.nav.platform'),
      href: '/platform',
      icon: Settings,
      category: 'navigation',
      keywords: ['settings', 'platform', 'إعدادات'],
    },
  ], [t]);

  const items = customItems ?? defaultItems;

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const subtitleMatch = item.subtitle?.toLowerCase().includes(lowerQuery);
      const keywordsMatch = item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery));
      return titleMatch || subtitleMatch || keywordsMatch;
    });
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredItems]);

  const flatItems = useMemo(() => {
    const result: CommandItem[] = [];
    for (const cat of CATEGORY_ORDER) {
      if (groupedItems[cat]) result.push(...groupedItems[cat]);
    }
    return result;
  }, [groupedItems]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          router.push(flatItems[selectedIndex].href);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatItems, selectedIndex, router, onClose]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  if (!mounted || !isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      <div
        className="relative w-full max-w-xl rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: semanticRoles.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: semanticRoles.border }}
        >
          <Search className="h-5 w-5 shrink-0" style={{ color: semanticRoles.textMuted }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('control panel.command.placeholder')}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-gray-400"
            style={{ color: semanticRoles.text }}
          />
          <kbd
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: semanticRoles.surfaceSubtle,
              color: semanticRoles.textMuted,
            }}
          >
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p style={{ color: semanticRoles.textMuted }}>
                {t('control panel.command.no_results')}
              </p>
            </div>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const catItems = groupedItems[category];
              if (!catItems?.length) return null;
              
              return (
                <div key={category} className="mb-2">
                  <div
                    className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: semanticRoles.textMuted }}
                  >
                    {CATEGORY_LABELS[category]}
                  </div>
                  {catItems.map((item) => {
                    const globalIndex = flatItems.findIndex((fi) => fi.id === item.id);
                    const isSelected = globalIndex === selectedIndex;
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: isSelected ? semanticRoles.surfaceSubtle : 'transparent',
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <div
                          className="p-2 rounded-lg shrink-0"
                          style={{
                            backgroundColor: `${semanticRoles.primaryCTA}15`,
                            color: semanticRoles.primaryCTA,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm font-medium truncate"
                            style={{ color: semanticRoles.text }}
                          >
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div
                              className="text-xs truncate"
                              style={{ color: semanticRoles.textMuted }}
                            >
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd
                            className="px-2 py-0.5 rounded text-xs font-medium shrink-0"
                            style={{
                              backgroundColor: semanticRoles.surfaceSubtle,
                              color: semanticRoles.textMuted,
                            }}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                        <DirectionalIcon
                          icon={ArrowRight}
                          className="h-4 w-4 shrink-0 opacity-40"
                          mirrorInRTL
                        />
                      </Link>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div
          className="flex items-center justify-between px-4 py-2 border-t text-xs"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.textMuted,
          }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100">↑↓</kbd>
              {t('control panel.command.navigate')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100">↵</kbd>
              {t('control panel.command.select')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100">esc</kbd>
              {t('control panel.command.close')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

export default CommandPalette;

