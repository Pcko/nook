import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "../context/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import {isInvalidStringForURL} from "../general/FormChecks";

import PageCreationChooseStep from "./page-creation-components/PageCreationChooseStep";
import PagePromptingStep from "./page-creation-components/PagePromptingStep";

import PageService from "../../services/PageService";
import AIService from "../../services/AIService";

/**
 * All steps of the AI-Page-Creation process.
 * @readonly
 * @enum {string}
 */
const STEPS = {
    CHOOSE: "choose",
    AI_CHAT: "ai-chat",
    AI_PREVIEW: "ai-preview"
};

/**
 * PageCreationForm component handles multistep creation of pages,
 * including the choice between manual page-editing or ai-generation.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.closeForm - Function to close the creation modal.
 * @param {Function} props.setPages - Setter to update pages.
 * @returns {JSX.Element|null}
 */
function PageCreationForm({closeForm, setPages}) {
    /**
     * @typedef {Object} FormData
     * @property {string} pageName - The name of the new page.
     * @property {string} aiPrompt - The prompt for generating AI pages.
     * @property {Array<Object>} aiPages - List of generated AI page candidates.
     * @property {boolean} loading - Loading state for AI generation or saving.
     * @property {number} loadingStep - Current index in AI generation progress.
     * @property {string} currentStep - Current UI step key from STEPS.
     * @property {boolean} submitted - Prevents double creation of pages.
     */

    /** @type {[FormData, Function]} */
    const [formData, setFormData] = useState({
        pageName: "",
        aiPrompt: "",
        aiPages: [],
        loading: false,
        loadingStep: 0,
        currentStep: STEPS.CHOOSE,
        submitted: false,
    });

    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();
    const navigate = useNavigate();

    const GENERATED_PAGE_AMOUNT = 2;

    /**
     * Update form state.
     * @param {Partial<FormData>} updates
     */
    const updateFormData = (updates) => {
        setFormData((prev) => ({...prev, ...updates}));
    };

    /**
     * Submit handler for manual page creation.
     *
     * @param {"self"|"external"} cause - Determines whether to open the editor or just create silently.
     * @returns {Promise<void>}
     */
    const handleFormSubmit = async (cause) => {
        const result = isInvalidStringForURL(formData.pageName);
        if (result) return showNotification("error", result);

        if (formData.submitted) return;
        updateFormData({submitted: true});

        try {
            const pageSkeleton = {name: formData.pageName};
            setPages(prev => ({...prev, [pageSkeleton.name]: pageSkeleton}));

            if (cause === "self") {
                const newPage = await PageService.createPage(formData.pageName);
                showNotification("success", "Page created.");
                navigate(`/editor/${formData.pageName}`, {state: {page: newPage}});
            } else {
                closeForm();
            }
        } catch (err) {
            updateFormData({submitted: false});
            handleError(err);
        }
    };

    /**
     * Moves user into AI prompt mode.
     */
    const handleAiButtonClick = () => {
        if (!formData.pageName || formData.pageName.length < 2) {
            return showNotification("error", "Enter a valid page name first.");
        }

        updateFormData({
            aiPrompt: "",
            currentStep: STEPS.AI_CHAT
        });
    };

    /**
     * Sends AI prompt to backend and loads generated pages.
     * @returns {Promise<void>}
     */
    const handleAiPromptSubmit = async () => {
        if (!formData.aiPrompt.trim()) {
            return showNotification("error", "Enter a prompt.");
        }

        updateFormData({loading: true, loadingStep: 0});

        try {
            const generatedPages = await generateAIPages();

            updateFormData({
                aiPages: generatedPages,
                loadingStep: GENERATED_PAGE_AMOUNT,
                currentStep: STEPS.AI_PREVIEW,
                loading: false
            });
        } catch (err) {
            handleError(err);
            updateFormData({loading: false});
        }
    };

    /**
     * Generates multiple pages via AI.
     * Retries invalid JSON responses automatically.
     *
     * @returns {Promise<Array<{name: string, data: any}>>}
     */
    const generateAIPages = async () => {
        const generatedPages = [];
        let failCount = 1;

        for (let i = 0; i < GENERATED_PAGE_AMOUNT; i++) {
            const {response} = await AIService.getGeneratedPage({query: formData.aiPrompt});

            try {
                const parsedResponse = JSON.parse(response);

                updateFormData({loadingStep: formData.loadingStep + 1})
                generatedPages.push({
                    name: formData.pageName,
                    data: parsedResponse
                });
            } catch (err) {
                failCount++;
                i--;
            }
        }

        return generatedPages;
    };

    /**
     * Saves an AI-generated page and navigates to the editor.
     *
     * @param {{name: string, data: any}} selectedPage
     * @returns {Promise<void>}
     */
    const handleSelectAiPage = async (selectedPage) => {
        if (formData.submitted || formData.loading) return;

        updateFormData({submitted: true, loading: true});

        try {
            const page = await PageService.createPage(formData.pageName);
            const completePage = {...page, data: selectedPage.data};

            setPages(prev => ({...prev, [completePage.name]: completePage}));
            showNotification("success", "Page created via AI.");

            await PageService.updatePage(completePage);

            navigate(`/editor/${completePage.name}`, {
                state: {page: completePage}
            });

            closeForm();
        } catch (err) {
            updateFormData({submitted: false});
            handleError(err);
        } finally {
            updateFormData({loading: false});
        }
    };

    /**
     * Decides which step component should be rendered.
     *
     * @returns {JSX.Element|null}
     */
    const renderStep = () => {
        switch (formData.currentStep) {
            case STEPS.CHOOSE:
                return (
                    <PageCreationChooseStep
                        closeForm={closeForm}
                        pageName={formData.pageName}
                        setPageName={(name) => updateFormData({pageName: name})}
                        handleFormSubmit={handleFormSubmit}
                        handleAiButtonClick={handleAiButtonClick}
                    />
                );

            case STEPS.AI_CHAT:
            case STEPS.AI_PREVIEW:
                return (
                    <PagePromptingStep
                        closeForm={closeForm}
                        aiPrompt={formData.aiPrompt}
                        setAiPrompt={(value) => updateFormData({aiPrompt: value})}
                        loading={formData.loading}
                        handleAiPromptSubmit={handleAiPromptSubmit}
                        handleSelectAiPage={handleSelectAiPage}
                        aiPages={formData.aiPages}
                    />
                );

            default:
                return null;
        }
    };

    return renderStep();
}

export default PageCreationForm;