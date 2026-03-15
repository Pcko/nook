import crypto from 'crypto';
import { PageAsset } from '../database/models/pageAsset-schema.js';
import type IPageAsset from '../types/IPageAsset.js';

const INLINE_IMAGE_DATA_URL_REGEX = /data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/gi;
const PRIVATE_ASSET_URL_REGEX = /(?:https?:\/\/[^"'()\s]+)?\/api\/page-assets\/([a-f0-9]{24})\/content/gi;
const PUBLIC_ASSET_URL_REGEX = /(?:https?:\/\/[^"'()\s]+)?\/assets\/([a-f0-9]{24})/gi;

function unique<T>(values: Iterable<T>): T[] {
    return [...new Set(values)];
}

export function buildAssetHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function upsertBinaryAsset(params: {
    author: string;
    buffer: Buffer;
    contentType: string;
}): Promise<IPageAsset> {
    const hash = buildAssetHash(params.buffer);

    const asset = await PageAsset.findOneAndUpdate(
        { author: params.author, hash },
        {
            author: params.author,
            hash,
            contentType: params.contentType || 'application/octet-stream',
            byteSize: params.buffer.byteLength,
            data: params.buffer,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return asset as IPageAsset;
}

export function extractAssetIdsFromHtml(html: string): string[] {
    const ids = new Set<string>();

    for (const regex of [PRIVATE_ASSET_URL_REGEX, PUBLIC_ASSET_URL_REGEX]) {
        const matches = html.matchAll(new RegExp(regex.source, 'gi'));
        for (const match of matches) {
            if (match[1]) ids.add(match[1]);
        }
    }

    return [...ids];
}

export function rewritePrivateAssetUrlsToPublic(html: string): { html: string; assetIds: string[] } {
    const rewritten = html
        .replace(new RegExp(PRIVATE_ASSET_URL_REGEX.source, 'gi'), (_match, assetId: string) => `/assets/${assetId}`)
        .replace(new RegExp(PUBLIC_ASSET_URL_REGEX.source, 'gi'), (_match, assetId: string) => `/assets/${assetId}`);

    return {
        html: rewritten,
        assetIds: extractAssetIdsFromHtml(rewritten),
    };
}

export async function externalizeInlineImagesInHtml(params: {
    html: string;
    author: string;
}): Promise<{ html: string; assetIds: string[] }> {
    const matches = unique(params.html.match(new RegExp(INLINE_IMAGE_DATA_URL_REGEX.source, 'gi')) || []);
    if (!matches.length) {
        return { html: params.html, assetIds: [] };
    }

    const replacementMap = new Map<string, string>();
    const assetIds = new Set<string>();

    for (const dataUrl of matches) {
        const parsed = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/i);
        if (!parsed) continue;

        const [, contentType, base64] = parsed;
        const buffer = Buffer.from(base64, 'base64');
        const asset = await upsertBinaryAsset({
            author: params.author,
            buffer,
            contentType,
        });

        const publicUrl = `/assets/${String(asset._id)}`;
        replacementMap.set(dataUrl, publicUrl);
        assetIds.add(String(asset._id));
    }

    let rewrittenHtml = params.html;
    for (const [dataUrl, publicUrl] of replacementMap.entries()) {
        rewrittenHtml = rewrittenHtml.split(dataUrl).join(publicUrl);
    }

    return {
        html: rewrittenHtml,
        assetIds: [...assetIds],
    };
}
