import React from "react";
import FormTopBar from "./FormTopBar";
import GrapesPagePreview from "./GrapesPagePreview";
import {AIIcon} from "../resources/DashboardIcons";

function PageCreationAICombinedStep({
                                        closeForm,
                                        aiPrompt,
                                        setAiPrompt,
                                        loading,
                                        loadingStep,
                                        handleAiPromptSubmit,
                                        aiPages,
                                        handleSelectAiPage,
                                    }) {

    const LoadingBar = () => (
        <div className="mb-4 mt-4">
            <div className="text-sm mb-1 font-semibold">
                Loading progress: {loadingStep}/2
            </div>
            <div className="w-full bg-gray-300 rounded h-3 overflow-hidden">
                <div
                    className="bg-primary h-3 transition-all duration-500"
                    style={{width: `${(loadingStep / 2) * 100}%`}}
                />
            </div>
        </div>
    );

    const isLoadingComplete = loadingStep >= 2 && Array.isArray(aiPages) && aiPages.length > 0;

    return (
        <div
            className="page-creation-window p-4 rounded-[5px] mx-auto bg-website-bg border-2 border-ui-border">
            <FormTopBar onClick={closeForm} title={"AI Page Generator"}/>

            {/* Prompt input area */}
            <div className="relative mt-4">
                <input
                    type="text"
                    className={`w-full border border-ui-border rounded-[5px] pl-4 pr-14 py-3
                     bg-ui-bg text-text placeholder-text-subtle
                     focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder="e.g. A clean portfolio landing page for a minimalist architect..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={loading}
                />

                <button
                    onClick={handleAiPromptSubmit}
                    disabled={loading || !aiPrompt.trim()}
                    className={`absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center w-10 h-10`}
                >
                    {loading ? (
                        <div
                            className="w-4 h-4 border-2 border-t-transparent border-text-on-primary rounded-full animate-spin"/>
                    ) : (
                        <AIIcon size={40} colorStart={aiPrompt.length === 0 ? undefined : "#D071D5"}
                                colorEnd={aiPrompt.length === 0 ? undefined : "#666BE2"}
                                strokeColor={aiPrompt.length === 0 ? undefined : "#575BC7"}/>
                    )}
                </button>
            </div>

            {loading && <LoadingBar className={"mt-4"}/>}

            {/* Only show previews after loading finishes */}
            {isLoadingComplete && (
                <div className="mt-8 border-t-2 border-ui-border pt-6">
                    <div className="grid grid-cols-2 gap-6">
                        {aiPages.map((page, i) => (
                            <GrapesPagePreview
                                key={i}
                                index={i}
                                page={page}
                                onSelect={() => handleSelectAiPage(page)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PageCreationAICombinedStep;