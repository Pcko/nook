import React, {Fragment, useState} from "react";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";

import PageCreationForm from "./PageCreationForm";
import PageEditForm from "./PageEditForm";
import {useNotifications} from "../general/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";
import DashboardService from "../../services/DashboardService";
import {ThreeDotSvg} from "./resources/DashboardIcons";
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";

const sortByOptions = [
    {
        id: 1,
        option: 'Name',
        svg: 'm10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802'
    }, {
        id: 2,
        option: 'Date of Creation',
        svg: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5'
    }, {
        id: 3,
        option: 'Last Modified',
        svg: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
    }, {
        id: 4,
        option: 'Page Count',
        svg: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
    },
];

const deploymentStates = {
    "online":
        (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.857 6.191C11.9149 6.11129 11.9566 6.02095 11.9796 5.92514C12.0026 5.82933 12.0065 5.72994 11.991 5.63262C11.9756 5.5353 11.9412 5.44198 11.8897 5.35797C11.8382 5.27396 11.7707 5.20091 11.691 5.143C11.6113 5.08509 11.5209 5.04344 11.4251 5.02044C11.3293 4.99744 11.2299 4.99354 11.1326 5.00895C11.0353 5.02437 10.942 5.0588 10.858 5.11028C10.774 5.16176 10.7009 5.22929 10.643 5.309L7.16 10.099L5.28 8.219C5.21078 8.1474 5.128 8.0903 5.03647 8.05104C4.94495 8.01178 4.84653 7.99114 4.74694 7.99032C4.64736 7.9895 4.54861 8.00852 4.45646 8.04628C4.3643 8.08403 4.28059 8.13976 4.2102 8.21021C4.13982 8.28066 4.08417 8.36443 4.0465 8.45662C4.00883 8.54881 3.9899 8.64758 3.99081 8.74716C3.99173 8.84674 4.01246 8.94515 4.05181 9.03663C4.09116 9.12812 4.14834 9.21085 4.22 9.28L6.72 11.78C6.79663 11.8567 6.88896 11.9158 6.99065 11.9534C7.09233 11.9909 7.20094 12.006 7.30901 11.9975C7.41708 11.9891 7.52203 11.9573 7.61663 11.9044C7.71123 11.8515 7.79324 11.7787 7.857 11.691L11.857 6.191Z"
                      fill="#26A644"/>
            </svg>
        ),
    "inactive":
        (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3.37498 1.12512C2.77825 1.12512 2.20596 1.36217 1.784 1.78413C1.36205 2.20608 1.125 2.77837 1.125 3.3751V14.625C1.125 15.2218 1.36205 15.794 1.784 16.216C2.20596 16.638 2.77825 16.875 3.37498 16.875H14.6249C15.2216 16.875 15.7939 16.638 16.2159 16.216C16.6378 15.794 16.8749 15.2218 16.8749 14.625V3.3751C16.8749 2.77837 16.6378 2.20608 16.2159 1.78413C15.7939 1.36217 15.2216 1.12512 14.6249 1.12512H3.37498ZM7.7782 4.5001H9.73343L9.56244 10.8023H7.9537L7.7782 4.5001ZM9.81331 12.5595C9.80981 12.8383 9.69751 13.1047 9.50037 13.3018C9.30322 13.499 9.03685 13.6113 8.75807 13.6148C8.61726 13.6194 8.47697 13.5956 8.34553 13.5449C8.21409 13.4942 8.09419 13.4176 7.99296 13.3196C7.89173 13.2217 7.81123 13.1043 7.75625 12.9746C7.70128 12.8449 7.67295 12.7055 7.67295 12.5646C7.67295 12.4237 7.70128 12.2843 7.75625 12.1546C7.81123 12.0249 7.89173 11.9075 7.99296 11.8096C8.09419 11.7116 8.21409 11.635 8.34553 11.5843C8.47697 11.5336 8.61726 11.5098 8.75807 11.5144C9.32056 11.5144 9.80881 11.9835 9.81331 12.5595Z"
                    fill="#F2994A"/>
            </svg>
        ),
    "not deployed":
        (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3.37498 1.12512C2.77825 1.12512 2.20596 1.36217 1.784 1.78413C1.36205 2.20608 1.125 2.77837 1.125 3.3751V14.625C1.125 15.2218 1.36205 15.794 1.784 16.216C2.20596 16.638 2.77825 16.875 3.37498 16.875H14.6249C15.2216 16.875 15.7939 16.638 16.2159 16.216C16.6378 15.794 16.8749 15.2218 16.8749 14.625V3.3751C16.8749 2.77837 16.6378 2.20608 16.2159 1.78413C15.7939 1.36217 15.2216 1.12512 14.6249 1.12512H3.37498ZM7.7782 4.5001H9.73343L9.56244 10.8023H7.9537L7.7782 4.5001ZM9.81331 12.5595C9.80981 12.8383 9.69751 13.1047 9.50037 13.3018C9.30322 13.499 9.03685 13.6113 8.75807 13.6148C8.61726 13.6194 8.47697 13.5956 8.34553 13.5449C8.21409 13.4942 8.09419 13.4176 7.99296 13.3196C7.89173 13.2217 7.81123 13.1043 7.75625 12.9746C7.70128 12.8449 7.67295 12.7055 7.67295 12.5646C7.67295 12.4237 7.70128 12.2843 7.75625 12.1546C7.81123 12.0249 7.89173 11.9075 7.99296 11.8096C8.09419 11.7116 8.21409 11.635 8.34553 11.5843C8.47697 11.5336 8.61726 11.5098 8.75807 11.5144C9.32056 11.5144 9.80881 11.9835 9.81331 12.5595Z"
                    fill="#858699"/>
            </svg>
        )
}

const pageExamples = {
    "MyPage 1": {
        createdAt: "1.12.2005", updatedAt: "1.1.1111", deploymentStatus: "Online"
    },
    "MyPage 2": {
        createdAt: "1.12.2005", updatedAt: "1.1.1111", deploymentStatus: "Inactive"
    },
    "MyPage 3": {
        createdAt: "1.12.2005", updatedAt: "1.1.1111", deploymentStatus: "Not Deployed"
    }
}

function convertOptionToHTML(option) {
    return (
        <div className="flex text-text-subtle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 my-auto mx-2"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d={option.svg}/>
            </svg>
            <div className="my-auto">{option.option}</div>
        </div>);
}

function PageHub({pages, setPages}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
    const [sortReversed, setSortReversed] = useState(false);
    const [pageCreationFormActive, setPageCreationFormActive] = useState(false);
    const [pageNameToEdit, setPageNameToEdit] = useState();
    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();

    pages = pageExamples;
    const onPageClick = () => {
        /**
         * Implementiere hier das öffnen von Pages
         */
    };

    const compareTableEntries = ([keyA, valueA], [keyB, valueB]) => {
        switch (sortByOption) {
            case sortByOptions[0]:
                return (keyA > keyB) ^ sortReversed;
            case sortByOptions[1]:
                return (valueA.createdAt < valueB.createdAt) ^ sortReversed;
            case sortByOptions[2]:
                return (valueA.updatedAt < valueB.updatedAt) ^ sortReversed;
            case sortByOptions[3]:
                return (valueA.deploymentStatus > valueB.deploymentStatus) ^ sortReversed;
        }
    };

    const handlePageDelete = async (pageName) => {
        try {
            await DashboardService.deletePage(pageName);
            setPages((prev) => {
                const updated = {...prev};
                delete updated[pageName];
                return updated;
            });
            showNotification("success", "Successfully deleted your page.");
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="w-full h-full flex flex-col pt-3 px-20">
            <div>
                {/* Top Bar */}
                <div className="flex">
                    {/* Search */}
                    <div className="flex w-1/3 p-2 border-[1px] border-ui-border rounded-[5px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 my-auto text-text-subtle mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full my-auto bg-inherit focus:outline-none placeholder:text-text-subtle"
                        />
                    </div>

                    {/* Sorting + New Page */}
                    <div className="flex ml-auto space-x-4">
                        <Listbox value={sortByOption} onChange={setSortByOption}>
                            <div className="relative">
                                <ListboxButton
                                    className="flex items-center justify-center w-[180px] h-[42px] pr-3 border-2 border-ui-border rounded-[5px] bg-ui-bg hover:bg-ui-bg-selected transition-colors text-text"
                                >
                                    {convertOptionToHTML(sortByOption)}
                                </ListboxButton>

                                <ListboxOptions
                                    className="absolute z-10 mt-1 w-[180px] bg-ui-bg border-2 border-ui-border rounded-[5px] shadow-lg overflow-hidden text-text-subtle">
                                    <h6 className="px-3 py-2 text-sm font-semibold text-text hover:cursor-default">Sort</h6>
                                    <div className="divide-y divide-ui-border">
                                        {sortByOptions.map((option) => (
                                            <ListboxOption key={option.id} value={option}>
                                                {({active, selected}) => (
                                                    <button
                                                        className={`w-full text-left px-3 py-2 text-sm transition-colors rounded ${
                                                            active ? "bg-ui-bg-selected" : ""
                                                        } ${selected ? "font-medium" : "font-normal"}`}
                                                    >
                                                        {convertOptionToHTML(option)}
                                                    </button>
                                                )}
                                            </ListboxOption>
                                        ))}
                                    </div>
                                </ListboxOptions>
                            </div>
                        </Listbox>

                        <button
                            type="button"
                            className="prim-btn w-[180px] h-[42px] rounded-[5px] !text-text-on-primary !border border-secondary flex items-center justify-center gap-2"
                            onClick={() => setPageCreationFormActive(true)}
                        >
                            {/* Plus-Icon als SVG */}
                            <svg width="14" height="13" viewBox="0 0 18 17" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.56115 1.23145V15.8758M16.0862 8.55364H1.03613" stroke="white"
                                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            New Page
                        </button>

                    </div>
                </div>

                <hr className="mt-8 mb-10 border-[1px] border-ui-border"/>

                {/* Table */}
                <div className="scroll-auto">
                    <div className="grid grid-cols-4 border-ui-border">
                        {/* Headers */}
                        <div className="sticky bg-ui-bg  top-0">
                            <div
                                className="font-semibold border-ui-border border-[1px] py-2 px-4 rounded-tl-[5px]">
                                Page Name
                            </div>
                        </div>
                        <div
                            className="sticky bg-ui-bg top-0 font-semibold border-ui-border border-[1px] py-2 px-4">
                            Created
                        </div>
                        <div
                            className="sticky bg-ui-bg top-0 font-semibold border-ui-border border-[1px] py-2 px-4">
                            Last Modified
                        </div>
                        <div className="sticky bg-ui-bg top-0">
                            <div
                                className="font-semibold border-ui-border border-[1px] py-2 px-4 rounded-tr-[5px]">
                                Deployment Status
                            </div>
                        </div>

                        {/* Rows */}
                        {pages != null && Object.entries(pages)
                            .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                            .sort(compareTableEntries)
                            .map(([name, details], index, filtered) => (<Fragment key={name}>
                                <div
                                    className={`flex p-4 border-ui-border border-[1px] items-center ${index === filtered.length - 1 ? "rounded-bl-lg" : ""}`}>
                                    <span
                                        className="underline text-secondary hover:cursor-pointer font-medium"
                                        onClick={() => onPageClick(name)}>
                                        {name}
                                    </span>

                                    {/* Meatball Menu */}
                                    <Listbox>
                                        <div className="relative ml-auto">
                                            <ListboxButton
                                                className="flex items-center justify-center w-8 h-8 rounded hover:bg-ui-bg-selected transition-colors">
                                                <ThreeDotSvg/>
                                            </ListboxButton>

                                            <ListboxOptions
                                                className="absolute right-0 mt-2 w-40 bg-ui-bg border border-ui-border rounded-md shadow-lg text-text z-50">
                                                <ListboxOption value="editPage">
                                                    {({active}) => (
                                                        <button
                                                            onClick={() => setPageNameToEdit(name)}
                                                            className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                                                                active ? "bg-ui-bg-selected" : ""
                                                            }`}
                                                        >
                                                            Edit Page
                                                        </button>
                                                    )}
                                                </ListboxOption>
                                                <ListboxOption value="deletePage">
                                                    {({active}) => (
                                                        <button
                                                            onClick={() => handlePageDelete(name)}
                                                            className={`w-full text-left px-4 py-2 text-sm rounded text-red-500 transition-colors ${
                                                                active ? "bg-red-100" : ""
                                                            }`}
                                                        >
                                                            Delete Page
                                                        </button>
                                                    )}
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>

                                <div
                                    className="p-4 align-middle border-ui-border border-[1px] flex items-center">
                                    {new Date(details.createdAt).toLocaleString(navigator.language)}
                                </div>
                                <div
                                    className="p-4 border-ui-border border-[1px] flex items-center">
                                    {new Date(details.updatedAt).toLocaleString(navigator.language)}
                                </div>
                                <div
                                    className={`p-4 border-ui-border border-[1px] flex items-center ${index === filtered.length - 1 ? "rounded-br-lg" : ""}`}>
                                <span className="inline-flex items-center gap-1">
                                    {deploymentStates[details.deploymentStatus.toLowerCase()]}
                                    {details.deploymentStatus}
                                </span>
                                </div>
                            </Fragment>))}
                    </div>
                </div>

                {/* Forms */}
                {pageCreationFormActive && (<CenteredWindowWithBackgroundBlur>
                    <PageCreationForm
                        setPages={setPages}
                        closeForm={() => setPageCreationFormActive(false)}
                    />
                </CenteredWindowWithBackgroundBlur>)}

                {pageNameToEdit && (<CenteredWindowWithBackgroundBlur>
                    <PageEditForm
                        onPageEdit={(newPageName, data) => {
                            setPages((prev) => {
                                const {[pageNameToEdit]: _, ...updated} = prev;
                                return {...updated, [newPageName]: data};
                            });
                        }}
                        pageName={pageNameToEdit}
                        closeForm={() => setPageNameToEdit(undefined)}
                        pages={pages}
                    />
                </CenteredWindowWithBackgroundBlur>)}
            </div>
        </div>);
}

export default PageHub;