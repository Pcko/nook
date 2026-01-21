import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";

import PageCreationForm from "./PageCreationForm";
import PageEditForm from "./PageEditForm";
import useErrorHandler from "../logging/ErrorHandler";
import PageService from "../../services/PageService";
import {InactiveIcon, NotDeployedIcon, OnlineIcon} from "./resources/DashboardIcons";
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";
import {BsThreeDots} from "react-icons/bs";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useNavigate} from "react-router-dom";
import {useMetaNotify} from "../logging/MetaNotifyHook";
import SortMenu from "./SortMenu";

/**
 * All Options that the user can sort by
 * @type {[{svg: string, id: number, option: string},{svg: string, id: number, option: string},{svg: string, id: number, option: string},{svg: string, id: number, option: string}]}
 */
const sortByOptions = [{
    id: 1,
    option: "Name",
    svg: "m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
}, {
    id: 2,
    option: "Date of Creation",
    svg: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
}, {
    id: 3, option: "Last Modified", svg: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
}, {
    id: 4,
    option: "Deployment",
    svg: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
}];

/**
 *  States of Deployment and their icons for the Table
 * @type {{"not deployed": React.JSX.Element, inactive: React.JSX.Element, online: React.JSX.Element}}
 */
const deploymentStates = {
    online: <OnlineIcon/>, inactive: <InactiveIcon/>, "not deployed": <NotDeployedIcon/>
};

/**
 * The priority that is used for sorting Pages by Deployment Status
 * @type {{Inactive: number, "Not Deployed": number, Online: number}}
 */
const deploymentPriority = {
    "Online": 0, "Inactive": 1, "Not Deployed": 2
};

const dateFormat = {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
};

function PageHub() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
    const [sortReversed, setSortReversed] = useState(false);
    const [pageCreationFormActive, setPageCreationFormActive] = useState(false);
    const [pageNameToEdit, setPageNameToEdit] = useState();
    const [pages, setPages] = useState({});

    const navigate = useNavigate();

    const baseMeta = useMemo(() => ({
        feature: "pages", component: "PageHub"
    }), []);

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    useEffect(() => {
        PageService.getPages()
            .then((pages) => {
                const pageMap = {};
                pages.forEach((page) => {
                    pageMap[page.name] = page;
                });
                setPages(pageMap);
            })
            .catch((error) => {
                handleError(error, {
                    meta: {action: "load-pages"}
                });
            });
    }, [handleError]);

    const onPageClick = (page) => {
        navigate(`/editor/${page.name}`, {state: {page}});
    };

    const compareTableEntries = ([keyA, valueA], [keyB, valueB]) => {
        switch (sortByOption) {
            case sortByOptions[0]:
                return keyA.localeCompare(keyB) * (sortReversed ? -1 : 1);
            case sortByOptions[1]:
                return ((new Date(valueA.createdAt) - new Date(valueB.createdAt)) * (sortReversed ? -1 : 1));
            case sortByOptions[2]:
                return ((new Date(valueA.updatedAt) - new Date(valueB.updatedAt)) * (sortReversed ? -1 : 1));
            case sortByOptions[3]: {
                const rankA = deploymentPriority[valueA.deploymentStatus];
                const rankB = deploymentPriority[valueB.deploymentStatus];
                return (rankA - rankB) * (sortReversed ? -1 : 1);
            }
            default:
                return 0;
        }
    };

    const handlePageDelete = async (pageName) => {
        try {
            await PageService.deletePage(pageName);
            setPages((prev) => {
                const updated = {...prev};
                delete updated[pageName];
                return updated;
            });

            notify("info", "Successfully deleted your page.", {
                action: "delete-page", pageName
            });
        } catch (err) {
            handleError(err, {
                meta: {
                    action: "delete-page", pageName
                }
            });
        }
    };

    /**
     *  Handles leftover Pages that
     * @returns {undefined|Object}
     */
    const handleFragment = () => {
        if (!sessionStorage.getItem("artifact")) {
            return undefined;
        }

        try {
            return JSON.parse(sessionStorage.getItem("artifact"));
        } catch (err) {
            return undefined;
        }
    }

    const fallbackFormData = handleFragment();

    return (
        <div className="w-full h-full flex flex-col pt-3 px-20">
            <div>
                {/* Top Bar */}
                <div className="flex">
                    {/* Search */}
                    <div className="flex w-1/3 p-2 border border-ui-border rounded-[5px]">
                        <MagnifyingGlassIcon className="h-5 mr-1 !text-text-subtle"/>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full my-auto bg-inherit focus:outline-none placeholder:text-text-subtle"
                        />
                    </div>

                    {/* Sorting + New Page */}
                    <div className="flex ml-auto space-x-4">
                        <SortMenu
                            value={sortByOption}
                            onChange={setSortByOption}
                            options={sortByOptions}
                        />

                        <button
                            type="button"
                            className="prim-btn w-[180px] h-[42px] rounded-[5px] !text-text-on-primary !border border-secondary flex items-center justify-center gap-2"
                            onClick={() => setPageCreationFormActive(true)}
                        >
                            <svg
                                className="icon"
                                width="14"
                                height="13"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.56115 1.23145V15.8758M16.0862 8.55364H1.03613"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            New Page
                        </button>
                    </div>
                </div>

                <hr className="mt-8 mb-10 border border-ui-border"/>

                {/* Table */}
                <div className="scroll-auto">
                    <div className="grid grid-cols-4 border-ui-border">
                        {/* Headers */}
                        <div className="sticky bg-ui-bg top-0 border-ui-border border rounded-tl-[5px]">
                            <h6 className="py-2 px-4">Page Name</h6>
                        </div>
                        <h6 className="sticky bg-ui-bg top-0 border-ui-border border py-2 px-4">
                            Created
                        </h6>
                        <h6 className="sticky bg-ui-bg top-0 border-ui-border border py-2 px-4">
                            Last Modified
                        </h6>
                        <div className="sticky bg-ui-bg top-0 border-ui-border border rounded-tr-[5px]">
                            <h6 className="py-2 px-4 ">Deployment Status</h6>
                        </div>

                        {/* Rows */}
                        {pages != null && Object.entries(pages)
                            .filter(([name]) => name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase().trim()))
                            .sort(compareTableEntries)
                            .map(([name, details], index, filtered) => (
                                <Fragment key={name}>
                                    <div
                                        className={`flex py-2 pl-4 pr-2 border-ui-border border border-t-0 items-center select-none ${index === filtered.length - 1 ? "rounded-bl-[5px]" : ""}`}
                                    >
                                            <span
                                                className="underline text-primary hover:cursor-pointer font-medium"
                                                onClick={() => onPageClick(details)}
                                            >
                                                {name}
                                            </span>

                                        <Listbox>
                                            <div className="relative ml-auto">
                                                <ListboxButton
                                                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-ui-bg-selected transition-colors">
                                                    <BsThreeDots/>
                                                </ListboxButton>

                                                <ListboxOptions
                                                    className="absolute right-0 mt-2 w-40 bg-ui-bg border border-ui-border rounded-md shadow- [5px] text-text z-50">
                                                    <ListboxOption value="editPage">
                                                        {({active}) => (<button
                                                            onClick={() => setPageNameToEdit(name)}
                                                            className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${active ? "bg-ui-bg-selected" : ""}`}
                                                        >
                                                            Edit Page
                                                        </button>)}
                                                    </ListboxOption>
                                                    <ListboxOption value="deletePage">
                                                        {({active}) => (<button
                                                            onClick={() => handlePageDelete(name)}
                                                            className={`w-full text-left px-4 py-2 text-sm rounded text-dangerous transition-colors ${active ? "bg-red-100" : ""}`}
                                                        >
                                                            Delete Page
                                                        </button>)}
                                                    </ListboxOption>
                                                </ListboxOptions>
                                            </div>
                                        </Listbox>
                                    </div>

                                    <div
                                        className="p-4 align-middle border-ui-border border border-t-0 flex items-center">
                                        {new Date(details.createdAt).toLocaleString(navigator.language, dateFormat)}
                                    </div>
                                    <div className="p-4 border-ui-border border border-t-0 flex items-center">
                                        {new Date(details.updatedAt).toLocaleString(navigator.language, dateFormat)}
                                    </div>
                                    <div
                                        className={`p-4 border-ui-border border border-t-0 flex items-center ${index === filtered.length - 1 ? "rounded-br-[5px]" : ""}`}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {deploymentStates[details.deploymentStatus?.toLowerCase()]}
                                            {details.deploymentStatus}
                                        </span>
                                    </div>
                                </Fragment>
                            ))}
                    </div>
                </div>

                {/* Forms */}
                {pageCreationFormActive && (<CenteredWindowWithBackgroundBlur>
                    <PageCreationForm
                        pages={pages}
                        setPages={setPages}
                        closeForm={() => setPageCreationFormActive(false)}
                        fallbackFormData={fallbackFormData}
                    />
                </CenteredWindowWithBackgroundBlur>)}

                {pageNameToEdit && (<CenteredWindowWithBackgroundBlur>
                    <PageEditForm
                        pageName={pageNameToEdit}
                        closeForm={() => setPageNameToEdit(undefined)}
                        pages={pages}
                    />
                </CenteredWindowWithBackgroundBlur>)}
            </div>
        </div>
    );
}

export default PageHub;
