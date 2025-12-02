import React from "react";
import {motion} from "framer-motion";
import {AIPageCreationIcon, EditorPageCreationIcon,} from "../resources/DashboardIcons";
import FormTopBar from "./FormTopBar";
import {CreationOption} from "./CreationOption";

/**
 * PageCreationChooseStep component
 *
 * Renders the initial step for creating a page. The user can enter a page name
 * and choose whether to create a page manually or using AI.
 *
 * @param {Object} props
 * @param {Function} props.closeForm - Callback to close the form modal.
 * @param {string} props.pageName - Current value of the page name input.
 * @param {Function} props.setPageName - Setter for updating the page name.
 * @param {Function} props.handleFormSubmit - Handler for manual page creation. Receives `"self"`.
 * @param {Function} props.handleAiButtonClick - Handler for AI-based page creation.
 * @returns {JSX.Element}
 */
function PageCreationChooseStep({
                                    closeForm,
                                    pageName,
                                    setPageName,
                                    handleFormSubmit,
                                    handleAiButtonClick,
                                }) {
    const maxNameLength = 50;

    return (
        <motion.div
            className="page-creation-window max-w-xl mx-auto p-4 md:p-5 rounded-[8px] bg-website-bg border border-ui-border shadow-sm"
            initial={{opacity: 0, y: 8, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 8, scale: 0.98}}
            transition={{duration: 0.2, ease: "easeOut"}}
        >
            <FormTopBar onClick={closeForm} title="Create a new page"/>

            <form
                className="mt-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleFormSubmit("self");
                }}
            >
                <p className="text-text-subtle mb-4 text-small">
                    Enter a name for your new page below. This will be used for the URL and navigation.
                </p>

                <label
                    htmlFor="pageName"
                    className="block mb-2 font-medium text-small text-text"
                >
                    Page Name
                </label>

                <input
                    type="text"
                    id="pageName"
                    name="pageName"
                    required
                    minLength={2}
                    maxLength={maxNameLength}
                    className="w-full h-[48px] px-3 pt-1 border-2 border-ui-border rounded-[6px] bg-website-bg text-small text-text placeholder-text-subtle
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    onChange={(e) => setPageName(e.target.value)}
                    value={pageName}
                    placeholder="Example: MyFirstPageWithNook"
                />

                <p className="text-small text-text-subtle mt-1 mb-6">
                    {pageName.length}/{maxNameLength}
                </p>

                <div className="flex flex-col gap-3 md:flex-row md:gap-4 select-none">
                    <CreationOption
                        icon={<EditorPageCreationIcon className="w-14 h-14"/>}
                        title="Create a page yourself"
                        description="Take full control of the design process. Start from a blank canvas."
                        actionText="Start building →"
                        onClick={() => handleFormSubmit("self")}
                    />
                    <CreationOption
                        icon={<AIPageCreationIcon className="w-14 h-14"/>}
                        title="Create a page using AI"
                        description="Describe your page and let AI build it for you."
                        actionText="Generate with AI →"
                        onClick={handleAiButtonClick}
                    />
                </div>
            </form>
        </motion.div>
    );
}

export default PageCreationChooseStep;
