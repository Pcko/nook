import { deflateSync, inflateSync } from 'zlib';

export type StoredStringEncoding = 'plain' | 'deflate-base64';

export const DEFAULT_STORED_STRING_ENCODING: StoredStringEncoding = 'deflate-base64';
export const STORED_STRING_FORMAT_VERSION = 1;

export interface EncodedStoredString {
    content: string | null;
    encoding: StoredStringEncoding;
    version: number;
}

export function encodeStoredString(
    value: string | null | undefined,
    encoding: StoredStringEncoding = DEFAULT_STORED_STRING_ENCODING,
): EncodedStoredString {
    if (value == null) {
        return {
            content: null,
            encoding,
            version: STORED_STRING_FORMAT_VERSION,
        };
    }

    if (encoding === 'plain') {
        return {
            content: value,
            encoding,
            version: STORED_STRING_FORMAT_VERSION,
        };
    }

    return {
        content: deflateSync(Buffer.from(value, 'utf8')).toString('base64'),
        encoding,
        version: STORED_STRING_FORMAT_VERSION,
    };
}

export function decodeStoredString(
    value: string | null | undefined,
    encoding?: StoredStringEncoding | null,
): string | null {
    if (value == null) return null;
    if (!encoding || encoding === 'plain') return value;

    if (encoding === 'deflate-base64') {
        return inflateSync(Buffer.from(value, 'base64')).toString('utf8');
    }

    throw new Error(`Unsupported stored string encoding: ${String(encoding)}`);
}
