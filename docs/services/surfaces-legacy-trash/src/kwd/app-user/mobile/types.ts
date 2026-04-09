/**
 * KWD My File types
 * Simple, flexible profile for job seekers/workers in KWD.
 * Keeps only essential fields + optional portfolio image URIs.
 */

export const KWD_MAX_PORTFOLIO_IMAGES = 10 as const;

export interface KwdMyFile {
  /**
   * Full name used when applying to jobs.
   */
  fullName: string;

  /**
   * Primary contact phone (call / WhatsApp).
   * Optional – user can choose to omit.
   */
  contactPhone?: string;

  /**
   * Main skill or profession (e.g. بناء، سباك، كهربائي).
   */
  primarySkill?: string;

  /**
   * Simple availability text (e.g. اليوم، غداً، أسبوعياً).
   */
  availability?: string;

  /**
   * Preferred location (city / area – no precise address).
   */
  preferredLocation?: string;

  /**
   * Optional portfolio images (simple, 3–10 images).
   * Stored as image URIs for now; can be mapped to attachment IDs later.
   */
  portfolioImageUris: string[];

  /**
   * Optional category IDs from KWD_MAIN_CATEGORIES (multi-select).
   * Used to prefill "الفئات" in quick apply and worker listing forms.
   */
  categoryIds?: string[];
}

export const DEFAULT_KWD_MY_FILE: KwdMyFile = {
  fullName: '',
  contactPhone: '',
  primarySkill: '',
  availability: '',
  preferredLocation: '',
  portfolioImageUris: [],
  categoryIds: [],
};

