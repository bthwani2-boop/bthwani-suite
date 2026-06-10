/**
 * fix-state-views.mjs
 * Migrates custom loading/offline/error Box+Text+Button patterns
 * to central StateView component from @bthwani/ui-kit.
 */
import { readFileSync, writeFileSync } from 'node:fs';

let fixed = 0;

function patch(filePath, transforms) {
  let src = readFileSync(filePath, 'utf8');
  const original = src;
  for (const { from, to, desc } of transforms) {
    if (!src.includes(from)) {
      console.log(`  MISS: ${desc}`);
      continue;
    }
    src = src.replace(from, to);
    console.log(`  FIX: ${desc}`);
    fixed++;
  }
  if (src !== original) {
    writeFileSync(filePath, src, 'utf8');
    console.log(`  WRITTEN: ${filePath.split('/').slice(-2).join('/')}\n`);
  }
}

// ─── CategoryManagementScreen.tsx ────────────────────────────────────────────
console.log('── CategoryManagementScreen.tsx ──');
patch('dsh/frontend/app-partner/screens/CategoryManagementScreen.tsx', [
  // Add StateView to import
  {
    desc: 'add StateView import',
    from: `  Box,
  Button,
  Chip,
  Divider,
  MobileStickyPrimaryAction,
  Text,
  TextField,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';`,
    to: `  Box,
  Button,
  Chip,
  Divider,
  MobileStickyPrimaryAction,
  StateView,
  Text,
  TextField,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';`,
  },
  // Loading state
  {
    desc: 'loading state → StateView',
    from: `  // ── Loading state ──────────────────────────────────────────────────────────
  if (screenState === 'loading') {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text role="bodyStrong" tone="muted" align="center">
          جارٍ تحميل الفئات…
        </Text>
      </Box>
    );
  }`,
    to: `  // ── Loading state ──────────────────────────────────────────────────────────
  if (screenState === 'loading') {
    return <StateView kind="loading" title="جارٍ تحميل الفئات…" />;
  }`,
  },
  // Offline state
  {
    desc: 'offline state → StateView',
    from: `  // ── Offline state ──────────────────────────────────────────────────────────
  if (screenState === 'offline') {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 }}>
        <Text role="bodyStrong" tone="warning" align="center">
          لا يوجد اتصال بالشبكة
        </Text>
        <Text role="bodySm" tone="muted" align="center">
          تعذّر الاتصال بالخادم. تحقق من الاتصال وأعد المحاولة.
        </Text>
        <Button label="إعادة المحاولة" tone="primary" onPress={loadCategories} />
      </Box>
    );
  }`,
    to: `  // ── Offline state ──────────────────────────────────────────────────────────
  if (screenState === 'offline') {
    return <StateView stateId="offline" actionLabel="إعادة المحاولة" onActionPress={loadCategories} />;
  }`,
  },
  // Error state
  {
    desc: 'error state → StateView',
    from: `  // ── Error state ────────────────────────────────────────────────────────────
  if (screenState === 'error') {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 }}>
        <Text role="bodyStrong" tone="danger" align="center">
          حدث خطأ غير متوقع
        </Text>
        <Text role="bodySm" tone="muted" align="center">
          فشل تحميل قائمة الفئات. يرجى التحقق من الخادم وإعادة المحاولة.
        </Text>
        <Button label="إعادة المحاولة" tone="primary" onPress={loadCategories} />
      </Box>
    );
  }`,
    to: `  // ── Error state ────────────────────────────────────────────────────────────
  if (screenState === 'error') {
    return <StateView stateId="recoverableError" title="حدث خطأ غير متوقع" description="فشل تحميل قائمة الفئات. يرجى التحقق من الخادم وإعادة المحاولة." actionLabel="إعادة المحاولة" onActionPress={loadCategories} />;
  }`,
  },
]);

// ─── ProductEditScreen.tsx ────────────────────────────────────────────────────
console.log('── ProductEditScreen.tsx ──');
patch('dsh/frontend/app-partner/screens/ProductEditScreen.tsx', [
  // Add StateView to import
  {
    desc: 'add StateView import',
    from: `  Box,
  Button,
  Chip,
  Divider,
  MobileStickyPrimaryAction,
  Text,
  TextField,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';`,
    to: `  Box,
  Button,
  Chip,
  Divider,
  MobileStickyPrimaryAction,
  StateView,
  Text,
  TextField,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';`,
  },
  // Loading state
  {
    desc: 'loading state → StateView',
    from: `  // ── Loading state ──────────────────────────────────────────────────────────
  if (screenState === 'loading') {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text role="bodyStrong" tone="muted" align="center">
          جارٍ تحميل بيانات المنتج…
        </Text>
      </Box>
    );
  }`,
    to: `  // ── Loading state ──────────────────────────────────────────────────────────
  if (screenState === 'loading') {
    return <StateView kind="loading" title="جارٍ تحميل بيانات المنتج…" />;
  }`,
  },
  // Not-found state
  {
    desc: 'not_found state → StateView',
    from: `  // ── Not-found state ────────────────────────────────────────────────────────
  if (screenState === 'not_found') {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 }}>
        <Text role="bodyStrong" tone="danger" align="center">
          المنتج غير موجود
        </Text>
        <Text role="bodySm" tone="muted" align="center">
          لم يُعثر على المنتج المطلوب. قد يكون محذوفاً أو أن الرابط غير صحيح.
        </Text>
        {onBack ? (
          <Button label="العودة" tone="secondary" onPress={onBack} />
        ) : null}
      </Box>
    );
  }`,
    to: `  // ── Not-found state ────────────────────────────────────────────────────────
  if (screenState === 'not_found') {
    return <StateView stateId="notFound" title="المنتج غير موجود" description="لم يُعثر على المنتج المطلوب. قد يكون محذوفاً أو أن الرابط غير صحيح." actionLabel={onBack ? 'العودة' : undefined} onActionPress={onBack} />;
  }`,
  },
  // Offline state
  {
    desc: 'offline state → StateView',
    from: `  // ── Offline state ──────────────────────────────────────────────────────────
  if (screenState === 'offline') {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 }}>
        <Text role="bodyStrong" tone="warning" align="center">
          لا يوجد اتصال بالشبكة
        </Text>
        <Text role="bodySm" tone="muted" align="center">
          تعذّر الاتصال بالخادم. تحقق من الاتصال وأعد المحاولة.
        </Text>
        <Button label="إعادة المحاولة" tone="primary" onPress={handleRetry} />
      </Box>
    );
  }`,
    to: `  // ── Offline state ──────────────────────────────────────────────────────────
  if (screenState === 'offline') {
    return <StateView stateId="offline" actionLabel="إعادة المحاولة" onActionPress={handleRetry} />;
  }`,
  },
]);

console.log(`\n✓ Total fixes: ${fixed}`);
