import React, {Fragment, useState} from "react";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import axios from "../auth/AxiosInstance";

import PageCreationForm from "./PageCreationForm";
import PageEditForm from "./PageEditForm";
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";
import {useNotifications} from "../general/NotificationContext";
import useErrorHandler from "../general/ErrorHandler";

const sortByOptions = [
    {id: 1, option: "Name", svg: "m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621..."},
    {id: 2, option: "Date of Creation", svg: "M6.75 3v2.25M17.25 3v2.25M3 18..."},
    {id: 3, option: "Last Modified", svg: "M12 6v6h4.5m4.5 0a9 9 0..."},
    {id: 4, option: "Deployment Status", svg: "M4.5 12.75l6 6 9-13.5"},
];

const pageExamples = {
    page1: {
        createdAt: "1.12.2005",
        updatedAt: "1.1.1111",
        deploymentStatus: "Online"
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
                className="size-5 my-auto mr-2"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d={option.svg}/>
            </svg>
            <div className="my-auto text-lg">{option.option}</div>
        </div>
    );
}

function PageHub({onPageClick, pages, setPages}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
    const [sortReversed, setSortReversed] = useState(false);
    const [pageCreationFormActive, setPageCreationFormActive] = useState(false);
    const [pageNameToEdit, setPageNameToEdit] = useState();
    const {showNotification} = useNotifications();
    const handleError = useErrorHandler();
    pages = pageExamples;

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
            await axios.delete(`/api/pages/${pageName}`);
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
        <div className="w-full h-full flex flex-col ml-4 mr-4">
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
                                d="m21 21-5.197-5.197m0 0A7.5 7.5..."
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full my-auto bg-inherit focus:outline-none"
                        />
                    </div>

                    {/* Sorting + New Page */}
                    <div className="flex ml-auto space-x-4">
                        <Listbox value={sortByOption} onChange={setSortByOption}>
                            <div className="relative">
                                <ListboxButton
                                    className="flex items-center justify-between w-[200px] h-[42px] px-2 border border-ui-border rounded-[5px] bg-ui-bg hover:bg-ui-bg-selected transition"
                                >
                                    {convertOptionToHTML(sortByOption)}
                                </ListboxButton>

                                <ListboxOptions
                                    anchor="bottom start"
                                    className="absolute z-10 mt-1 w-[200px] p-2 pb-0 bg-ui-bg border border-ui-border rounded-[5px] text-text-subtle"
                                >
                                    <div className="text-lg hover:cursor-default text-text mb-2">Sort</div>
                                    {sortByOptions.map((option) => (
                                        <ListboxOption
                                            key={option.id}
                                            value={option}
                                            className="mb-2 text-lg data-[focus]:bg-ui-bg-selected hover:cursor-pointer"
                                        >
                                            {convertOptionToHTML(option)}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>

                        <input
                            type="button"
                            className="btn w-[200px] h-[42px] rounded-[5px] !text-text-on-primary !border-[1px]"
                            value="+ New Page"
                            onClick={() => setPageCreationFormActive(true)}
                        />
                    </div>
                </div>

                <hr className="mt-8 mb-10 border-[1px] border-ui-border"/>

                {/* Table */}
                <div className="scroll-auto">
                    <div className="grid grid-cols-4 border-ui-border">
                        {/* Headers */}
                        <div className="sticky top-0 bg-website-bg">
                            <div
                                className="font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4 rounded-tl-lg">
                                Page Name
                            </div>
                        </div>
                        <div
                            className="sticky top-0 font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4">
                            Created
                        </div>
                        <div
                            className="sticky top-0 font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4">
                            Last Modified
                        </div>
                        <div className="sticky top-0 bg-website-bg">
                            <div
                                className="font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4 rounded-tr-lg">
                                Deployment Status
                            </div>
                        </div>

                        {/* Rows */}
                        {pages != null && Object.entries(pages)
                            .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                            .sort(compareTableEntries)
                            .map(([name, details], index, filtered) => (
                                <Fragment key={name}>
                                    <div
                                        className={`flex p-4 bg-ui-bg border-ui-border border-[1px] ${
                                            index === filtered.length - 1 ? "rounded-bl-lg" : ""
                                        }`}
                                    >
                  <span
                      className="underline text-secondary hover:cursor-pointer"
                      onClick={() => onPageClick(name)}
                  >
                    {name}
                  </span>

                                        {/* Meatball Menu */}
                                        <Listbox>
                                            <ListboxButton className="ml-auto mr-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6.75 12a.75.75 0 1 1-1.5..."
                                                    />
                                                </svg>
                                            </ListboxButton>
                                            <ListboxOptions
                                                anchor="bottom end"
                                                className="p-2 bg-ui-bg border-[1px] border-ui-border rounded-lg text-text"
                                            >
                                                <ListboxOption value="editPage">
                                                    <div
                                                        className="btn bg-inherit hover:bg-ui-bg-selected"
                                                        onClick={() => setPageNameToEdit(name)}
                                                    >
                                                        Edit Page
                                                    </div>
                                                </ListboxOption>
                                                <ListboxOption value="deletePage">
                                                    <div
                                                        className="btn bg-inherit hover:bg-ui-bg-selected"
                                                        onClick={() => handlePageDelete(name)}
                                                    >
                                                        Delete Page
                                                    </div>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </Listbox>
                                    </div>

                                    <div className="p-4 bg-ui-bg border-ui-border border-[1px]">
                                        {new Date(details.createdAt).toLocaleString(navigator.language)}
                                    </div>
                                    <div className="p-4 bg-ui-bg border-ui-border border-[1px]">
                                        {new Date(details.updatedAt).toLocaleString(navigator.language)}
                                    </div>
                                    <div
                                        className={`p-4 bg-ui-bg border-ui-border border-[1px] ${
                                            index === filtered.length - 1 ? "rounded-br-lg" : ""
                                        }`}
                                    >
                                        {details.deploymentStatus || "—"}
                                    </div>
                                </Fragment>
                            ))}
                    </div>
                </div>

                {/* Forms */}
                {pageCreationFormActive && (
                    <CenteredWindowWithBackgroundBlur>
                        <PageCreationForm
                            setPages={setPages}
                            closeForm={() => setPageCreationFormActive(false)}
                        />
                    </CenteredWindowWithBackgroundBlur>
                )}

                {pageNameToEdit && (
                    <CenteredWindowWithBackgroundBlur>
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
                    </CenteredWindowWithBackgroundBlur>
                )}
            </div>
        </div>
    );
}

export default PageHub;