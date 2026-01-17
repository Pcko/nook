import crypto from "crypto";
import { Request } from "express";

function getVisitorHash(req: Request) {
    const forwarded = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
    const ip = forwarded || req.ip || "";
    const userAgent = String(req.headers["user-agent"] || "");
    return crypto.createHash("sha256").update(`${ip}|${userAgent}`).digest("hex");
}

function getReferrerUrl(req: Request) {
    const ref = String(req.headers.referer || req.headers.referrer || "");
    if (!ref) return "";
    try {
        return new URL(ref).toString();
    } catch {
        return "";
    }
}

export { getVisitorHash, getReferrerUrl };