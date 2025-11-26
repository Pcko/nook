import {useMemo, useState} from "react";
import {isInvalidStringForURL} from "../general/FormChecks";
import PageService from "../../services/PageService";
import useErrorHandler from "../logging/ErrorHandler";
import {useMetaNotify} from "../logging/MetaNotifyHook";

function PageEditForm({closeForm, pageName, pages}) {
    const [newPageName, setNewPageName] = useState(pageName);
    const [newFolderName, setNewFolderName] = useState(pages[pageName].folderName);

    const baseMeta = useMemo(() => ({
        feature: "pages", component: "PageEditForm",
    }), [pageName]);

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (newPageName !== pageName && pages[newPageName]) {
            return notify("error", "Your page name must be unique.", {
                pageName, newPageName
            }, "validation");
        }

        const trimmedFolderName = newFolderName?.trim();

        if (!trimmedFolderName) {
            if (!newPageName.trim()) {
                return notify("error", "At least one of the fields is required", {
                    pageName, newPageName
                }, "validation");
            }

            const result = isInvalidStringForURL(newPageName);
            if (result) {
                return notify("error", result, {
                    pageName, newPageName
                }, "validation");
            }
        }

        try {
            const response = await PageService.updatePage(pages[pageName], newPageName);

            if (trimmedFolderName) {
                pages[pageName].folderName = trimmedFolderName;
            }

            if (newPageName) {
                const page = {...pages[pageName]};
                delete pages[pageName];
                pages[response.newPageName] = page;
            }

            notify("info", "Successfully applied changes to your page.", {
                pageName, newPageName, folderName: trimmedFolderName || null
            }, "submit");
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Failed to update the page.",
                meta: {
                    pageName, newPageName, newFolderName: trimmedFolderName
                }
            });
            return;
        }

        closeForm();
    };

    return (
        <div className="bg-ui-bg border border-ui-border rounded-lg w-[30vw]">
            <div className="flex px-2 py-3 border-b-[1px] border-ui-border">
                <h5 className="font-semibold">Edit Page "{pageName}"</h5>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 ml-auto mr-1 hover:cursor-pointer"
                    onClick={() => closeForm()}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </div>

            <form onSubmit={handleFormSubmit} className="m-3 mt-4">
                <label htmlFor="newPageName" className="block mb-1">
                    Page Name
                </label>
                <input
                    type="text"
                    id="newPageName"
                    name="newPageName"
                    minLength={2}
                    className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border rounded bg-ui-bg mb-3"
                    onChange={(e) => setNewPageName(e.target.value)}
                    value={newPageName}
                    placeholder="Default: keep previous"
                />
                <label htmlFor="folderName" className="block mb-1">
                    Folder
                </label>
                <input
                    type="text"
                    id="newFolderName"
                    name="newFolderName"
                    minLength={2}
                    className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border rounded bg-ui-bg mb-3"
                    onChange={(e) => setNewFolderName(e.target.value)}
                    value={newFolderName}
                    placeholder="Default: keep previous"
                />
                <div className="flex mt-2">
                    <div className="mr-0 ml-auto">
                        <input
                            type="button"
                            value="Cancel"
                            onClick={() => closeForm()}
                            className="py-1 px-4 bg-ui-button rounded-lg mr-3 hover:cursor-pointer"
                        />
                        <input
                            type="submit"
                            value="Edit Page"
                            className="py-1 px-4 bg-primary text-text-on-primary rounded-lg hover:cursor-pointer"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PageEditForm;