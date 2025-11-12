import React from "react";
import {CrossIcon} from "../resources/DashboardIcons";
import GrapesPagePreview from "../GrapesPagePreview";

function PageCreationAIPreviewStep({closeForm, aiPages, handleSelectAiPage}) {
    return (
        <div className="bg-website-bg border-2 border-ui-border rounded-md w-full p-6 max-w-4xl mx-auto">
            <div className="flex items-center pb-3 border-b-2 border-ui-border mb-5">
                <h4 className="font-semibold">Choose your AI-generated page</h4>
                <button onClick={closeForm} className="ml-auto hover:text-primary transition-colors"
                        aria-label="Close form">
                    <CrossIcon/>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {Array.isArray(aiPages) &&
                    aiPages.map((page, i) => (
                        <GrapesPagePreview
                            key={i}
                            index={i}
                            page={page}
                            onSelect={() => handleSelectAiPage(page)}
                        />
                    ))}
            </div>
        </div>
    );
}

export default PageCreationAIPreviewStep;