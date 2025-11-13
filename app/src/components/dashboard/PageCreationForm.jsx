import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "../context/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import {isInvalidStringForURL} from "../general/FormChecks";

import PageCreationChooseStep from "./page-creation-components/PageCreationChooseStep";

import PageService from "../../services/PageService";
import PagePromptingStep from "./page-creation-components/PagePromptingStep";
import AIService from "../../services/AIService";

/**
 *  All steps of the AI-Page-Creation process
 * @type {{CHOOSE: string, AI_PREVIEW: string, AI_CHAT: string}}
 */
const STEPS = {
    CHOOSE: 'choose', AI_CHAT: 'ai-chat', AI_PREVIEW: 'ai-preview'
};

function PageCreationForm({closeForm, pages, setPages}) {
    const [formData, setFormData] = useState({
        pageName: "",
        aiPrompt: '',
        aiPages: [],
        loading: false,
        loadingStep: 0,
        currentStep: STEPS.CHOOSE
    });

    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();
    const navigate = useNavigate();

    const GENERATED_PAGE_AMOUNT = 2;

    const updateFormData = (updates) => {
        setFormData(prev => ({...prev, ...updates}));
    };

    const handleFormSubmit = async (cause) => {
        const result = isInvalidStringForURL(formData.pageName);
        if (result) return showNotification("error", result);

        try {
            /**
             * Page that is not yet initialized => data is not set
             * @type {{name: string}}
             */
            const pageSkeleton = {name: formData.pageName};
            setPages((prev) => ({...prev, [pageSkeleton.name]: pageSkeleton}));

            if (cause === "self") {
                await PageService.createPage(formData.pageName);
                navigate(`/editor/${formData.pageName}`);
            } else {
                showNotification("success", "Page created.");
                closeForm();
            }
        } catch (err) {
            handleError(err);
        }
    };

    const handleAiButtonClick = () => {
        if (!formData.pageName || formData.pageName.length < 2) {
            return showNotification("error", "Enter a valid page name first.");
        }
        updateFormData({
            aiPrompt: "", aiResponse: "", currentStep: STEPS.AI_CHAT
        });
    };

    const handleAiPromptSubmit = async () => {
        if (!formData.aiPrompt.trim()) {
            return showNotification("error", "Enter a prompt.");
        }

        updateFormData({loading: true, loadingStep: 0, aiResponse: ""});

        try {
            const generatedPages = await generateAIPages();

            updateFormData({
                aiPages: generatedPages,
                loadingStep: GENERATED_PAGE_AMOUNT,
                currentStep: STEPS.AI_PREVIEW,
                loading: false
            });
        } catch (err) {
            console.error("Failed to generate pages:", err);
            handleError(err);
            updateFormData({loading: false});
        }
    };

    const generateAIPages = async () => {
        const generatedPages = [];
        let failCount = 1;

        for (let i = 0; i < GENERATED_PAGE_AMOUNT; i++) {
            const {response} = await AIService.queryAIStream({query: formData.aiPrompt});

            try {
                // Stitched together with given name and AI-ProjectData
                let stitchedPage;
                const parsedResponse = JSON.parse(response);

                updateFormData(prev => ({
                    loadingStep: prev.loadingStep + 1
                }));
                stitchedPage = {
                    name: formData.pageName, data: parsedResponse
                };
                generatedPages.push(stitchedPage);
            } catch (err) {
                console.log("FAIL TIMES", failCount)
                failCount++;
                i--;
            }
        }

        return generatedPages;
    };

    const handleSelectAiPage = async (selectedPage) => {
        try {
            updateFormData({loading: true});

            const page = await PageService.createPage(formData.pageName);
            const completePage = {...page, data: selectedPage.data};

            setPages(prev => ({...prev, [completePage.name]: completePage}));
            showNotification("success", "Page created via AI.");

            // Update to be sure the page is synced
            await PageService.updatePage(completePage);
            navigate(`/editor/${completePage.name}`, {state: {page: completePage}});
            closeForm();
        } catch (err) {
            handleError(err);
        } finally {
            updateFormData({loading: false});
        }
    };

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
                        loadingStep={formData.loadingStep}
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