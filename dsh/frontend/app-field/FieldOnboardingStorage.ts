import { createFieldSeedStores, type FieldStoreFile } from './dshFieldStoresModel';

const STORAGE_KEY = 'bthwani_dsh_app_field_store_onboarding_v3';
const LEGACY_STORAGE_KEY = 'bthwani_app_field_partner_onboarding_v2';

let fieldStoresMemory: FieldStoreFile[] | null = null;

function getStorageHandle() {
  try {
    return typeof globalThis !== 'undefined' && 'localStorage' in globalThis ? globalThis.localStorage : null;
  } catch {
    return null;
  }
}

export function readFieldStoresLocal(): FieldStoreFile[] {
  const storage = getStorageHandle();

  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
        if (legacyRaw) {
          const parsed = JSON.parse(legacyRaw) as FieldStoreFile[];
          fieldStoresMemory = parsed;
          storage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          return parsed;
        }

        const seed = createFieldSeedStores();
        fieldStoresMemory = seed;
        storage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }

      const parsed = JSON.parse(raw) as FieldStoreFile[];
      fieldStoresMemory = parsed;
      return parsed;
    } catch {
      return fieldStoresMemory ?? createFieldSeedStores();
    }
  }

  if (!fieldStoresMemory) {
    fieldStoresMemory = createFieldSeedStores();
  }

  return fieldStoresMemory;
}

export function writeFieldStoresLocal(stores: FieldStoreFile[]) {
  fieldStoresMemory = stores;
  const storage = getStorageHandle();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(stores));
  } catch {
    // ignore local persistence failures
  }
}
