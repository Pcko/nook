import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "../context/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import {isInvalidStringForURL} from "../general/FormChecks";
import PageService from "../../services/PageService";
import {
    AIPageCreationIcon, CrossIcon, EditorPageCreationIcon,
} from "./resources/DashboardIcons";
import AIService from "../../services/AIService";
import JSON5 from "json5";

function PageCreationForm({closeForm, setPages}) {
    const [pageName, setPageName] = useState("");
    const [step, setStep] = useState("choose");
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState("");
    const [aiPages, setAiPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();
    const navigate = useNavigate();

    const responseRef = useRef(null);

    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [aiResponse]);

    const maxNameLength = 50;

    const handleFormSubmit = async (cause) => {
        const result = isInvalidStringForURL(pageName);
        if (result) return showNotification("error", result);

        try {
            const page = await PageService.createPage(pageName);
            setPages((prev) => ({...prev, [page.name]: page}));
            if (cause === "self") navigate(`/editor/${pageName}`); else showNotification("success", "Page created.");
            closeForm();
        } catch (err) {
            handleError(err);
        }
    };

    const handleAiButtonClick = () => {
        if (!pageName || pageName.length < 2) return showNotification("error", "Enter a valid page name first.");
        setAiPrompt("");
        setAiResponse("");
        setStep("ai-chat");
    };

    const handleAiPromptSubmit = async () => {
        if (!aiPrompt.trim()) return showNotification("error", "Enter a prompt.");

        setLoading(true);
        setLoadingStep(0);
        setAiResponse("");
        setAiPages(null);

        try {
            await AIService.queryAIStream(
                { query: aiPrompt, stream: true },
                (chunk) => setAiResponse((prev) => prev + chunk)
            );

            setLoadingStep(1);

            // --- robust JSON extraction ---
            const cleaned = aiResponse
                .replace(/<think>[\s\S]*?<\/think>/g, "")
                .replace(/```[\s\S]*?```/g, "")
                .trim();


            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (!jsonMatch)
                throw new Error("No valid JSON found in response");

            const jsonStr = jsonMatch[0];

            let parsedPage;
            try {
                parsedPage = JSON.parse(jsonStr);
            } catch (err) {
                console.warn("Standard JSON parsing failed, trying JSON5...");
                parsedPage = JSON5.parse(jsonStr);
            }

            console.log("✅ Parsed JSON:", parsedPage);

            setAiPages([parsedPage]);

            setLoadingStep(2);
            setStep("ai-preview");
        } catch (err) {
            console.error("Failed to extract or parse JSON:", err, aiResponse);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAiPage = async (selectedPage) => {
        try {
            const page = {...selectedPage, name: await PageService.updatePage(pageName)};
            setPages((prev) => ({...prev, [page.name]: page}));
            showNotification("success", "Page created via AI.");
            navigate(`/editor/${pageName}`);
        } catch (err) {
            handleError(err);
        }
    };

    const LoadingBar = () => (<div className="mb-4">
        <div className="text-sm mb-1 font-semibold">Loading progress: {loadingStep}/2</div>
        <div className="w-full bg-gray-300 rounded h-3 overflow-hidden">
            <div
                className="bg-blue-600 h-3 transition-all duration-500"
                style={{width: `${(loadingStep / 2) * 100}%`}}
            />
        </div>
    </div>);

    // RENDER
    if (step === 'choose') {
        return (<div className="bg-website-bg border-2 border-ui-border rounded-md w-full p-6 max-w-2xl mx-auto">
            <div className="flex items-center pb-3 border-b-2 border-ui-border mb-5"><h4
                className="font-semibold">Create a new Page!</h4>
                <button onClick={closeForm} className="ml-auto hover:text-primary transition-colors"
                        aria-label="Close form"><CrossIcon/></button>
            </div>
            <form><p className="text-text-subtle mb-4"> Enter a name for your new page below. This will be used for the
                URL and navigation. </p> <label htmlFor="pageName" className="block mb-2 font-medium text-sm">Page
                Name</label> <input type="text" id="pageName" name="pageName" required minLength={2}
                                    maxLength={maxNameLength}
                                    className="w-full h-[48px] p-3 border-2 border-ui-border rounded-[5px] focus:outline-none focus:ring-2 focus:ring-primary transition"
                                    onChange={(e) => setPageName(e.target.value)} value={pageName}
                                    placeholder="Example: MyFirstPageWithNook"/> <p
                className="text-sm text-text-subtle mt-1 mb-6">{pageName.length}/{maxNameLength}</p>
                <div className="flex gap-4 select-none">
                    <div
                        className="flex-1 p-4 border-2 border-ui-border rounded-md hover:shadow-md transition cursor-pointer"
                        onClick={() => handleFormSubmit('self')}>
                        <div className="flex items-center gap-3 mb-3"><EditorPageCreationIcon className="w-14 h-14"/>
                            <h6 className="font-semibold m-0">Create a page yourself</h6>
                        </div>
                        <p className="text-text-subtle">Take full control of the design process. Start from a blank
                            canvas.
                        </p>
                        <p className="block mt-4 text-primary font-semibold text-right">Start Building →</p>
                    </div>
                    <div
                        className="flex-1 p-4 border-2 border-ui-border rounded-md hover:shadow-md transition cursor-pointer"
                        onClick={handleAiButtonClick}>
                        <div className="flex items-center gap-3 mb-3">
                            <AIPageCreationIcon className="w-14 h-14"/>
                            <h6 className="font-semibold m-0">Create a page using AI</h6>
                        </div>
                        <p className="text-text-subtle">Describe your page and let AI build it for you.</p> <p
                        className="block mt-4 text-primary font-semibold text-right">Generate with AI →</p></div>
                </div>
            </form>
        </div>);
    }
    if (step === 'ai-chat') {
        return (<div
            className="bg-website-bg border-2 border-ui-border rounded-md w-full p-6 max-w-2xl mx-auto flex flex-col h-[600px]">
            <div className="flex items-center pb-3 border-b-2 border-ui-border mb-5"><h4 className="font-semibold">AI
                Page Generator</h4>
                <button onClick={closeForm} className="ml-auto hover:text-primary transition-colors"
                        aria-label="Close form"><CrossIcon/></button>
            </div>
            <textarea rows={4}
                      className="w-full border border-ui-border rounded p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Describe your page..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                      disabled={loading}/> {loading && <LoadingBar/>}
            <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mb-4"
                    onClick={handleAiPromptSubmit}
                    disabled={loading || !aiPrompt.trim()}> {loading ? 'Generating...' : 'Generate'} </button>
            <div ref={responseRef}
                 className="flex-1 overflow-auto p-4 bg-gray-50 border border-ui-border rounded whitespace-pre-wrap"
                 style={{
                     whiteSpace: 'pre-wrap', fontFamily: 'monospace', minHeight: '200px'
                 }}> {aiResponse || (!loading && 'AI response will appear here...')} </div>
        </div>);
    }
    if (step === 'ai-preview') {
        return (<div className="bg-website-bg border-2 border-ui-border rounded-md w-full p-6 max-w-4xl mx-auto">
            <div className="flex items-center pb-3 border-b-2 border-ui-border mb-5"><h4
                className="font-semibold">Choose your AI-generated page</h4>
                <button onClick={closeForm} className="ml-auto hover:text-primary transition-colors"
                        aria-label="Close form"><CrossIcon/></button>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {Array.isArray(aiPages) &&
                    aiPages.map((page, i) => (
                        <div
                            key={i}
                            className="border-2 border-ui-border rounded p-4 cursor-pointer hover:shadow-lg transition"
                            onClick={() => handleSelectAiPage(page)}
                        >
                            <h5 className="font-semibold mb-2">Option {i + 1}</h5>
                            <pre className="whitespace-pre-wrap max-h-[300px] overflow-auto bg-gray-50 p-2 rounded text-sm font-mono">
                    {JSON.stringify(page, null, 2)}
                </pre>
                        </div>
                    ))}
            </div>
        </div>);
    }

    return null;
}

export default PageCreationForm;
