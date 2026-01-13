import {SparklesIcon} from "@heroicons/react/24/outline";
import React, {JSX, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

import AIService from "../../../../services/AIService";
import PromptingTextArea from "../../../general/PromptingTextArea";
import {useBuilder} from "../../hooks/UseBuilder";
import SelectElementPlaceholder from "../../../general/SelectElementPlaceholder";
import {ChatMessage} from "../../../../services/interfaces/ChatMessage";
import AIChangeReviewPopup from "../AI/AIChangeReviewPopup.tsx";
import {applyAIChanges, buildAIChanges} from "../AI/AIAssistantUtils.ts";
import {AIChange} from "../AI/types.ts";

function AIAssistantPanel(): JSX.Element {
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([]);

    const [reviewOpen, setReviewOpen] = useState<boolean>(false);
    const [pendingProjectData, setPendingProjectData] = useState<any>(null);
    const [pendingChanges, setPendingChanges] = useState<AIChange[]>([]);
    const [pendingAssistantText, setPendingAssistantText] = useState<string>("");
    const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);

    const {
        editorRef,
        selectedElement,
        refreshEditor,
        syncWebsiteDataFromEditor,
        captureHistory,
        pageMeta,
        aiBusy,
        setAiBusy,
    } = useBuilder();

    useEffect(() => {
        setMessages([
            {
                role: "assistant",
                content:
                    "I can redesign sections, rewrite copy, or even regenerate single components while staying aligned with your theme.",
            },
        ]);
        setInternalMessages([]);
    }, [selectedElement]);

    const handleQuickPrompt = (prompt: string): void => setInput(prompt);

    const handleSend = async (): Promise<void> => {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (reviewOpen) return;

        if (!editorRef.current || !selectedElement) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Please select an element in the editor first.",
                },
            ]);
            setInput("");
            setLoading(false);
            return;
        }

        const userMsg: ChatMessage = {
            role: "user",
            content: trimmed,
        };

        const updatedMessages: ChatMessage[] = [...messages, userMsg];
        setMessages(updatedMessages);

        const updatedInternalMessages: ChatMessage[] = [...internalMessages, userMsg];
        setInternalMessages(updatedInternalMessages);

        setLoading(true);
        setAiBusy(true);

        let openedReview = false;
        try {
            const body = {
                messages: updatedInternalMessages,
                elementId: selectedElement.getId(),
                websiteData: JSON.stringify(editorRef.current.getProjectData()),
                pageMeta: pageMeta || null,
            };

            const res = await AIService.editElement(body);

            // Do not apply immediately; prepare a review modal.
            const editor = editorRef.current;
            const baseProjectData = editor.getProjectData();
            const targetId = selectedElement.getId();
            const changes = buildAIChanges(res, targetId);

            refreshEditor();
            syncWebsiteDataFromEditor();
            const shortPrompt = trimmed.length > 48 ? trimmed.slice(0, 48) + "…" : trimmed;
            captureHistory?.(`AI: ${shortPrompt}`);
            setPendingProjectData(baseProjectData);
            setPendingChanges(changes);
            setPendingAssistantText(res.text || "I prepared changes for review.");
            setPendingTargetId(targetId);
            setReviewOpen(true);
            openedReview = true;

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: res.text || "Updated the selected element.",
                },
            ]);

            setInternalMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: JSON.stringify({
                        text: res.text,
                        styles: res.styles,
                        component: res.component
                    }),
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong while editing the element.",
                },
            ]);
            setAiBusy(false);
        } finally {
            if (!openedReview) {
                setAiBusy(false);
            }
            setLoading(false);
            setInput("");
        }
    };

    const handleApplySelected = (): void => {
        const editor = editorRef.current;
        if (!editor) return;

        applyAIChanges(editor, pendingChanges);

        // Re-select the (replaced) component root by its stable id
        if (pendingTargetId) {
            const cmp = editor.getWrapper().find(`#${pendingTargetId}`)?.[0];
            if (cmp) editor.select(cmp);
        }

        refreshEditor();
        syncWebsiteDataFromEditor();

        setReviewOpen(false);
        setAiBusy(false);
        setPendingTargetId(null);

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: `Applied ${pendingChanges.filter((c) => c.enabled).length} changes.`,
            },
        ]);
    };

    const handleRejectAll = (): void => {
        setReviewOpen(false);
        setAiBusy(false);
        setPendingTargetId(null);

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: "Changes rejected.",
            },
        ]);
    };

    return (
        <div className="flex h-full flex-col rounded-[10px] border-2 border-ui-border bg-ui-bg">
            <AIChangeReviewPopup
                open={reviewOpen}
                title="AI Assistant – Review changes"
                baseProjectData={pendingProjectData}
                focusTargetId={pendingTargetId}
                changes={pendingChanges}
                onChange={setPendingChanges}
                onApply={handleApplySelected}
                onReject={handleRejectAll}
            />
            <AnimatePresence mode="wait">
                {selectedElement ? (
                    <motion.div
                        key="assistant"
                        initial={{opacity: 0, y: 6}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -6}}
                        transition={{duration: 0.2}}
                        className="flex h-full flex-col bg-ui-bg rounded-[10px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-ui-border">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                                    <SparklesIcon className="h-4 w-4 text-primary"/>
                                </div>
                                <div>
                                    <h5 className="m-0 text-small font-semibold text-text">
                                        AI Assistant
                                    </h5>
                                    <p className="m-0 text-small text-text-subtle">
                                        Selected Component: {selectedElement.getId()}
                                    </p>
                                </div>
                            </div>

                            <span
                                className="rounded-[999px] border border-primary/40 bg-primary/5 px-2 pt-[3px] pb-[2px]
                               text-small font-semibold uppercase tracking-[0.14em] text-primary"
                            >
                                Beta
                            </span>
                        </div>

                        {/* Conversation + Quick Actions */}
                        <div className="flex-1 min-h-0 flex flex-col gap-2 px-3 pb-3 pt-2">
                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    className="rounded-[999px] border border-ui-border bg-website-bg px-3 pt-1 text-small
                                   text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                    onClick={() =>
                                        handleQuickPrompt(
                                            "Redesign the selected component or section using a cleaner, more modern layout while keeping the existing brand theme.",
                                        )
                                    }
                                    type="button"
                                >
                                    Redesign
                                </button>
                                <button
                                    className="rounded-[999px] border border-ui-border bg-website-bg px-3 pt-1 text-small
                                   text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                    onClick={() =>
                                        handleQuickPrompt(
                                            "Rewrite the copy of the selected component for clarity and better UX copy. Keep the meaning and approximate length.",
                                        )
                                    }
                                    type="button"
                                >
                                    Rewrite copy
                                </button>
                                <button
                                    className="rounded-[999px] border border-ui-border bg-website-bg px-3 pt-1 text-small
                                   text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                    onClick={() =>
                                        handleQuickPrompt(
                                            "Improve the layout of this component or section. Suggest spacing, alignment, hierarchy, and responsive tweaks.",
                                        )
                                    }
                                    type="button"
                                >
                                    Improve layout
                                </button>
                            </div>

                            {/* Messages */}
                            <div
                                className="flex-1 min-h-0 overflow-y-auto rounded-[8px] bg-website-bg border border-ui-border px-3 py-2 space-y-2">
                                {messages.map((msg, index) => {
                                    const isUser = msg.role === "user";
                                    return (
                                        <div
                                            className={`flex ${
                                                isUser ? "justify-end" : "justify-start"
                                            }`}
                                            key={index}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-[8px] px-3 py-2 text-small leading-snug
                                                ${
                                                    isUser
                                                        ? "bg-primary text-white rounded-br-sm"
                                                        : "bg-ui-bg text-text border border-ui-border rounded-bl-sm"
                                                }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}

                                {!messages.length && (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-small text-text-subtle">
                                            No conversation yet – ask a question or use one of the quick actions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="border-t border-ui-border bg-ui-bg px-3 py-3">
                            <div className="relative">
                                <PromptingTextArea
                                    handleSubmit={handleSend}
                                    loading={loading}
                                    placeholder={
                                        "Describe what you want the assistant to help with in the builder…"
                                    }
                                    prompt={input}
                                    setPrompt={setInput}
                                />
                            </div>

                            <p className="mt-1 text-small text-text-subtle">
                                Tip: Enter = send, Shift+Enter = new line.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{opacity: 0, y: 6}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -6}}
                        transition={{duration: 0.2}}
                        className="flex h-full flex-col"
                    >
                        <SelectElementPlaceholder/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AIAssistantPanel;
