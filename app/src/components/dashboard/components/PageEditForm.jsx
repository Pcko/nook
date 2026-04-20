import {useMemo, useState} from "react";

import PageService from "../../../services/PageService";
import {isInvalidStringForURL} from "../../general/FormChecks";
import useErrorHandler from "../../logging/ErrorHandler";
import {useMetaNotify} from "../../logging/MetaNotifyHook";

/**
 * Renders the page edit form component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.closeForm - The close form value.
 * @param {any} props.pageName - The page name value.
 * @param {any} props.pages - The pages value.
 * @returns {JSX.Element} The rendered page edit form component.
 */
function PageEditForm({closeForm, pageName, pages}) {
    const [newPageName, setNewPageName] = useState(pageName);
    const [newFolderName, setNewFolderName] = useState(pages[pageName].folderName);

    const baseMeta = useMemo(() => ({
        feature: "pages", component: "PageEditForm",
    }), [pageName]);

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    /**
 * Handles form submit.
 *
 * @param {any} e - The event payload for the current interaction.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
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
                    pageName, newPageName, trimmedFolderName
                }, "validation");
            }

            const result = isInvalidStringForURL(newPageName);
            if (result) {
                return notify("error", result, {
                    pageName, newPageName, trimmedFolderName
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
                    className="size-5 ml-auto mr-1 hover:cursor-pointer"
                    fill="none"
                    onClick={() => closeForm()}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <form className="m-3 mt-4" onSubmit={handleFormSubmit}>
                <label className="block mb-1" htmlFor="newPageName">
                    Page Name
                </label>
                <input
                    className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border rounded bg-ui-bg mb-3"
                    id="newPageName"
                    minLength={2}
                    name="newPageName"
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="Default: keep previous"
                    type="text"
                    value={newPageName}
                />
                <label className="block mb-1" htmlFor="folderName">
                    Folder
                </label>
                <input
                    className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border rounded bg-ui-bg mb-3"
                    id="newFolderName"
                    minLength={2}
                    name="newFolderName"
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Default: keep previous"
                    type="text"
                    value={newFolderName}
                />
                <div className="flex mt-2">
                    <div className="mr-0 ml-auto">
                        <input
                            className="py-1 px-4 bg-ui-button rounded-lg mr-3 hover:cursor-pointer"
                            onClick={() => closeForm()}
                            type="button"
                            value="Cancel"
                        />
                        <input
                            className="py-1 px-4 bg-primary text-text-on-primary rounded-lg hover:cursor-pointer"
                            type="submit"
                            value="Edit Page"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PageEditForm;