const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

function trimTrailingSlash(value) {
    return String(value || '').replace(/\/+$/, '');
}

function getApiBaseUrl() {
    return trimTrailingSlash((import.meta || {}).env?.VITE_API_URL || '');
}

function dataUrlToBlob(dataUrl) {
    const [header, base64 = ''] = String(dataUrl || '').split(',', 2);
    const mimeMatch = header.match(/^data:([^;]+);base64$/i);
    const contentType = mimeMatch?.[1] || 'application/octet-stream';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: contentType });
}

async function sha256Hex(blob) {
    const buffer = await blob.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('');
}

export function isAssetId(value) {
    return OBJECT_ID_REGEX.test(String(value || ''));
}

export function buildAssetRef(assetId) {
    return `asset://${assetId}`;
}

export function buildEditorAssetUrl(assetId) {
    const baseUrl = getApiBaseUrl();
    const path = `/api/page-assets/${assetId}/content`;
    return baseUrl ? `${baseUrl}${path}` : path;
}

export async function uploadPageImageDataUrl(pageName, dataUrl) {
    const blob = dataUrlToBlob(dataUrl);
    const hash = await sha256Hex(blob);
    const contentType = blob.type || 'application/octet-stream';
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/page-assets/${encodeURIComponent(pageName)}/${hash}?contentType=${encodeURIComponent(contentType)}`;

    const response = await fetch(endpoint, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': contentType,
        },
        body: blob,
    });

    if (!response.ok) {
        throw new Error(`Asset upload failed with status ${response.status}`);
    }

    return response.json();
}
