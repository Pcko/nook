import React from "react";
import {motion} from "framer-motion";
import {AIPageCreationIcon, EditorPageCreationIcon} from "../resources/DashboardIcons";
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
 * @param {Function} props.onChooseManual - Starts the manual creation flow (opens the optional meta step first).
 * @param {Function} props.onChooseAi - Starts the AI creation flow (opens the optional meta step first).
 * @returns {JSX.Element}
 */
function PageCreationChooseStep({
    closeForm,
    pageName,
    setPageName,
    onChooseManual,
    onChooseAi,
}) {
    const maxNameLength = 50;

    return (
        <motion.div
            animate={{opacity: 1, y: 0, scale: 1}}
            className="page-creation-window"
            exit={{opacity: 0, y: 8, scale: 0.98}}
            initial={{opacity: 0, y: 8, scale: 0.98}}
            transition={{duration: 0.2, ease: "easeOut"}}
        >
            <FormTopBar onClick={closeForm} title="Create a new page"/>

            <form className="mt-3" onSubmit={(e) => {
                e.preventDefault();
                onChooseManual();
            }}>
                <p className="text-text-subtle mb-4 text-small">
                    Enter a name for your new page below. This will be used for the URL and navigation.
                </p>

                <label
                    className="block mb-2 font-medium text-small text-text"
                    htmlFor="pageName"
                >
                    Page Name
                </label>

                <input
                    className="w-full h-[48px] px-3 pt-1 border-2 border-ui-border rounded-[6px] bg-website-bg text-small text-text placeholder-text-subtle
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    id="pageName"
                    maxLength={maxNameLength}
                    minLength={2}
                    name="pageName"
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="Example: MyFirstPageWithNook"
                    required
                    type="text"
                    value={pageName}
                />

                <div className="flex items-center justify-between mt-1 mb-6 gap-3">
                    <p className="text-small text-text-subtle">
                        {pageName.length}/{maxNameLength}
                    </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:gap-4 select-none">
                    <CreationOption
                        actionText="Start building →"
                        description="Take full control of the design process. Start from a blank canvas."
                        icon={<EditorPageCreationIcon className="w-14 h-14"/>}
                        onClick={onChooseManual}
                        title="Create a page yourself"
                    />
                    <CreationOption
                        actionText="Generate with AI →"
                        description="Describe your page and let AI build it for you."
                        icon={<AIPageCreationIcon className="w-14 h-14"/>}
                        onClick={onChooseAi}
                        title="Create a page using AI"
                    />
                </div>
            </form>
        </motion.div>
    );
}

export default PageCreationChooseStep;
