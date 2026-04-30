'use client';

/**
 * McpwFleetScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import { Truck, Users, Clock, Award, Car, Wrench, MapPin } from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwFleetScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title='الأسطول'
        subtitle='إدارة الكباتن والمركبات وعمليات التوصيل'
        icon={<Truck size={28} color='#FFF' />}
        gradientFrom='#8B5CF6'
        gradientTo='#7C3AED'
        shadowColor='rgba(139, 92, 246, 0.3)'
      />

      <RestoredHubSectionIntro
        title='أقسام الأسطول'
        description='الكباتن والمركبات والتتبع والصيانة'
        icon={<Users size={20} color='#F97316' />}
        accentColor='#F97316'
      />

      <RestoredHubGrid>
        <RestoredHubQuickLink
          title='قائمة الكباتن'
          description='عرض وإدارة جميع الكباتن المسجلين'
          href='/fleet/captains'
          icon={<Users size={22} color='#F97316' />}
          color='#F97316'
          badge='245'
        />
        <RestoredHubQuickLink
          title='التوفر'
          description='متابعة حالة توفر الكباتن في الوقت الفعلي'
          href='/fleet/availability'
          icon={<Clock size={22} color='#22C55E' />}
          color='#22C55E'
        />
        <RestoredHubQuickLink
          title='المستويات والتقييم'
          description='نظام تصنيف ومستويات الكباتن'
          href='/fleet/captain-tier'
          icon={<Award size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <RestoredHubQuickLink
          title='المركبات'
          description='إدارة أسطول المركبات'
          href='/fleet/vehicles'
          icon={<Car size={22} color='#6366F1' />}
          color='#6366F1'
        />
        <RestoredHubQuickLink
          title='الصيانة'
          description='جدولة ومتابعة الصيانة'
          href='/fleet/maintenance'
          icon={<Wrench size={22} color='#EF4444' />}
          color='#EF4444'
        />
        <RestoredHubQuickLink
          title='التتبع'
          description='تتبع المركبات على الخريطة'
          href='/fleet/tracking'
          icon={<MapPin size={22} color='#10B981' />}
          color='#10B981'
        />
      </RestoredHubGrid>
    </div>
  );
}
