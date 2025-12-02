import React, {useState} from "react";
import {SparklesIcon} from "@heroicons/react/24/outline";
import PromptingTextArea from "../../../general/PromptingTextArea";
import AIService from "../../../../services/AIService";
import {useBuilder} from "../../hooks/useBuilder";

function AIAssistantPanel({}) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([{
        id: "welcome",
        role: "assistant",
        content: "I can redesign sections, rewrite copy, or even regenerate single components while staying aligned with your theme.",
    },]);

    const {
        editorRef, page, selectedElementId, refreshEditor, syncWebsiteDataFromEditor,
    } = useBuilder();

    const handleQuickPrompt = (prompt) => setInput(prompt);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || !editorRef.current || !selectedElementId) return;

        const userMsg = {
            id: `user-${Date.now()}`, role: "user", content: trimmed,
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const body = {
                messages: messages,
                elementId: selectedElementId,
                websiteData: JSON.stringify(page),
            };

            const res = await AIService.editElement(body);

            const editor = editorRef.current;
            const cmp = editor.getWrapper().find(`#${selectedElementId}`)[0];
            if (cmp && res.component) {
                cmp.replaceWith(res.component);
            }

            refreshEditor();
            syncWebsiteDataFromEditor();

            setMessages((prev) => [...prev, {
                id: `assistant-${Date.now()}`, role: "assistant", content: res.text || "Updated the selected element.",
            },]);
        } catch (e) {
            setMessages((prev) => [...prev, {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: "Something went wrong while editing the element.",
            },]);
        } finally {
            setLoading(false);
            setInput("");
        }
    };


    return (<div className="flex h-full flex-col rounded-[10px] border-2 border-ui-border bg-ui-bg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ui-border">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <SparklesIcon className="h-4 w-4 text-primary"/>
                </div>
                <div>
                    <h5 className="m-0 text-sm font-semibold text-text">
                        AI Assistant
                    </h5>
                    <p className="m-0 text-tiny text-text-subtle">
                        Redesign, rewrite copy, and regenerate single components
                    </p>
                </div>
            </div>

            <span
                className="rounded-[999px] border border-primary/40 bg-primary/5 px-2 pt-[3px] pb-[2px]
                               text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"
            >
                    Beta
                </span>
        </div>

        {/* Conversation + Quick Actions */}
        <div className="flex-1 min-h-0 flex flex-col gap-2 px-3 pb-3 pt-2">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1.5">
                <button
                    type="button"
                    onClick={() => handleQuickPrompt("Redesign the selected component or section using a cleaner, more modern layout while keeping the existing brand theme.")}
                    className="rounded-[999px] border border-ui-border bg-website-bg px-3 pt-1 text-tiny
                                   text-text-subtle hover:border-primary hover:text-primary transition-colors"
                >
                    Redesign
                </button>
                <button
                    type="button"
                    onClick={() => handleQuickPrompt("Rewrite the copy of the selected component for clarity and better UX copy. Keep the meaning and approximate length.")}
                    className="rounded-[999px] border border-ui-border bg-website-bg px-3 pt-1 text-tiny
                                   text-text-subtle hover:border-primary hover:text-primary transition-colors"
                >
                    Rewrite copy
                </button>
                <button
                    type="button"
                    onClick={() => handleQuickPrompt("Improve the layout of this component or section. Suggest spacing, alignment, hierarchy, and responsive tweaks.")}
                    className="rounded-[999px] border border-ui-border bg-website-bg px-3 pt-1 text-tiny
                                   text-text-subtle hover:border-primary hover:text-primary transition-colors"
                >
                    Improve layout
                </button>
            </div>

            {/* Messages */}
            <div
                className="flex-1 min-h-0 overflow-y-auto rounded-[8px] bg-website-bg border border-ui-border px-3 py-2 space-y-2">
                {messages.map((msg) => {
                    const isUser = msg.role === "user";
                    return (<div
                        key={msg.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-[8px] px-3 py-2 text-xs leading-snug
                                                ${isUser ? "bg-primary text-white rounded-br-sm" : "bg-ui-bg text-text border border-ui-border rounded-bl-sm"}`}
                        >
                            {msg.content}
                        </div>
                    </div>);
                })}

                {!messages.length && (<div className="flex h-full items-center justify-center">
                    <p className="text-tiny text-text-subtle">
                        No conversation yet – ask a question or use one of the quick actions.
                    </p>
                </div>)}
            </div>
        </div>

        {/* Input */}
        <div className="border-t border-ui-border bg-ui-bg px-3 py-3">
            <div className="relative">
                <PromptingTextArea prompt={input} setPrompt={setInput} handleSubmit={handleSend} loading={loading}
                                   placeholder={"Describe what you want the assistant to help with in the builder…"}/>
            </div>
            <p className="mt-1 text-[10px] text-text-subtle">
                Tip: Enter = send, Shift+Enter = new line.
            </p>
        </div>
    </div>);
}

export default AIAssistantPanel;
