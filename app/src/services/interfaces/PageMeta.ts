/**
 * @file PageMeta.ts
 *
 * Page-level metadata used to steer AI generation and keep branding/content consistent.
 *
 * Notes:
 * - All fields are optional to support progressive onboarding.
 * - Values are intentionally kept simple (mostly strings), because they map directly to form inputs.
 */

/**
 * Page-level metadata.
 */
export interface PageMeta {
    /**
     * Tracks whether the Meta Wizard was already shown/closed for this page.
     * If true, the wizard will not auto-open again.
     */
    wizardSeen?: boolean;

    /**
     * If true, the user explicitly skipped the wizard (or dismissed it without entering data).
     */
    skipped?: boolean;

    /** Preferred page language. */
    language?: "de" | "en" | "es" | "fr" | "";

    /** Industry category (predefined options). */
    industry?: string;
    /** Free-form industry value when `industry` is "other". */
    industryOther?: string;

    /** Primary goal of the website. */
    websiteGoal?: "leads" | "bookings" | "shop" | "portfolio" | "info" | "";

    /** Brand / company name. */
    brandName?: string;
    /** Short tagline or slogan. */
    tagline?: string;

    /** Tone of voice (free-form to keep UX flexible). */
    tone?: string;
    /** Keywords describing brand or style. */
    keywords?: string[];

    /** Services / offering summary. */
    services?: string;

    /** Primary call-to-action text. */
    ctaText?: string;

    /** Contact details. */
    email?: string;
    phone?: string;
    location?: string;

    /** Address formatting preference (e.g. inline, multi-line). */
    addressForm?: string;

    /** Content guardrails (do's / don'ts). */
    dos?: string;
    donts?: string;

    /** Target audience information. */
    audienceType?: string;
    audienceRegion?: string;
    audienceNotes?: string;
}
