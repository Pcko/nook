import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import axios from '../auth/AxiosInstance';

import pagePreview from '../../assets/resources/page_preview.png';
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";
import PageCreationForm from "./PageCreationForm";
import PageEditForm from "./PageEditForm";
import { useNotifications } from "../general/NotificationContext";

function ProjectDetails({projects, selectedProjectId, setSelectedProjectId}){
    const [pages, setPages] = useState(projects[selectedProjectId].pages);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageCreationFormActive, setPageCreationFormActive] = useState(false);
    const [pageNameToEdit, setPageNameToEdit] = useState();
    const [minimizedFolders, setMinimizedFolders] = useState(new Set([]));
    const navigate = useNavigate();
    const { showNotification } = useNotifications();

    useEffect(() => {
        setPages(projects[selectedProjectId].pages)
    }, [selectedProjectId]);

    useEffect(()=>{
        if(pages){
            projects[selectedProjectId].pages = pages;
        }
    }, [pages]);

    useEffect(()=>{
        const getProjectInfo = async () => {
            while(!projects[selectedProjectId].pages){
                try{
                    const response = await axios.get(`/api/projects/${selectedProjectId}`);
                    const { pages } = response.data;

                    if(!pages){
                        throw Error('bad server response');
                    }

                    projects[selectedProjectId].pages = pages;
                    setPages(projects[selectedProjectId].pages);
                }catch (err) {
                    console.error(err.message);

                    {/* retry after 2.5 seconds */}
                    await new Promise(resolve => setTimeout(resolve, 2500));
                }
            }
        };

        getProjectInfo();
    }, [selectedProjectId]);

    const PageCard = ({ children, pageName }) => {
        return (
            <div className="w-[240px]">
                <div className="flex items-center p-2 bg-ui-bg border-[1px] border-ui-border rounded-lg">
                    <img
                        src={pagePreview}
                        alt="page preview"
                        className="m-auto hover:cursor-pointer"
                        onClick={()=>{
                            navigate(`/editor/${selectedProjectId}/${pageName}`, { state: pages[pageName].data });
                        }}/>
                </div>
                {children}
            </div>
        );
    };

    const handlePageDelete = async (pageName) =>{
        try{
            const response = await axios.delete(`/api/projects/${selectedProjectId}/pages/${pageName}`);
            setPages((prevPages)=>{
                const updatedPages = { ...prevPages };
                delete updatedPages[pageName];
                return updatedPages;
            })

            showNotification('success', 'Successfully deleted your page.');
        } catch (err){
            if(err.response.data){
                showNotification('error', err.response.data.message);
            }else{
                showNotification('error', 'There was an issue trying to communicate with our server. Please try again later.')
            }
        }
    };

    return (
      <div className="w-full h-full flex flex-col">
          {/* Top Bar */}
          <div className="flex">
              {/* Project Selector */}
              <Listbox value={selectedProjectId} onChange={setSelectedProjectId}>
                  {/* Selected Sorting Option */}
                  <ListboxButton className="flex mr-[2vw] w-[200px] px-2">
                      <div className="flex-1 my-auto mr-2 text-2xl overflow-hidden whitespace-nowrap text-ellipsis">{selectedProjectId}</div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className="size-5 my-auto ml-auto mr-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                      </svg>
                  </ListboxButton>

                  {/* Drop-Down-Menu */}
                  <ListboxOptions anchor="bottom start"
                                  className="w-[200px] mt-1 p-2 pb-0 bg-ui-bg border-[1px] border-ui-border rounded-lg text-text-subtle">
                      {Object.keys(projects).map((projectId) => (
                          <ListboxOption key={projectId} value={projectId}
                                         className="mb-2 text-lg data-[focus]:bg-ui-bg-selected hover:cursor-pointer">
                              {/* Hide project name overflow by default */}
                              <div
                                  className="overflow-hidden whitespace-nowrap text-ellipsis">
                                  {projectId}
                              </div>
                          </ListboxOption>
                      ))}
                  </ListboxOptions>
              </Listbox>

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

              {/* Create New Page Button */}
              <input type="button" className="btn rounded ml-auto mr-0" value="+ New Page" onClick={()=>setPageCreationFormActive(true)}/>
          </div>

          {/* Horizontal Rule between Top Bar and Content */}
          <hr className="mt-5 mb-10 border-ui-border"/>

          {/* Conditionally render pages or 'loading' message */}
          {pages ?
          <div className="flex flex-wrap gap-4 overflow-y-scroll">
              {Object.entries(Object.entries(pages)
                  .filter(([pageName]) => pageName.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                  .reduce((accumulator, [currentName, currentValue])=>{
                      const folder = currentValue.folderName;
                      if(!accumulator[folder]){
                          accumulator[folder] = {}
                      }
                      accumulator[folder][currentName] = currentValue;
                      return accumulator;
                  }, {}))
                  .sort(([folderA], [folderB]) => {
                      if (folderA === 'General') return -1;
                      if (folderB === 'General') return 1;
                      return folderA.localeCompare(folderB);
                  })
                  .map(([folder, pages])=>{
                    return(
                        <Fragment key={folder}>
                            <h1 className="w-full bg-ui-bg px-2 py-1 text-2xl rounded hover:cursor-pointer" onClick={()=>{
                                setMinimizedFolders(oldMinimizedFolders=>{
                                    const newMinimizedFolders = new Set(oldMinimizedFolders);
                                    if(newMinimizedFolders.has(folder)){
                                        newMinimizedFolders.delete(folder);
                                    }
                                    else{
                                        newMinimizedFolders.add(folder);
                                    }
                                    return newMinimizedFolders;
                                });
                            }}>{folder}</h1>
                            {!minimizedFolders.has(folder) ? Object.entries(pages)
                                .map(([pageName, pageDetails], index, filteredPages) => {
                                    return(
                                        <Fragment key={pageName}>
                                            {<PageCard pageName={pageName}>
                                                <div className="flex mt-1 mx-3">
                                                    <div className="my-auto overflow-hidden text-ellipsis">
                                                        {pageName}
                                                    </div>

                                                    {/* Meatball-Menu for each Page*/}
                                                    <Listbox>
                                                        <ListboxButton className="my-auto ml-auto mr-0">
                                                            {/* Meatball-Icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                 strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                                            </svg>
                                                        </ListboxButton>

                                                        {/* Option-Container */}
                                                        <ListboxOptions anchor="bottom end" className="p-2 bg-ui-bg border-[1px] border-ui-border rounded-lg text-text">
                                                            {/* Edit-Option */}
                                                            <ListboxOption value="editProject">
                                                                <div className="btn bg-inherit hover:bg-ui-bg-selected"
                                                                     onClick={()=>setPageNameToEdit(pageName)}>
                                                                    Edit Page
                                                                </div>
                                                            </ListboxOption>

                                                            {/* Delete-Option */}
                                                            <ListboxOption value="deleteProject">
                                                                <div className="btn bg-inherit hover:bg-ui-bg-selected"
                                                                     onClick={()=>handlePageDelete(pageName)}>
                                                                    Delete Page
                                                                </div>
                                                            </ListboxOption>
                                                        </ListboxOptions>
                                                    </Listbox>
                                                </div>
                                            </PageCard>}
                                        </Fragment>
                                    );
                                }) : ''
                            }
                        </Fragment>
                    )
                  })
              }
          </div>
          :
          <div>
              loading pages...
          </div>
          }

          {/* Page Creation Form */}
          {pageCreationFormActive?
              <CenteredWindowWithBackgroundBlur>
                  <PageCreationForm
                      pages={pages}
                      setPages={setPages}
                      projects={projects}
                      selectedProjectId={selectedProjectId}
                      closeForm={()=>{setPageCreationFormActive(false)}}/>
              </CenteredWindowWithBackgroundBlur>
          :''}

          {/* Page Edit Form */}
          {pageNameToEdit?
            <CenteredWindowWithBackgroundBlur>
                <PageEditForm
                    pages={pages}
                    pageName={pageNameToEdit}
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    closeForm={()=>{setPageNameToEdit(undefined)}}/>
            </CenteredWindowWithBackgroundBlur>
          :''}
      </div>
    );
}

export default ProjectDetails;