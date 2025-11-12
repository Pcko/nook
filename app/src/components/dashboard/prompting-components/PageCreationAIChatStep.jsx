import React from "react";
import FormTopBar from "./FormTopBar";
import { ArrowDownRightIcon } from "@heroicons/react/24/outline";
import {AIIcon} from "../resources/DashboardIcons";

function PageCreationAIChatStep({
                                    closeForm,
                                    aiPrompt,
                                    setAiPrompt,
                                    loading,
                                    loadingStep,
                                    handleAiPromptSubmit,
                                }) {
    const LoadingBar = () => (
        <div className="mt-6 mb-2">
            <div className="text-xs mb-1 font-semibold text-text-subtle">
                Generating step {loadingStep}/2
            </div>
            <div className="w-full bg-ui-border rounded-full h-2 overflow-hidden">
                <div
                    className="bg-primary h-2 transition-all duration-500"
                    style={{ width: `${(loadingStep / 2) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="page-creation-window p-5 transition-all duration-300">
            <FormTopBar onClick={closeForm} title={"Create a new page with AI"} />
            <label className="text-text-subtle">Describe your ideal website, and let our AI generate two unique designs for you.</label>
            <div className="relative mt-4">
                <input
                    type="text"
                    className={`w-full border border-ui-border rounded-xl pl-4 pr-14 py-3
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
                        <div className="w-4 h-4 border-2 border-t-transparent border-text-on-primary rounded-full animate-spin" />
                    ) : (
                        <AIIcon size={40} colorStart={aiPrompt.length === 0? undefined : "#D071D5"} colorEnd={aiPrompt.length === 0? undefined : "#666BE2"} strokeColor={aiPrompt.length === 0? undefined : "#575BC7"}/>
                    )}
                </button>
            </div>

            {loading && <LoadingBar />}
        </div>
    );
}

export default PageCreationAIChatStep;
