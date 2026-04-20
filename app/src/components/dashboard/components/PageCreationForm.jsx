import grapesjs from "grapesjs";
import React, {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import AIService from "../../../services/AIService";
import PageService from "../../../services/PageService";
import {isInvalidStringForURL} from "../../general/FormChecks";
import useErrorHandler from "../../logging/ErrorHandler";
import {useMetaNotify} from "../../logging/MetaNotifyHook";
import {useMetaWizardState} from "../../meta-wizard/useMetaWizard";

import PageCreationChooseStep from "./page-creation/PageCreationChooseStep";
import PageCreationMetaStep from "./page-creation/PageCreationMetaStep";
import PagePromptingStep from "./page-creation/PagePromptingStep";


/**
 * All steps of the AI-Page-Creation process.
 * @readonly
 * @enum {string}
 */
const STEPS = {
    CHOOSE: "choose",
    META: "meta",
    AI_CHAT: "ai-chat",
    AI_PREVIEW: "ai-preview",
};

/**
 *
 * @param formData
 * @param pageMeta
 */
const buildArtifactSnapshot = (formData, pageMeta) => ({
    timestamp: Date.now(),
    pageName: formData.pageName,
    aiPrompt: formData.aiPrompt,
    currentStep: formData.currentStep === STEPS.AI_PREVIEW ? STEPS.AI_CHAT : formData.currentStep,
    pageMeta,
});


/**
 * Renders the page creation form component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.closeForm - The close form value.
 * @param {any} props.setPages - The set pages value.
 * @param {any} props.fallbackFormData - The fallback form data value.
 * @returns {JSX.Element} The rendered page creation form component.
 */
function PageCreationForm({closeForm, setPages, fallbackFormData = undefined}) {
    /**
     * @typedef {Object} FormData
     * @property {string} pageName
     * @property {string} aiPrompt
     * @property {Array<Object>} aiPages
     * @property {boolean} loading
     * @property {number} loadingStep
     * @property {string} currentStep
     * @property {boolean} submitted
     * @property {Object|null} pageMeta
     * @property {Object|null} createdPage
     */

    const [formData, setFormData] = useState(() => {
        const fb = fallbackFormData || {};
        return {
            pageName: fb.pageName || "",
            aiPrompt: fb.aiPrompt || "",
            aiPages: Array.isArray(fb.aiPages) ? fb.aiPages : [],
            loading: false,
            loadingStep: 0,
            currentStep: fb.currentStep || STEPS.CHOOSE,
            submitted: false,
            createdPage: fb.createdPage || null,
        };
    });

    const metaWizard = useMetaWizardState((fallbackFormData && fallbackFormData.pageMeta) || {});
    const [metaFlow, setMetaFlow] = useState({mode: null, returnStep: STEPS.CHOOSE});
    const navigate = useNavigate();

    const baseMeta = useMemo(
        () => ({
            feature: "pages",
            component: "PageCreationForm",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const GENERATED_PAGE_AMOUNT = 2;

    /**
     *
     * @param updates
     */
    const updateFormData = (updates) => {
        setFormData((prev) => ({...prev, ...updates}));
    };

    /**
 * Handles the ensure page created operation.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const ensurePageCreated = async () => {
        if (formData.createdPage) return formData.createdPage;

        const result = isInvalidStringForURL(formData.pageName);
        if (result) {
            notify(
                "error",
                result,
                {step: formData.currentStep, pageName: formData.pageName},
                "validation"
            );
            return null;
        }

        const created = await PageService.createPage(formData.pageName, metaWizard.meta || {});

        // Backend may rename on duplicates; keep using its name.
        updateFormData({pageName: created.name, createdPage: created});

        setPages((prev) => ({...prev, [created.name]: created}));
        return created;
    };

    /**
     *
     * @param cause
     * @param metaOverride
     */
    const handleFormSubmit = async (cause, metaOverride = undefined) => {
        const result = isInvalidStringForURL(formData.pageName);
        if (result) {
            return notify(
                "error",
                result,
                {step: "manual-submit", pageName: formData.pageName},
                "validation"
            );
        }

        if (formData.submitted) return;
        updateFormData({submitted: true});

        try {
            const metaToUse = metaOverride ?? metaWizard.meta ?? {};
            const created = await PageService.createPage(formData.pageName, metaToUse);

            const completePage = {
                ...created,
                pageMeta: created.pageMeta ?? metaToUse ?? null,
            };

            setPages((prev) => ({...prev, [completePage.name]: completePage}));

            notify(
                "info",
                "Page created.",
                {step: "manual-submit", pageName: completePage.name, cause: "self"},
                "submit"
            );

            if (cause === "self") {
                navigate(`/editor/${encodeURIComponent(completePage.name)}`, {
                    state: {page: completePage},
                });
            } else {
                closeForm();
            }
        } catch (err) {
            updateFormData({submitted: false});
            handleError(err, {
                fallbackMessage: "Page creation failed.",
                meta: {step: "manual-submit", pageName: formData.pageName},
            });
        }
    };

    /**
 * Handles the start ai flow operation.
 */
    const startAiFlow = () => {
        const result = isInvalidStringForURL(formData.pageName);
        if (result || formData.pageName.length < 2) {
            return notify(
                "error",
                "Enter a valid page name first.",
                {step: "choose", pageName: formData.pageName},
                "validation"
            );
        }

        setMetaFlow({mode: "ai", returnStep: STEPS.CHOOSE});
        updateFormData({aiPrompt: "", aiPages: [], currentStep: STEPS.META});
    };

    /**
 * Handles the start manual flow operation.
 */
    const startManualFlow = () => {
        const result = isInvalidStringForURL(formData.pageName);
        if (result || formData.pageName.length < 2) {
            return notify(
                "error",
                "Enter a valid page name first.",
                {step: "choose", pageName: formData.pageName},
                "validation"
            );
        }

        setMetaFlow({mode: "manual", returnStep: STEPS.CHOOSE});
        updateFormData({aiPrompt: "", aiPages: [], currentStep: STEPS.META});
    };

    /**
     *
     * @param reason
     * @param incoming
     */
    const handleMetaStepClose = async (reason, incoming) => {
        const nextMeta = metaWizard.applyClose(reason, incoming || {});

        if (reason === "dismiss") {
            updateFormData({currentStep: metaFlow.returnStep || STEPS.CHOOSE});
            setMetaFlow({mode: null, returnStep: STEPS.CHOOSE});
            return;
        }

        // On skip/complete, proceed with the selected flow.
        if (metaFlow.mode === "ai") {
            updateFormData({currentStep: STEPS.AI_CHAT});
        } else if (metaFlow.mode === "manual") {
            await handleFormSubmit("self", nextMeta);
        } else {
            updateFormData({currentStep: metaFlow.returnStep || STEPS.CHOOSE});
        }

        setMetaFlow({mode: null, returnStep: STEPS.CHOOSE});
    };

    /**
     *
     * @param pageNameForMeta
     */
    const generateAIPages = async (pageNameForMeta) => {
        const generatedPages = [];

        for (let i = 0; i < GENERATED_PAGE_AMOUNT; i++) {
            const {response} = await AIService.getGeneratedPage({
                query: formData.aiPrompt,
                pageName: pageNameForMeta,
            });

            try {
                const generatedPageContainer = document.createElement("div");
                generatedPageContainer.innerHTML = response;

                const editor = grapesjs.init({
                    fromElement: true,
                    container: generatedPageContainer,
                });

                const parsedResponse = editor.getProjectData();
                setFormData((prev) => ({...prev, loadingStep: prev.loadingStep + 1}));
                generatedPages.push({name: pageNameForMeta, data: parsedResponse});
            } catch (err) {
                i--;
            }
        }

        return generatedPages;
    };

    /**
 * Handles ai prompt submit.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const handleAiPromptSubmit = async () => {
        if (!formData.aiPrompt.trim()) {
            return notify(
                "error",
                "Enter a prompt.",
                {step: "ai-chat", pageName: formData.pageName},
                "validation"
            );
        }

        updateFormData({loading: true, loadingStep: 0});

        try {
            // Create page first (stores metadata in DB), then generate using pageName.
            const created = await ensurePageCreated();
            if (!created) {
                updateFormData({loading: false});
                return;
            }

            const generatedPages = await generateAIPages(created.name);

            updateFormData({
                aiPages: generatedPages,
                loadingStep: GENERATED_PAGE_AMOUNT,
                currentStep: STEPS.AI_PREVIEW,
                loading: false,
            });
        } catch (err) {
            handleError(err, {
                fallbackMessage: "AI-Prompting failed.",
                meta: {step: "ai-generate", pageName: formData.pageName},
            });
            updateFormData({loading: false});
        }
    };

    /**
     *
     * @param selectedPage
     */
    const handleSelectAiPage = async (selectedPage) => {
        if (formData.submitted || formData.loading) return;
        updateFormData({submitted: true, loading: true});

        try {
            const created = await ensurePageCreated();
            if (!created) {
                updateFormData({submitted: false, loading: false});
                return;
            }

            const completePage = {
                ...created,
                data: selectedPage.data,
                pageMeta: created.pageMeta ?? metaWizard.meta ?? null,
            };

            setPages((prev) => ({...prev, [completePage.name]: completePage}));

            notify(
                "info",
                "Page created via AI.",
                {step: "ai-preview", pageName: completePage.name},
                "submit"
            );

            await PageService.updatePage(completePage);

            navigate(`/editor/${encodeURIComponent(completePage.name)}`, {
                state: {page: completePage},
            });

            closeForm();
        } catch (err) {
            updateFormData({submitted: false});
            handleError(err, {
                fallbackMessage: "AI-Page selection failed.",
                meta: {step: "ai-save", pageName: formData.pageName},
            });
            sessionStorage.setItem(
                `artifact`,
                JSON.stringify(buildArtifactSnapshot(formData, metaWizard.meta))
            );
        } finally {
            updateFormData({loading: false});
        }
    };

    /**
 * Handles the render step operation.
 */
    const renderStep = () => {
        switch (formData.currentStep) {
            case STEPS.CHOOSE:
                return (
                    <PageCreationChooseStep
                        closeForm={closeForm}
                        onChooseAi={startAiFlow}
                        onChooseManual={startManualFlow}
                        pageName={formData.pageName}
                        setPageName={(name) => updateFormData({pageName: name})}
                    />
                );

            case STEPS.META:
                return (
                    <PageCreationMetaStep
                        closeForm={closeForm}
                        initialValue={metaWizard.meta}
                        onBack={() => {
                            updateFormData({currentStep: metaFlow.returnStep || STEPS.CHOOSE});
                            setMetaFlow({mode: null, returnStep: STEPS.CHOOSE});
                        }}
                        onWizardClose={handleMetaStepClose}
                        stepLabel={"Step 1 of 3"}
                    />
                );

            case STEPS.AI_CHAT:
            case STEPS.AI_PREVIEW:
                return (
                    <PagePromptingStep
                        aiPages={formData.aiPages}
                        aiPrompt={formData.aiPrompt}
                        closeForm={closeForm}
                        handleAiPromptSubmit={handleAiPromptSubmit}
                        handleSelectAiPage={handleSelectAiPage}
                        loading={formData.loading}
                        setAiPrompt={(value) => updateFormData({aiPrompt: value})}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>{renderStep()}</>
    );
}

export default PageCreationForm;
