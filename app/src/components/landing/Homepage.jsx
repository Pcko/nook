import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowUpTrayIcon,
    BookOpenIcon,
    ChartBarIcon,
    FolderOpenIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import ExampleImagePreview from "./ExampleImagePreview";

import slideshowIcon from "../../assets/resources/frontpage/slideshow-icon.png";
import slideshowSlogan from "../../assets/resources/frontpage/slideshow-slogan.png";

import cvImage from "./assets/cv.png";
import companyImage from "./assets/company.png";
import eventsImage from "./assets/events.png";

const sidebarItems = [
    { id: "overview", label: "Overview", icon: FolderOpenIcon },
    { id: "trailer", label: "Trailer", icon: GlobeAltIcon },
    { id: "examples", label: "Examples", icon: ChartBarIcon },
    { id: "faq", label: "FAQ", icon: BookOpenIcon },
];

const valueCards = [
    {
        title: "Fast onboarding",
        text: "From idea to first published page in just a few steps.",
    },
    {
        title: "Clear builder",
        text: "A focused editor without tool overload — ideal for teams and solo creators.",
    },
    {
        title: "Publish instantly",
        text: "When you're ready, push your page live with one click.",
    },
];

const steps = [
    {
        title: "Start a project",
        text: "Choose a page type and begin with a clean structure.",
    },
    {
        title: "Edit content",
        text: "Update text, components, and layout directly in the editor.",
    },
    {
        title: "Go live",
        text: "Publish immediately and share your page URL.",
    },
];

const examples = [
    {
        title: "Product landing page",
        description: "Feature communication with a strong conversion-focused CTA.",
        image: companyImage,
        tag: "Marketing",
    },
    {
        title: "Resume / portfolio",
        description: "Show projects, skills, and contact details on a clean page.",
        image: cvImage,
        tag: "Personal Brand",
    },
    {
        title: "Event / info page",
        description: "Launch a page quickly with agenda, highlights, and signup.",
        image: eventsImage,
        tag: "Events",
    },
];

function Homepage() {
    const trailerEmbedUrl = import.meta.env.VITE_TRAILER_EMBED_URL?.trim();
    const mainRef = React.useRef(null);

    const scrollToSection = React.useCallback((id) => {
        const container = mainRef.current;
        const target = document.getElementById(id);

        if (!container || !target) return;

        const topBar = container.querySelector("[data-topbar]");
        const topBarHeight = topBar ? topBar.getBoundingClientRect().height : 0;
        const extraOffset = 16;

        const targetTop =
            target.getBoundingClientRect().top -
            container.getBoundingClientRect().top +
            container.scrollTop;

        container.scrollTo({
            top: Math.max(0, targetTop - topBarHeight - extraOffset),
            behavior: "smooth",
        });

        window.history.replaceState(null, "", `#${id}`);
    }, []);

    React.useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (!hash) return;

        requestAnimationFrame(() => {
            scrollToSection(hash);
        });
    }, [scrollToSection]);

    return (
        <div className="h-full w-full bg-far-bg text-text">
            <div className="mx-auto box-border flex h-full w-[98%] min-h-0 flex-col py-3">
                <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-ui-border bg-ui-bg shadow-lg">
                    {/* Ambient brand glow */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

                    {/* Sidebar (app-like) */}
                    <aside className="hidden w-[280px] shrink-0 border-r border-ui-border bg-website-bg/80 lg:flex lg:flex-col">
                        <div className="flex items-center gap-3 border-b border-ui-border px-5 py-4">
                            <img src={slideshowIcon} alt="NOOK" className="h-9 w-9 rounded-md object-cover" />
                            <div>
                                <p className="text-small text-text-subtle">Product page</p>
                                <h6 className="font-semibold !text-text">NOOK</h6>
                            </div>
                        </div>

                        <nav className="p-3">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => scrollToSection(item.id)}
                                        className="mb-1 flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-text-subtle transition-colors hover:bg-ui-bg-selected hover:text-text"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-auto border-t border-ui-border p-4">
                            <Link to="/register" className="prim-btn flex w-full items-center justify-center gap-2">
                                Try NOOK
                                <ArrowUpTrayIcon className="h-4 w-4" />
                            </Link>
                            <Link to="/login" className="btn btn-landing mt-2 block w-full text-center">
                                Sign in
                            </Link>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main
                        ref={mainRef}
                        className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth"
                    >
                        {/* Window top bar (app-feel) */}
                        <div
                            data-topbar
                            className="sticky top-0 z-20 border-b border-ui-border bg-ui-bg/95 supports-[backdrop-filter]:bg-ui-bg/70 supports-[backdrop-filter]:backdrop-blur"
                        >
                            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-ui-border-selected" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-ui-border" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-ui-border" />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <Link to="/login" className="btn btn-landing w-full text-center !px-3 !py-1.5 sm:w-auto">
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="prim-btn mt-2 w-full text-center !px-3 !py-1.5 sm:mt-0 sm:ml-2 sm:w-auto"
                                    >
                                        Try now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                            {/* Overview / Hero */}
                            <section id="overview" className="grid gap-4 lg:grid-cols-12">
                                <div className="rounded-2xl border border-ui-border bg-website-bg p-5 lg:col-span-7 lg:p-7">
                                    <p className="text-small text-text-subtle">For potential users</p>
                                    <h1 className="mt-1 max-w-2xl">
                                        Decide in 2 minutes if NOOK fits your workflow.
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-text-subtle">
                                        NOOK is a focused website builder: less complexity, faster outcomes,
                                        and a clear path from idea to live page.
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <Link to="/register" className="prim-btn !m-0">
                                            Try now
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => scrollToSection("trailer")}
                                            className="btn btn-landing !m-0"
                                        >
                                            Watch trailer
                                        </button>
                                    </div>

                                    <div className="mt-6 grid gap-2 sm:grid-cols-3">
                                        <div className="rounded-[8px] border border-ui-border bg-ui-bg p-3">
                                            <p className="text-small font-semibold">No-code focus</p>
                                            <p className="text-small text-text-subtle">Get productive quickly</p>
                                        </div>
                                        <div className="rounded-[8px] border border-ui-border bg-ui-bg p-3">
                                            <p className="text-small font-semibold">Clear structure</p>
                                            <p className="text-small text-text-subtle">Less distraction</p>
                                        </div>
                                        <div className="rounded-[8px] border border-ui-border bg-ui-bg p-3">
                                            <p className="text-small font-semibold">Instant publishing</p>
                                            <p className="text-small text-text-subtle">Ship pages fast</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-ui-border bg-website-bg p-4 lg:col-span-5">
                                    <img
                                        src={slideshowSlogan}
                                        alt="NOOK preview"
                                        className="h-64 w-full rounded-xl border border-ui-border object-cover lg:h-full"
                                    />
                                </div>
                            </section>

                            {/* Value cards */}
                            <section className="mt-6 grid gap-3 md:grid-cols-3">
                                {valueCards.map((card) => (
                                    <article
                                        key={card.title}
                                        className="rounded-[8px] border border-ui-border bg-website-bg p-4"
                                    >
                                        <h6 className="font-semibold">{card.title}</h6>
                                        <p className="mt-2 text-small text-text-subtle">{card.text}</p>
                                    </article>
                                ))}
                            </section>

                            {/* Examples */}
                            <section id="examples" className="mt-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <h3>Examples</h3>
                                        <p className="text-small text-text-subtle">
                                            Typical pages you can build quickly with NOOK.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    {examples.map((example) => (
                                        <article
                                            key={example.title}
                                            className="overflow-hidden rounded-[8px] border border-ui-border bg-website-bg"
                                        >
                                            <ExampleImagePreview
                                                src={example.image}
                                                alt={example.title}
                                                fallbackSrc={slideshowIcon}
                                            />
                                            <div className="p-4">
                                                <span className="inline-block rounded-[6px] border border-ui-border bg-ui-bg px-2 py-1 text-tiny text-text-subtle">
                                                    {example.tag}
                                                </span>
                                                <h6 className="mt-3 font-semibold">{example.title}</h6>
                                                <p className="mt-2 text-small text-text-subtle">
                                                    {example.description}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            {/* Steps */}
                            <section className="mt-6 rounded-2xl border border-ui-border bg-website-bg p-5">
                                <div className="mb-4 flex items-center gap-2">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-text-subtle" />
                                    <h4>How NOOK works</h4>
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    {steps.map((step, index) => (
                                        <div
                                            key={step.title}
                                            className="rounded-[8px] border border-ui-border bg-ui-bg p-4"
                                        >
                                            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-ui-border text-small font-semibold">
                                                {index + 1}
                                            </div>
                                            <h6 className="font-semibold">{step.title}</h6>
                                            <p className="mt-2 text-small text-text-subtle">{step.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Trailer */}
                            <section
                                id="trailer"
                                className="mt-6 rounded-2xl border border-ui-border bg-website-bg p-5"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <h3>Trailer</h3>
                                        <p className="mt-1 text-small text-text-subtle">
                                            A short overview of the NOOK workflow.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection("examples")}
                                        className="btn btn-landing !m-0 !px-3 !py-1.5"
                                    >
                                        Go to examples
                                    </button>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-ui-border bg-ui-bg">
                                    {trailerEmbedUrl ? (
                                        <div className="aspect-video w-full">
                                            <iframe
                                                className="h-full w-full"
                                                src={trailerEmbedUrl}
                                                title="NOOK Trailer"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <video
                                            className="h-full w-full"
                                            controls
                                            preload="metadata"
                                            poster={slideshowSlogan}
                                        >
                                            <source src="/videos/nook-trailer.mp4" type="video/mp4" />
                                            Your browser does not support HTML5 video.
                                        </video>
                                    )}
                                </div>
                            </section>

                            {/* FAQ + CTA */}
                            <section id="faq" className="mt-6 grid gap-3 lg:grid-cols-12">
                                <div className="rounded-2xl border border-ui-border bg-website-bg p-5 lg:col-span-8">
                                    <h4>Frequently asked questions</h4>
                                    <div className="mt-4 space-y-3">
                                        <div className="rounded-[8px] border border-ui-border bg-ui-bg p-3">
                                            <p className="font-medium">Do I need prior experience?</p>
                                            <p className="mt-1 text-small text-text-subtle">
                                                No. NOOK is designed for a fast, no-code start.
                                            </p>
                                        </div>
                                        <div className="rounded-[8px] border border-ui-border bg-ui-bg p-3">
                                            <p className="font-medium">Can I publish immediately?</p>
                                            <p className="mt-1 text-small text-text-subtle">
                                                Yes. After editing, you can publish your page right away.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-ui-border bg-website-bg p-5 lg:col-span-4">
                                    <h5>Try NOOK</h5>
                                    <p className="mt-2 text-small text-text-subtle">
                                        Watch the trailer, check the examples, and start in the builder.
                                    </p>
                                    <div className="mt-4">
                                        <Link to="/register" className="prim-btn block w-full text-center">
                                            Try NOOK
                                        </Link>
                                        <Link to="/register" className="btn btn-landing mt-2 block w-full text-center">
                                            Create account
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Homepage;