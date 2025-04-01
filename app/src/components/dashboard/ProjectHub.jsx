import React, { useState, Fragment } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";

import axios from '../auth/AxiosInstance';

import ProjectCreationForm from "./ProjectCreationForm";
import ProjectEditForm from "./ProjectEditForm";
import CenteredWindowWithBackgroundBlur from '../general/CenteredWindowWithBackgroundBlur';
import { useNotifications } from "../general/NotificationContext";

const sortByOptions = [
    { id: 1, option: 'Name', svg: 'm10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802' },
    { id: 2, option: 'Date of Creation', svg: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
    { id: 3, option: 'Last Modified', svg: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
    { id: 4, option: 'Page Count', svg: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' },
];

function convertOptionToHTML(option){
    return(
        <div className="flex text-text-subtle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth={1.5} stroke="currentColor" className="size-5 my-auto mr-2">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d={option.svg}/>
            </svg>
            <div className="my-auto text-lg">{option.option}</div>
        </div>
    );
}

function ProjectHub({ onProjectClick, projects, setProjects }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortByOption, setSortByOption] = useState(sortByOptions[0]);
    const [sortReversed, setSortReversed] = useState(false);
    const [projectCreationFormActive, setProjectCreationFormActive] = useState(false);
    const [projectNameToEdit, setProjectNameToEdit] = useState();
    const { showNotification } = useNotifications();

    const compareTableEntries = ([keyA, valueA], [keyB, valueB]) => {
        switch (sortByOption) {
            case sortByOptions[0]: {
                return (keyA > keyB) ^ sortReversed;
            }
            case sortByOptions[1]: {
                return (valueA.createdAt < valueB.createdAt) ^ sortReversed;
            }
            case sortByOptions[2]: {
                return (valueA.updatedAt < valueB.updatedAt) ^ sortReversed;
            }
            case sortByOptions[3]: {
                return (valueA.pageCount < valueB.pageCount) ^ sortReversed;
            }
        }
    };

    const handleProjectDelete = async (projectName) => {
        try{
            const response = await axios.delete(`/api/projects/${projectName}`);

            setProjects((prevProjects) => {
                const updatedProjects = { ...prevProjects };
                delete updatedProjects[projectName];
                return updatedProjects;
            });

            showNotification('success', 'Successfully deleted your project.');
        } catch (err){
            if(err.response.data){
                showNotification('error', err.response.data.message);
            }else{
                showNotification('error', 'There was an issue communicating with our server. Please try again.');
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex">
                {/* Search Bar */}
                <div className="flex w-1/3 p-2 border-[1px] border-ui-border rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6 my-auto text-text-subtle mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e)=>setSearchQuery(e.target.value)}
                        className="w-full my-auto bg-inherit focus:outline-none"
                    />
                </div>


                {/* Sorting Options */}
                <div className="flex ml-auto mr-0">
                    <Listbox value={sortByOption} onChange={setSortByOption}>
                        {/* Selected Sorting Option */}
                        <ListboxButton className="flex mr-[2vw] w-[200px] px-2 border-[1px] border-ui-border rounded-lg">{convertOptionToHTML(sortByOption)}</ListboxButton>

                        {/* Drop-Down-Menu */}
                        <ListboxOptions anchor="bottom start" className="w-[200px] mt-1 p-2 pb-0 bg-ui-bg border-[1px] border-ui-border rounded-lg text-text-subtle">
                            <div className="text-lg hover:cursor-default text-text mb-2">Sort</div>
                            {sortByOptions.map((option) => (
                                <ListboxOption key={option.id} value={option} className="mb-2 text-lg data-[focus]:bg-ui-bg-selected hover:cursor-pointer">
                                    {convertOptionToHTML(option)}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>

                    {/* Create New Project Button */}
                    <input type="button" className="btn rounded" value="+ New Project" onClick={()=>setProjectCreationFormActive(true)}/>
                </div>
            </div>

            {/* Horizontal Rule between Top Bar and Content */}
            <hr className="mt-5 mb-10 border-ui-border"/>

            {/* Projects Table */}
            <div className="overflow-y-scroll">
            <div className="grid grid-cols-4 border-ui-border">
                {/* Table Headers */}
                <div className="sticky top-0 bg-far-bg">
                    <div className="font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4 rounded-tl-lg">Project Name</div>
                </div>
                <div className="sticky top-0 font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4">Created</div>
                <div className="sticky top-0 font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4">Last Modified</div>
                <div className="sticky top-0 bg-far-bg">
                    <div className="font-semibold bg-ui-bg-selected border-ui-border border-[1px] py-2 px-4 rounded-tr-lg">Number of Pages</div>
                </div>

                {/*
                    All the user's projects
                    Filtered by the query from the search bar
                    Sorted by the selected sorting method
                 */}
                {Object.entries(projects)
                    .filter(([projectName]) => projectName.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                    .sort(compareTableEntries)
                    .map(([projectName, projectDetails], index, filteredProjects) => (
                        <Fragment key={projectName}>
                            <div
                                className={`flex p-4 bg-ui-bg border-ui-border border-[1px] ${index === filteredProjects.length - 1 ? 'rounded-bl-lg' : ''}`}>
                                <span className="underline text-secondary hover:cursor-pointer"
                                      onClick={() => onProjectClick(projectName)}>{projectName}</span>

                                {/* Meatball-Menu for each Project*/}
                                <Listbox>
                                    <ListboxButton className="ml-auto mr-0">
                                        {/* Meatball-Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                        </svg>
                                    </ListboxButton>
                                    {/* Option-Container */}
                                    <ListboxOptions anchor="bottom end" className="p-2 bg-ui-bg border-[1px] border-ui-border rounded-lg text-text">
                                        {/* Edit-Option */}
                                        <ListboxOption value="editProject">
                                            <div className="btn bg-inherit hover:bg-ui-bg-selected"
                                                 onClick={()=>setProjectNameToEdit(projectName)}>
                                                Edit Project
                                            </div>
                                        </ListboxOption>
                                        {/* Delete-Option */}
                                        <ListboxOption value="deleteProject">
                                            <div className="btn bg-inherit hover:bg-ui-bg-selected"
                                                 onClick={() => handleProjectDelete(projectName)}>
                                                Delete Project
                                            </div>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                            <div className="p-4 bg-ui-bg border-ui-border border-[1px]">
                                {new Date(projectDetails.createdAt).toLocaleString(navigator.language)}
                            </div>
                            <div className="p-4 bg-ui-bg border-ui-border border-[1px]">
                                {new Date(projectDetails.updatedAt).toLocaleString(navigator.language)}
                            </div>
                            <div className={`p-4 bg-ui-bg border-ui-border border-[1px] ${index === filteredProjects.length - 1 ? 'rounded-br-lg' : ''}`}>
                                {projectDetails.pageCount}
                            </div>
                        </Fragment>
                    ))}
            </div>
            </div>


            {/* Dynamically rendered forms */}

            {/* Project Creation Form */}
            {projectCreationFormActive?
                <CenteredWindowWithBackgroundBlur>
                    <ProjectCreationForm
                        setProjects={setProjects}
                        closeForm={()=>{setProjectCreationFormActive(false)}}/>
                </CenteredWindowWithBackgroundBlur>
                :''}

            {/* Project Edit Form */}
            {projectNameToEdit ?
                <CenteredWindowWithBackgroundBlur>
                    <ProjectEditForm
                        onProjectEdit={
                            (newProjectName, data)=> {
                                setProjects(prevProjects => {
                                    const {[projectNameToEdit]: _, ...updatedProjects} = prevProjects;

                                    return {
                                        ...updatedProjects,
                                        [newProjectName]: data
                                    };
                                });
                            }
                        }
                        projectName={projectNameToEdit} closeForm={()=>{setProjectNameToEdit(undefined)}}
                        projects={projects}
                    />
                </CenteredWindowWithBackgroundBlur>
            : ''}
        </div>
    );
}

export default ProjectHub;