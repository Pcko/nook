import { buildAssetRef, buildEditorAssetUrl, uploadPageImageDataUrl } from './pageAssetService.ts';

const PAGE_CACHE_FORMAT_VERSION = 2;
const MAX_LOCAL_PAGE_CACHE_BYTES = 1_500_000;
const INLINE_IMAGE_DATA_URL_REGEX = /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi;
const HAS_INLINE_IMAGE_DATA_URL_REGEX = /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/i;
const ASSET_REF_REGEX = /asset:\/\/([a-f0-9]{24})/gi;
const PRIVATE_ASSET_URL_REGEX = /(?:https?:\/\/[^"'()\s]+)?\/api\/page-assets\/([a-f0-9]{24})\/content/gi;
const PUBLIC_ASSET_URL_REGEX = /(?:https?:\/\/[^"'()\s]+)?\/assets\/([a-f0-9]{24})/gi;

/**
 * Deep-clones a value so downstream normalization can safely mutate nested data.
 *
 * Uses `structuredClone` when available and falls back to JSON serialization for
 * plain serializable data.
 *
 * @template T
 * @param {T} value - The value to clone.
 * @returns {T} A deep clone of the input value.
 */
function cloneValue(value) {
    if (value == null) return value;
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

/**
 * Estimates the UTF-8 byte size of a value after string coercion.
 *
 * @param {unknown} value - The value to measure.
 * @returns {number} Estimated byte size in UTF-8.
 */
function estimateByteSize(value) {
    return new TextEncoder().encode(String(value || '')).length;
}

/**
 * Rewrites private and public asset URLs into canonical `asset://<id>` references.
 *
 * This keeps persisted project data environment-agnostic by storing asset refs
 * instead of concrete server URLs.
 *
 * @param {unknown} value - A string-like value that may contain asset URLs.
 * @returns {string} The normalized string containing asset references.
 */
function canonicalizeAssetUrlsToRefs(value) {
    return String(value)
        .replace(PRIVATE_ASSET_URL_REGEX, (_match, assetId) => buildAssetRef(assetId))
        .replace(PUBLIC_ASSET_URL_REGEX, (_match, assetId) => buildAssetRef(assetId));
}

/**
 * Rewrites canonical `asset://<id>` references into editor-consumable asset URLs.
 *
 * @param {unknown} value - A string-like value that may contain asset references.
 * @returns {string} The resolved string containing editor asset URLs.
 */
function resolveAssetRefsToEditorUrls(value) {
    return String(value).replace(ASSET_REF_REGEX, (_match, assetId) => buildEditorAssetUrl(assetId));
}

/**
 * Uploads inline base64 image data URLs and replaces them with canonical asset refs.
 *
 * Duplicate inline images are deduplicated through the provided upload cache so
 * the same data URL is only uploaded once per normalization pass.
 *
 * @param {unknown} value - A string-like value that may contain inline image data URLs.
 * @param {string} pageName - The page name associated with uploaded assets.
 * @param {Map<string, Promise<string>>} uploadCache - Cache of data URL to asset ID promise.
 * @returns {Promise<string>} A string with inline image data replaced by asset refs.
 */
async function replaceInlineDataUrlsWithAssetRefs(value, pageName, uploadCache) {
    const matches = [...new Set(String(value).match(INLINE_IMAGE_DATA_URL_REGEX) || [])];
    if (!matches.length) return value;

    let nextValue = String(value);

    for (const dataUrl of matches) {
        let assetPromise = uploadCache.get(dataUrl);
        if (!assetPromise) {
            assetPromise = uploadPageImageDataUrl(pageName, dataUrl).then((result) => result.assetId);
            uploadCache.set(dataUrl, assetPromise);
        }

        const assetId = await assetPromise;
        nextValue = nextValue.split(dataUrl).join(buildAssetRef(assetId));
    }

    return nextValue;
}

/**
 * Recursively normalizes project data for persistence.
 *
 * Normalization includes:
 * - converting asset URLs into canonical asset refs
 * - uploading inline image data URLs and replacing them with asset refs
 * - traversing arrays and plain objects recursively
 *
 * @param {unknown} value - The value to normalize.
 * @param {string} pageName - The page name associated with uploaded assets.
 * @param {Map<string, Promise<string>>} uploadCache - Cache of data URL to asset ID promise.
 * @returns {Promise<unknown>} The normalized value ready for storage.
 */
async function normalizeValueForStorage(value, pageName, uploadCache) {
    if (typeof value === 'string') {
        const canonical = canonicalizeAssetUrlsToRefs(value);
        if (!HAS_INLINE_IMAGE_DATA_URL_REGEX.test(canonical)) return canonical;
        return replaceInlineDataUrlsWithAssetRefs(canonical, pageName, uploadCache);
    }

    if (Array.isArray(value)) {
        return Promise.all(value.map((item) => normalizeValueForStorage(item, pageName, uploadCache)));
    }

    if (value && typeof value === 'object') {
        const entries = await Promise.all(
            Object.entries(value).map(async ([key, nestedValue]) => [key, await normalizeValueForStorage(nestedValue, pageName, uploadCache)]),
        );
        return Object.fromEntries(entries);
    }

    return value;
}

/**
 * Recursively resolves canonical asset refs into editor URLs for display/editing.
 *
 * @param {unknown} value - The value to resolve.
 * @returns {unknown} The resolved value suitable for editor use.
 */
function resolveValueForEditor(value) {
    if (typeof value === 'string') {
        return resolveAssetRefsToEditorUrls(value);
    }

    if (Array.isArray(value)) {
        return value.map((item) => resolveValueForEditor(item));
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, resolveValueForEditor(nestedValue)]));
    }

    return value;
}

/**
 * Serializes normalized project data for persistence.
 *
 * @param {unknown} value - The value to serialize.
 * @returns {string | null} JSON string output, or `null` when input is nullish.
 */
function serializeProjectData(value) {
    return value == null ? null : JSON.stringify(value);
}

/**
 * Deserializes persisted project data.
 *
 * @param {string | null | undefined} value - Serialized project data.
 * @returns {unknown | null} Parsed project data, or `null` when input is nullish.
 */
function deserializeProjectData(value) {
    return value == null ? null : JSON.parse(value);
}

/**
 * Hydrates persisted project data into editor-ready data by resolving asset refs.
 *
 * @param {string | null | undefined} value - Serialized normalized project data.
 * @returns {unknown | null} Editor-ready project data, or `null` when absent.
 */
export function hydrateProjectDataForEditor(value) {
    const normalizedData = deserializeProjectData(value);
    return normalizedData == null ? null : resolveValueForEditor(normalizedData);
}

/**
 * Prepares project data for persistence and editor reuse.
 *
 * The returned object includes:
 * - `normalizedData`: canonical storage form
 * - `editorData`: normalized data with editor URLs resolved
 * - `serializedData`: JSON string for database persistence
 *
 * @param {string} pageName - The page name associated with uploaded assets.
 * @param {unknown} projectData - Raw project data from the editor.
 * @returns {Promise<{
 *   normalizedData: unknown | null,
 *   editorData: unknown | null,
 *   serializedData: string | null
 * }>} Persistable and editor-ready representations of the project data.
 */
export async function prepareProjectDataForPersistence(pageName, projectData) {
    if (projectData == null) {
        return {
            normalizedData: null,
            editorData: null,
            serializedData: null,
        };
    }

    const clonedData = cloneValue(projectData);
    const normalizedData = await normalizeValueForStorage(clonedData, pageName, new Map());

    return {
        normalizedData,
        editorData: resolveValueForEditor(cloneValue(normalizedData)),
        serializedData: serializeProjectData(normalizedData),
    };
}

/**
 * Builds the local-storage cache payload for normalized page data.
 *
 * The payload includes a cache format version so stale cache entries can be rejected
 * after format changes.
 *
 * @param {unknown} normalizedData - Canonical normalized project data.
 * @returns {string} Serialized cache entry.
 */
export function buildPageCacheEntry(normalizedData) {
    return JSON.stringify({
        cacheVersion: PAGE_CACHE_FORMAT_VERSION,
        data: serializeProjectData(normalizedData),
    });
}

/**
 * Restores editor-ready project data from a cached local-storage payload.
 *
 * Invalid, outdated, or malformed cache entries are ignored and return `null`.
 *
 * @param {string | null | undefined} cacheValue - Raw local-storage cache payload.
 * @returns {unknown | null} Restored editor-ready data, or `null` if cache is unusable.
 */
export function restoreProjectDataFromCache(cacheValue) {
    if (!cacheValue) return null;

    try {
        const parsed = JSON.parse(cacheValue);
        if (!parsed || parsed.cacheVersion !== PAGE_CACHE_FORMAT_VERSION) return null;

        const normalizedData = deserializeProjectData(parsed.data);
        return normalizedData == null ? null : resolveValueForEditor(normalizedData);
    } catch {
        return null;
    }
}

/**
 * Writes normalized project data to local storage when it fits within the cache limit.
 *
 * If the data is nullish, too large, or local storage fails, the cache entry is removed.
 *
 * @param {string} storageKey - The local-storage key to write to.
 * @param {unknown} normalizedData - Canonical normalized project data to cache.
 * @returns {boolean} `true` when cache write succeeds, otherwise `false`.
 */
export function writePageCache(storageKey, normalizedData) {
    if (normalizedData == null) {
        localStorage.removeItem(storageKey);
        return false;
    }

    const serialized = buildPageCacheEntry(normalizedData);
    if (estimateByteSize(serialized) > MAX_LOCAL_PAGE_CACHE_BYTES) {
        localStorage.removeItem(storageKey);
        return false;
    }

    try {
        localStorage.setItem(storageKey, serialized);
        return true;
    } catch {
        localStorage.removeItem(storageKey);
        return false;
    }
}