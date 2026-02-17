import PublishedPage from "../../../../services/interfaces/PublishedPage.ts";

const PUBLIC_BASE_URL = ((import.meta as any).env?.VITE_PUBLISH_URL as string | undefined) ?? "";

export const PREVIEW_CONCURRENCY = 4;

export function toDate(input?: Date | string): Date | undefined {
    if (!input) return undefined;
    if (input instanceof Date) return input;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d;
}

export function getPublicUrl(page: PublishedPage): string {
    const safeAuthor = encodeURIComponent(page.author ?? "");
    const safeName = encodeURIComponent(page.name ?? "");
    return `${PUBLIC_BASE_URL}/${safeAuthor}/${safeName}`;
}

export function pageKey(page: PublishedPage): string {
    const updatedAt = toDate(page.updatedAt ?? page.createdAt)?.getTime() ?? "na";
    return `${page.author ?? "unknown"}::${page.name ?? "unknown"}::${updatedAt}`;
}

export function buildPreviewDocument(html: string): string {
    return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>html,body{margin:0;padding:0;}</style></head><body>${html}</body></html>`;
}

export async function mapLimit<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];
    let i = 0;

    const workers = Array.from({length: Math.max(1, limit)}, async () => {
        while (i < items.length) {
            const idx = i++;
            results[idx] = await fn(items[idx]);
        }
    });

    await Promise.all(workers);
    return results;
}
