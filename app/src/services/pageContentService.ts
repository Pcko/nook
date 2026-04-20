import { buildAssetRef, buildEditorAssetUrl, uploadPageImageDataUrl } from './pageAssetService.ts';

const PAGE_CACHE_FORMAT_VERSION = 2;
const MAX_LOCAL_PAGE_CACHE_BYTES = 1_500_000;
const INLINE_IMAGE_DATA_URL_REGEX = /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi;
const HAS_INLINE_IMAGE_DATA_URL_REGEX = /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/i;
const ASSET_REF_REGEX = /asset:\/\/([a-f0-9]{24})/gi;
const PRIVATE_ASSET_URL_REGEX = /(?:https?:\/\/[^"'()\s]+)?\/api\/page-assets\/([a-f0-9]{24})\/content/gi;
const PUBLIC_ASSET_URL_REGEX = /(?:https?:\/\/[^"'()\s]+)?\/assets\/([a-f0-9]{24})/gi;

function cloneValue(value) {
    if (value == null) return value;
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

function estimateByteSize(value) {
    return new TextEncoder().encode(String(value || '')).length;
}

function canonicalizeAssetUrlsToRefs(value) {
    return String(value)
        .replace(PRIVATE_ASSET_URL_REGEX, (_match, assetId) => buildAssetRef(assetId))
        .replace(PUBLIC_ASSET_URL_REGEX, (_match, assetId) => buildAssetRef(assetId));
}

function resolveAssetRefsToEditorUrls(value) {
    return String(value).replace(ASSET_REF_REGEX, (_match, assetId) => buildEditorAssetUrl(assetId));
}

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

function serializeProjectData(value) {
    return value == null ? null : JSON.stringify(value);
}

function deserializeProjectData(value) {
    return value == null ? null : JSON.parse(value);
}

export function hydrateProjectDataForEditor(value) {
    const normalizedData = deserializeProjectData(value);
    return normalizedData == null ? null : resolveValueForEditor(normalizedData);
}

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

export function buildPageCacheEntry(normalizedData) {
    return JSON.stringify({
        cacheVersion: PAGE_CACHE_FORMAT_VERSION,
        data: serializeProjectData(normalizedData),
    });
}

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