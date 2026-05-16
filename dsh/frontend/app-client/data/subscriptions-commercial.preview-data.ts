/**
 * UI_PREVIEW_ONLY — consumer adapter.
 * Derives subscription plan cards from shared loyalty.preview-store + commercial.preview-contract helpers.
 * NOT a source of truth. Do not add raw fixture data here.
 */
import { getSubscriptionPlans } from '../../shared/loyalty.preview-store';
import {
  mapSubscriptionPlansToClientCards,
  type SubscriptionClientCard,
} from '../../shared/commercial.preview-contract';

export type SubscriptionPlanCard = SubscriptionClientCard;

export const subscriptionHeroCopy = {
  eyebrow: 'بثواني برو',
  title: 'الاشتراكات',
  subtitle: 'دفع وتبديل وإدارة من نفس الصفحة.',
  note: 'العائلة حزمة داخل بثواني برو وليست منتجاً منفصلاً.',
} as const;

export const subscriptionPlanCards: SubscriptionPlanCard[] = mapSubscriptionPlansToClientCards(getSubscriptionPlans());
