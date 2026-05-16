#!/usr/bin/env node
/**
 * Platform Control Plane UI/UX Guard
 *
 * Purpose:
 * - Prevent Platform from drifting into a developer/debug surface.
 * - Prevent secrets/API keys in frontend preview files.
 * - Prevent Campaign/Marketing contamination inside Appearance.
 * - Prevent deprecated control path imports.
 * - Prevent enabled live action buttons during UI/UX phase.
 *
 * Run from repo root:
 *   node tools/guards/platform-control-plane-uiux.guard.mjs
 */

import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const platformDir = path.join(repoRoot, 'dsh', 'frontend', 'control-panel', 'platform');
const uiKitDir = path.join(repoRoot, 'ui-kit');
const errors = [];
const warnings = [];

function exists(p) {
  return fs.existsSync(p);
}

function walk(dir, acc = []) {
  if (!exists(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'dist', 'build', '.git'].includes(entry.name)) continue;
      walk(full, acc);
    } else {
      if (/\.(tsx?|jsx?|css|md|json)$/.test(entry.name)) acc.push(full);
    }
  }
  return acc;
}

function rel(p) {
  return path.relative(repoRoot, p).replace(/\\/g, '/');
}

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

if (!exists(platformDir)) {
  errors.push(`Missing platform directory: ${rel(platformDir)}`);
} else {
  const files = walk(platformDir);

  const appearanceFiles = files.filter((f) => rel(f).includes('/Appearance/'));
  const allPlatformText = files.map((f) => `\n// FILE: ${rel(f)}\n` + read(f)).join('\n');

  // Deprecated control path
  for (const f of files) {
    const txt = read(f);
    if (/dsh\/frontend\/control-panel\/control|from\s+['"]\.\.\/control['"]|from\s+['"]\.\/control['"]|ControlPanelDshControlHubScreen|ControlPanelDshGovernanceEvidenceScreen|ControlPanelDshGuardStatusScreen/.test(txt)) {
      errors.push(`Deprecated control path or export detected in ${rel(f)}`);
    }
  }

  // Appearance must not contain marketing/campaign concepts as features.
  // عرض means "display/preview" in Arabic and is excluded — only campaign-specific terms blocked.
  // ليس للحملات = "not for campaigns" is a clarification and must NOT be flagged.
  const campaignTerms = /\b(Campaign|Seasonal|Promo|Promotion|campaign|seasonal|promo)\b|^(?!.*ليس\s+للحملات).*حملة|^(?!.*ليس\s+للحملات).*موسمي/m;
  for (const f of appearanceFiles) {
    const txt = read(f);
    if (campaignTerms.test(txt)) {
      errors.push(`Appearance contains campaign/marketing term: ${rel(f)}`);
    }
  }

  // Secrets/API keys: block real-ish keys and unsafe labels
  const secretPatterns = [
    /sk-[A-Za-z0-9_-]{16,}/,
    /AIza[0-9A-Za-z\-_]{20,}/,
    /AKIA[0-9A-Z]{16}/,
    /-----BEGIN\s+(RSA|OPENSSH|PRIVATE)\s+KEY-----/,
    /(api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{12,}['"]/i,
  ];
  for (const f of files) {
    const txt = read(f);
    for (const pattern of secretPatterns) {
      if (pattern.test(txt)) {
        errors.push(`Possible real secret/API key detected in ${rel(f)}`);
      }
    }
  }

  // Guard enabled action buttons for live operations in UI/UX phase.
  // In Demo Mode, buttons can be enabled, but must be marked as Demo/Mock/تجريبي or exist in a file marked as Demo.
  const liveActionWords = /(Apply|Activate|Save|Rollback|تفعيل|تطبيق|حفظ|إيقاف|تشغيل|تراجع|إظهار|إخفاء|اختبار الاتصال|إضافة مفتاح)/;
  for (const f of files.filter((x) => /\.(tsx|jsx)$/.test(x))) {
    const txt = read(f);
    const buttonMatches = [...txt.matchAll(/<Button[\s\S]{0,300}?>/g)];
    for (const m of buttonMatches) {
      const snippet = m[0];
      const hasDemoLabel = /(demo|mock|تجريبي|محاكاة)/i.test(snippet) || /(demo|mock|تجريبي|محاكاة)/i.test(txt);
      if (liveActionWords.test(snippet) && !/\sdisabled(\s|=|>)/.test(snippet) && !hasDemoLabel) {
        errors.push(`Enabled action Button without Demo label: ${rel(f)} :: ${snippet.slice(0, 160).replace(/\s+/g, ' ')}`);
      }
    }
  }

  // Prevent API/backend calls
  const apiCallPattern = /\b(fetch|axios|XMLHttpRequest|useQuery|useMutation)\b|['"]use server['"]/;
  for (const f of files.filter((x) => /\.(tsx|jsx|ts|js)$/.test(x))) {
    const txt = read(f);
    if (apiCallPattern.test(txt)) {
      errors.push(`API call or server action detected in UI/UX Demo Mode: ${rel(f)}`);
    }
  }

  // Prevent old "disabled buttons" message
  for (const f of files) {
    const txt = read(f);
    if (/كل الأزرار معطلة/.test(txt)) {
      errors.push(`Found forbidden legacy text 'كل الأزرار معطلة' in ${rel(f)}`);
    }
  }

  // Prevent teaser-only Workspaces
  const teaserPattern = /(teaser|سيتم توفير هذه الواجهة قريباً|واجهة مقترحة)/i;
  for (const f of files) {
    const txt = read(f);
    if (teaserPattern.test(txt)) {
      errors.push(`Found teaser content instead of actual interactive Demo Mode in ${rel(f)}`);
    }
  }

  // Hardcoded colors under platform are suspicious except plain text mentions in docs/preview values.
  const hardcodedColorPattern = /(backgroundColor|color|borderColor)\s*:\s*['"]#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})['"]/;
  for (const f of files.filter((x) => /\.(tsx|jsx|ts|js)$/.test(x))) {
    const txt = read(f);
    if (hardcodedColorPattern.test(txt)) {
      errors.push(`Hardcoded style color detected in Platform UI: ${rel(f)}`);
    }
  }

  // Developer/debug identifiers as primary-looking title labels.
  const primaryTechTitlePattern = /<Text[^>]*(role=["']title|role=["']titleMd|role=["']heading)[^>]*>\s*\{?[^<}]*(provider_id|provider\.|wlt\.|VAR_|RuntimeVar|OpenAPI|Entity|endpoint)/i;
  for (const f of files.filter((x) => /\.(tsx|jsx)$/.test(x))) {
    const txt = read(f);
    if (primaryTechTitlePattern.test(txt)) {
      errors.push(`Technical identifier appears as primary title in ${rel(f)}`);
    }
  }

  // Block old preview tags that break immersion
  const previewTagsPattern = /(preview-only|ready-for-binding|contract-needed)/i;
  for (const f of files.filter((x) => /\.(tsx|jsx)$/.test(x))) {
    const txt = read(f);
    if (previewTagsPattern.test(txt)) {
      errors.push(`Found technical preview-only/ready-for-binding/contract-needed tags in UI: ${rel(f)}`);
    }
  }

  // Preferred workspaces should exist.
  const requiredDirs = ['Services', 'Providers', 'Vars', 'Appearance'];
  for (const d of requiredDirs) {
    const full = path.join(platformDir, d);
    if (!exists(full)) warnings.push(`Recommended workspace directory missing: ${rel(full)}`);
  }

  // Control plane human language indicator.
  if (!/تحكم|سيادي|إدارة المنصة|أعلى جهة إدارية|بدون استدعاء المطور/.test(allPlatformText)) {
    warnings.push('Platform copy may not clearly communicate sovereign human control plane.');
  }

  // ─── Adjacent-section boundary enforcement ──────────────────────────────
  // Platform must NOT contain catalog category/product management UI.
  // Safe references like "Catalogs owns categories" are explicitly allowed.
  const catalogManagementPattern = /(إضافة فئة|إضافة منتج|إضافة قسم|إضافة تصنيف|تعديل فئة|تعديل منتج|حذف فئة|حذف منتج|createCategory|updateCategory|deleteCategory|addProduct|editProduct|deleteProduct|categoryMutation|productMutation|catalogMutation|CatalogManagement|CategoryManagement|ProductManagement)/;
  for (const f of files.filter((x) => /\.(tsx|jsx)$/.test(x))) {
    const txt = read(f);
    if (catalogManagementPattern.test(txt)) {
      errors.push(`Catalog management UI detected inside Platform: ${rel(f)}`);
    }
  }

  // Platform must NOT contain campaign/offer/banner/loyalty/subscription management UI.
  // Safe text like "Marketing owns campaigns" is explicitly allowed (no mutation words).
  const marketingManagementPattern = /(إنشاء حملة|إضافة حملة|إضافة عرض|إضافة بانر|إنشاء عرض|تعديل حملة|حذف حملة|createCampaign|updateCampaign|deleteCampaign|createOffer|deleteOffer|createBanner|deleteBanner|loyaltyMutation|subscriptionMutation|CampaignManagement|OfferManagement|BannerManagement|LoyaltyManagement)/;
  for (const f of files.filter((x) => /\.(tsx|jsx)$/.test(x))) {
    const txt = read(f);
    if (marketingManagementPattern.test(txt)) {
      errors.push(`Marketing/campaign management UI detected inside Platform: ${rel(f)}`);
    }
  }

  // Platform must NOT contain user/role/permission management UI.
  // Safe text like "Administration owns users" is explicitly allowed.
  const adminManagementPattern = /(إضافة مستخدم|تعديل مستخدم|حذف مستخدم|إضافة دور|تعديل دور|تعيين دور|createUser|updateUser|deleteUser|assignRole|revokeRole|createRole|deleteRole|permissionMutation|UserManagement|RoleManagement|PermissionManagement)/;
  for (const f of files.filter((x) => /\.(tsx|jsx)$/.test(x))) {
    const txt = read(f);
    if (adminManagementPattern.test(txt)) {
      errors.push(`Administration/user management UI detected inside Platform: ${rel(f)}`);
    }
  }

  // Appearance must not carry marketing-ownership language implying it belongs to Marketing.
  const appearanceMarketingOwnership = /(Marketing owns appearance|appearance owned by marketing|Appearance المبيعات|مظهر التسويق|تسويق المظهر)/i;
  for (const f of appearanceFiles) {
    const txt = read(f);
    if (appearanceMarketingOwnership.test(txt)) {
      errors.push(`Appearance contains marketing-ownership language (Appearance belongs to Platform + DesignSystem): ${rel(f)}`);
    }
  }

  // ─── Platform > Services top-level boundary enforcement ──────────────────────
  // Only dsh/knz/wlt/amn/arb/mrf/kwd/snd/esf are valid top-level platform services.
  // Sub-capabilities (awnak/عونك, shein/شي إن, store-pickup, scheduled-orders) belong
  // in Vars/Rollouts and must NOT appear as top-level service definitions in Services/.
  const servicesFiles = files.filter((f) => rel(f).includes('/Services/'));
  const prohibitedServiceDefinitions = [
    {
      // Matches code: 'awnak' / name: '...عونك...' / humanName="...عونك..." (JSX legacy)
      pattern: /(?:code|name|humanName)\s*[:=]\s*['"][^'"]*(?:awnak|عونك)[^'"]*['"]/i,
      label: 'awnak (service-awnak / عونك) as top-level service code or name',
    },
    {
      pattern: /(?:code|name|humanName)\s*[:=]\s*['"][^'"]*(?:shein|شي.?إن)[^'"]*['"]/i,
      label: 'shein (service-shein / شي إن) as top-level service code or name',
    },
    {
      pattern: /(?:code|name|humanName)\s*[:=]\s*['"][^'"]*(?:store.?pickup|store_pickup|الاستلام\s*من\s*المتجر)[^'"]*['"]/i,
      label: 'store-pickup as top-level service code or name',
    },
    {
      pattern: /(?:code|name|humanName)\s*[:=]\s*['"][^'"]*(?:scheduled.?orders|scheduled_orders|الطلبات\s*المجدولة)[^'"]*['"]/i,
      label: 'scheduled-orders as top-level service code or name',
    },
    {
      // "DSH Delivery" must not be a separate service — DSH is the service, Delivery is its function
      pattern: /(?:code|name|humanName)\s*[:=]\s*['"]DSH\s+Delivery['"]/i,
      label: 'DSH Delivery as separate top-level service (should be: code: DSH)',
    },
  ];
  for (const { pattern, label } of prohibitedServiceDefinitions) {
    for (const f of servicesFiles) {
      const txt = read(f);
      if (pattern.test(txt)) {
        errors.push(`Prohibited sub-capability as top-level service in Services workspace ${rel(f)}: ${label}`);
      }
    }
  }
}


// ─── Captain eligibility must use wallet-balance language, not star ratings ────
if (exists(platformDir)) {
  const allPlatformFiles = walk(platformDir);
  for (const f of allPlatformFiles) {
    const txt = read(f);
    if (/أهلية\s*الكابتن|captain[\s._-]?eligib/i.test(txt)) {
      if (!/رصيد|محفظة|ريال|wallet[\s_-]?balance|threshold/i.test(txt)) {
        errors.push(`Captain eligibility mentioned without wallet balance wording (should reference رصيد/محفظة/ريال): ${rel(f)}`);
      }
      // Star-rating units are prohibited in captain eligibility context
      if (/نجوم|star-rating|\bستار\b|\d+\.\d+\s*(?:نجم|star)/i.test(txt)) {
        errors.push(`Star-rating value (نجوم/star-rating) found alongside captain eligibility — must use ريال/رصيد/محفظة only: ${rel(f)}`);
      }
    }
    // minRating field signals star-based eligibility and is prohibited everywhere in platform
    if (/\bminRating\b|min_rating/i.test(txt)) {
      errors.push(`Star-rating field (minRating/min_rating) detected in platform — captain eligibility must use wallet balance threshold: ${rel(f)}`);
    }
  }
}

// ─── Administration route must have a render branch in the shell ───────────────
const administrationPageFile = path.join(repoRoot, 'control-panel', 'runtime', 'app', 'administration', 'page.tsx');
const shellFile = path.join(repoRoot, 'control-panel', 'shell', 'ControlPanelSurfaceHost.tsx');
const administrationScreenFile = path.join(repoRoot, 'dsh', 'frontend', 'control-panel', 'administration', 'ControlPanelDshAdministrationScreen.tsx');

if (!exists(administrationScreenFile)) {
  errors.push(`Missing Administration screen: ${rel(administrationScreenFile)}`);
}

if (exists(administrationPageFile)) {
  if (!exists(shellFile)) {
    warnings.push('Administration page exists but ControlPanelSurfaceHost.tsx not found');
  } else {
    const shellTxt = read(shellFile);
    if (!shellTxt.includes("activeSectionId === 'administration'")) {
      errors.push('Administration route exists in runtime but has no render branch (activeSectionId === \'administration\') in ControlPanelSurfaceHost');
    }
    if (!shellTxt.includes('ControlPanelDshAdministrationScreen')) {
      errors.push('ControlPanelDshAdministrationScreen not imported/referenced in ControlPanelSurfaceHost');
    }
  }
}

// ui-kit modifications are checked indirectly through git status by the caller.
// This guard only scans files content.
if (errors.length) {
  console.error('PLATFORM_CONTROL_PLANE_UIUX_GUARD: FAIL');
  for (const e of errors) console.error(`ERROR: ${e}`);
  if (warnings.length) {
    for (const w of warnings) console.error(`WARN: ${w}`);
  }
  process.exit(1);
}

console.log('PLATFORM_CONTROL_PLANE_UIUX_GUARD: PASS');
if (warnings.length) {
  for (const w of warnings) console.log(`WARN: ${w}`);
}
