import {
    ArrowUpCircleIcon,
    BookOpenIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CodeBracketIcon,
    FolderOpenIcon,
    PencilSquareIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const GOOD_EXAMPLES = [
    "I need a website for my small coffee shop in Vienna.",
    "Create a personal portfolio website for a freelance photographer.",
    "Build a landing page for my yoga studio offering classes and workshops.",
];

const AVOID_EXAMPLES = [
    "Make me a website.",
    "Overly technical instructions (CSS, layouts, code, etc.).",
];

const HIGHLIGHTS = [
    "Services you offer",
    "Products you sell",
    "Your style or atmosphere",
];

const REFINE_EXAMPLES = [
    "Make it feel more modern.",
    "Use fewer images.",
    "Make the text more professional.",
    "Focus more on our products than our story.",
];

const BEST_PRACTICES = [
    "Be clear about what your business or idea is.",
    "Write naturally, like talking to a person.",
    "Mention what makes you special.",
    "Let the AI handle design and structure.",
    "Do not overthink layout or colors.",
    "Avoid technical instructions.",
];

const FEATURE_CARDS = [
    {
        title: "Prompt-to-site AI",
        description: "Describe the business, and NOOK generates structure, copy, and visuals.",
        icon: SparklesIcon,
    },
    {
        title: "Ai Assistant",
        description: "Remake or redesign sections or elements of the Page",
        icon: CodeBracketIcon,
    },
    {
        title: "Page Explorer",
        description: "Discover new Pages and share Ideas.",
        icon: FolderOpenIcon,
    },
    {
        title: "Visual Editor",
        description: "Refine text and sections without touching code.",
        icon: PencilSquareIcon,
    },
    {
        title: "Page Publishing",
        description: "Publish pages to the public and share them on the web",
        icon: ArrowUpCircleIcon,
    },
    {
        title: "Usage analytics",
        description: "Track activity and trends to understand momentum.",
        icon: ChartBarIcon,
    },
];

const PROMPT_TEMPLATE = [
    "We are a [business type] in [location].",
    "We offer [services/products] for [audience].",
    "The website should feel [tone] and make it easy to [primary action].",
].join("\n");

const EXAMPLE_PROMPT = [
    "I own a small specialty coffee shop in Vienna.",
    "We serve high-quality espresso, homemade pastries, and want a cozy place for people to relax or work.",
    "I want a simple, clean website that shows what we offer and how to contact us.",
].join("\n");

/**
 * Renders the user guide component.
 * @returns {JSX.Element} The rendered user guide component.
 */
function UserGuide() {
    return (
        <div className="space-y-8">
            <header className="rounded-[12px] border border-ui-border bg-website-bg p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                        <div
                            className="inline-flex items-center gap-2 rounded-[999px] border border-ui-border bg-ui-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                            <BookOpenIcon className="h-4 w-4"/>
                            User Guide
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold text-text">
                            Creating High-Quality Websites with NOOK
                        </h2>
                        <p className="mt-3 text-base text-text-subtle">
                            Write better prompts and interact effectively with the NOOK AI to generate clean,
                            professional websites. No technical or design knowledge required.
                        </p>
                    </div>

                    <div className="w-full rounded-[10px] border border-ui-border bg-ui-bg p-4 lg:w-[320px]">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                            Quick checklist
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-text-subtle">
                            <li className="flex items-start gap-2">
                                <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                What kind of website you want.
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                Who it is for.
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                What the website should communicate.
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <section className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                            Features
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-text">
                            Core product highlights
                        </h3>
                        <p className="mt-2 text-sm text-text-subtle">
                            Compact overview for the interim presentation.
                        </p>
                    </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURE_CARDS.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                className="flex items-start gap-3 rounded-[10px] border border-ui-border bg-ui-bg p-4"
                                key={feature.title}
                            >
                                <span
                                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-ui-border bg-website-bg text-primary">
                                    <Icon className="h-5 w-5"/>
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-text">
                                        {feature.title}
                                    </p>
                                    <p className="mt-1 text-xs text-text-subtle">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        1. Describe your business or idea
                    </p>
                    <p className="mt-3 text-base text-text">
                        Briefly explain who you are and what you do. Write naturally, like you are explaining it to
                        another person.
                    </p>
                    <div
                        className="mt-4 rounded-[8px] border border-ui-border bg-ui-bg px-3 py-2 text-sm text-text-subtle">
                        Example: "I run a specialty coffee shop. We focus on high-quality espresso, homemade pastries,
                        and a cozy atmosphere."
                    </div>
                    <p className="mt-3 text-sm text-text-subtle">
                        This helps the AI choose the right structure, matching images, and suitable tone.
                    </p>
                </div>

                <div className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        2. Use this prompt template
                    </p>
                    <div
                        className="mt-4 whitespace-pre-line rounded-[8px] border border-ui-border bg-ui-bg px-3 py-3 text-sm text-text-subtle">
                        {PROMPT_TEMPLATE}
                    </div>
                    <p className="mt-3 text-sm text-text-subtle">
                        Keep it short. 2-5 sentences are enough.
                    </p>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Example prompt
                    </p>
                    <div
                        className="mt-4 whitespace-pre-line rounded-[8px] border border-ui-border bg-ui-bg px-3 py-3 text-sm text-text-subtle">
                        {EXAMPLE_PROMPT}
                    </div>
                    <p className="mt-3 text-sm text-text-subtle">
                        Clear intent beats technical detail.
                    </p>
                </div>

                <div className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Good examples
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-text-subtle">
                        {GOOD_EXAMPLES.map((example) => (
                            <li className="flex items-start gap-2" key={example}>
                                <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                {example}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Avoid
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-text-subtle">
                        {AVOID_EXAMPLES.map((example) => (
                            <li className="flex items-start gap-2" key={example}>
                                <span className="mt-[6px] h-2 w-2 rounded-full bg-text-subtle"/>
                                {example}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        3. Mention what you want to highlight (optional)
                    </p>
                    <p className="mt-3 text-sm text-text-subtle">
                        You do not need to list everything. Just mention the most important things.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-text">
                        {HIGHLIGHTS.map((item) => (
                            <li className="flex items-start gap-2" key={item}>
                                <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        4. Refine after generation
                    </p>
                    <p className="mt-3 text-sm text-text-subtle">
                        After the website is generated, improve it with short requests like these:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-text">
                        {REFINE_EXAMPLES.map((item) => (
                            <li className="flex items-start gap-2" key={item}>
                                <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="rounded-[12px] border border-ui-border bg-website-bg p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-subtle">
                            Summary - Best practices
                        </p>
                        <ul className="mt-4 grid gap-2 text-sm text-text-subtle lg:grid-cols-2">
                            {BEST_PRACTICES.map((item) => (
                                <li className="flex items-start gap-2" key={item}>
                                    <CheckCircleIcon className="mt-[3px] h-4 w-4 text-primary"/>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div
                        className="rounded-[10px] border border-ui-border bg-ui-bg px-4 py-3 text-sm text-text-subtle lg:max-w-[320px]">
                        <p className="font-semibold text-text">Final tip</p>
                        <p className="mt-2">
                            If you can explain your idea in 2-5 sentences, you are doing it right. The AI is designed to
                            do the rest.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserGuide;
