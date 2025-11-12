import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "../context/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import {isInvalidStringForURL} from "../general/FormChecks";

import PageCreationChooseStep from "./prompting-components/PageCreationChooseStep";
import PageCreationAIChatStep from "./prompting-components/PageCreationAIChatStep";
import PageCreationAIPreviewStep from "./prompting-components/PageCreationAIPreviewStep";

import page0 from './data/page-0.json';
import page1 from './data/page-1.json';
import PageService from "../../services/PageService";

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

    // Temporary for testing
    const localPages = [page0, page1];

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

        updateFormData({
            loading: true, loadingStep: 0, aiResponse: ""
        });

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

        for (let i = 0; i < localPages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = localPages[i]; // Request an ai hier
            updateFormData(prev => ({
                aiResponse: JSON.stringify(response), loadingStep: prev.loadingStep + 1
            }));

            const combinedPage = {
                name: formData.pageName, data: response
            };

            generatedPages.push(combinedPage);
        }

        return generatedPages;
    };

    const handleSelectAiPage = async (selectedPage) => {
        try {
            updateFormData({loading: true});

            const page = await PageService.createPage(formData.pageName);
            const completePage = {...page, data: selectedPage.data};

            setPages(prev => ({...prev, [page.name]: completePage}));

            showNotification("success", "Page created via AI.");
            console.log("Created page:", completePage);

            navigate(`/editor/${page.name}`);
            closeForm();
        } catch (err) {
            handleError(err);
        } finally {
            updateFormData({loading: false});
        }
    };

    const goToStep = (step) => {
        updateFormData({currentStep: step});
    };

    const renderStep = () => {
        switch (formData.currentStep) {
            case STEPS.CHOOSE:
                return (<PageCreationChooseStep
                    closeForm={closeForm}
                    pageName={formData.pageName}
                    setPageName={(name) => updateFormData({pageName: name})}
                    handleFormSubmit={handleFormSubmit}
                    handleAiButtonClick={handleAiButtonClick}
                />);
            case STEPS.AI_CHAT:
                return (<PageCreationAIChatStep
                    closeForm={closeForm}
                    aiPrompt={formData.aiPrompt}
                    setAiPrompt={(prompt) => updateFormData({aiPrompt: prompt})}
                    loading={formData.loading}
                    loadingStep={formData.loadingStep}
                    handleAiPromptSubmit={handleAiPromptSubmit}
                    onBack={() => goToStep(STEPS.CHOOSE)}
                />);
            case STEPS.AI_PREVIEW:
                return (<PageCreationAIPreviewStep
                    closeForm={closeForm}
                    aiPages={formData.aiPages}
                    handleSelectAiPage={handleSelectAiPage}
                    onBack={() => goToStep(STEPS.AI_CHAT)}
                    loading={formData.loading}
                />);
            default:
                return null;
        }
    };

    return renderStep();
}

export default PageCreationForm;