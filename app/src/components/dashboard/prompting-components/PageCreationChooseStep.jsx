import React from "react";
import {AIPageCreationIcon, EditorPageCreationIcon} from "../resources/DashboardIcons";
import FormTopBar from "./FormTopBar";

function PageCreationChooseStep({closeForm, pageName, setPageName, handleFormSubmit, handleAiButtonClick}) {
    const maxNameLength = 50;

    return (
        <div className="page-creation-window">
            <FormTopBar onClick={closeForm} title={"Create a new Page!"}/>

            <form>
                <p className="text-text-subtle mb-4">
                    Enter a name for your new page below. This will be used for the URL and navigation.
                </p>

                <label htmlFor="pageName" className="block mb-2 font-medium text-sm">
                    Page Name
                </label>

                <input
                    type="text"
                    id="pageName"
                    name="pageName"
                    required
                    minLength={2}
                    maxLength={maxNameLength}
                    className="w-full h-[48px] p-3 border-2 border-ui-border rounded-[5px] focus:outline-none focus:ring-2 focus:ring-primary transition"
                    onChange={(e) => setPageName(e.target.value)}
                    value={pageName}
                    placeholder="Example: MyFirstPageWithNook"
                />

                <p className="text-sm text-text-subtle mt-1 mb-6">
                    {pageName.length}/{maxNameLength}
                </p>

                <div className="flex gap-4 select-none">
                    <CreationOption
                        icon={<EditorPageCreationIcon className="w-14 h-14"/>}
                        title="Create a page yourself"
                        description="Take full control of the design process. Start from a blank canvas."
                        actionText="Start Building →"
                        onClick={() => handleFormSubmit('self')}
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
        </div>
    );
}

const CreationOption = ({icon, title, description, actionText, onClick}) => (
    <div
        className="flex-1 p-4 border-2 border-ui-border rounded-md hover:shadow-md transition cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h6 className="font-semibold m-0">{title}</h6>
        </div>
        <p className="text-text-subtle">{description}</p>
        <p className="block mt-4 text-primary font-semibold text-right">{actionText}</p>
    </div>
);

export default PageCreationChooseStep;