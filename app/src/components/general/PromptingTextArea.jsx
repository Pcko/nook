import {motion} from "framer-motion";
import {AIIcon} from "../dashboard/resources/DashboardIcons";
import React from "react";
import PagePromptingStep from "../dashboard/page-creation-components/PagePromptingStep";

/**
 * @param {boolean} loading - A Boolean that disables the submit button if true
 * @param {string | readonly string[] | number} prompt - The prompt the users writes
 * @param setPrompt - The Setter of the written prompt
 * @param placeholder - The placeholder of the input field
 * @param {React.MouseEventHandler<HTMLButtonElement>} handleSubmit - A function which is called upon submitting
 * @returns {React.JSX.Element}
 */
function PromptingTextArea({loading, prompt, setPrompt, handleSubmit, placeholder}) {
    return (
        <>
            <textarea
                className={`prompt-textarea w-full border-2 border-ui-border rounded-[6px] pl-4 pr-14 py-3
                bg-ui-bg text-text placeholder-text-subtle text-small
                focus:outline-none focus:border-primary transition-all 
                duration-200 resize-none min-h-[72px]
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                placeholder={placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />

            {/* Submit button (AI icon) */}
            <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className={`absolute inset-y-0 my-auto right-2 flex items-center justify-center
                            w-9 h-9 rounded-2xl transition-all duration-150
                            ${
                    loading || !prompt.trim()
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-ui-bg hover:border-primary hover:shadow-sm"
                }`}
                aria-label="Generate page from prompt"
            >
                <motion.div
                    whileTap={
                        loading || !prompt.trim()
                            ? undefined
                            : {scale: 0.95}
                    }
                    className="flex items-center justify-center w-full h-full"
                >
                    <AIIcon
                        size={32}
                        colorStart={prompt.length === 0 ? "#CECECE" : undefined}
                        colorMid={prompt.length === 0 ? "#CECECE" : undefined}
                        colorEnd={prompt.length === 0 ? "#CECECE" : undefined}
                        strokeColor={prompt.length === 0 ? "#CECECE" : undefined}
                    />
                </motion.div>
            </motion.button>
        </>
    );
}

export default PromptingTextArea;