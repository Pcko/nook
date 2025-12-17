import {motion} from "framer-motion";
import React from "react";

import {AIIcon} from "../dashboard/resources/DashboardIcons";

/**
 * @param {boolean} loading - A Boolean that disables the submit button if true
 * @param {string | readonly string[] | number} prompt - The prompt the users writes
 * @param {function} setPrompt - The Setter of the written prompt
 * @param {string} placeholder - The placeholder of the input field
 * @param {React.MouseEventHandler<HTMLButtonElement>} handleSubmit - A function which is called upon submitting
 * @returns {React.JSX.Element}
 */
function PromptingTextArea({loading, prompt, setPrompt, handleSubmit, placeholder}) {
    /**
     * Colour of the AI-Button if it's disabled.
     * @type {string}
     */
    const inactiveColour = "#CECECE";

    return (
        <>
            <textarea
                className={`prompt-textarea w-full border-2 border-ui-border rounded-[6px] pl-4 pr-14 py-3
                bg-ui-bg text-text placeholder-text-subtle text-small
                focus:outline-none focus:border-primary transition-all 
                duration-200 resize-none min-h-[72px]
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit?.();
                    }
                }}
                placeholder={placeholder}
                value={prompt}
            />

            {/* Submit button (AI icon) */}
            <motion.button
                aria-label="Generate page from prompt"
                className={`absolute inset-y-0 my-auto right-2 flex items-center justify-center
                            w-9 h-9 rounded-2xl transition-all duration-150
                            ${
                    loading || !prompt.trim()
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-ui-bg hover:border-primary hover:shadow-sm"
                }`}
                disabled={loading || !prompt.trim()}
                onClick={handleSubmit}
                type="button"
            >
                <motion.div
                    className="flex items-center justify-center w-full h-full"
                    whileTap={
                        loading || !prompt.trim()
                            ? undefined
                            : {scale: 0.95}
                    }
                >
                    <AIIcon
                        colorEnd={prompt.length === 0 ? inactiveColour : undefined}
                        colorMid={prompt.length === 0 ? inactiveColour : undefined}
                        colorStart={prompt.length === 0 ? inactiveColour : undefined}
                        size={32}
                        strokeColor={prompt.length === 0 ? inactiveColour : undefined}
                    />
                </motion.div>
            </motion.button>
        </>
    );
}

export default PromptingTextArea;