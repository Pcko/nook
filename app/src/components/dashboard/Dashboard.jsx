import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../auth/AxiosInstance';

import UserIcon from '../general/UserIcon';
import ProjectHub from "./ProjectHub";
import ProjectDetails from "./ProjectDetails";
import { useNotifications } from "../general/NotificationContext"
import useErrorHandler from "../general/ErrorHandler";

function Dashboard ()  {
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState();
  const [activeTab, setActiveTab] = useState('projects')
  const [userMenuExpanded, setUserMenuExpanded] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const handleError = useErrorHandler();

  useEffect(() => {
    const keys = Object.keys(projects);
    if(!keys.includes(selectedProject)){
      setSelectedProject(keys[0]);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    if(activeTab === 'projects'){
      const getProjects = async ()=>{
        let loadedProjects;

        try{
          const response = await axios.get('/api/projects');
          loadedProjects = response.data;

          {/* Update the dates and page count without deleting the pages cache */}
          setProjects((prevProjects)=>{
            const newProjects = {}
            for(let key in loadedProjects){
              newProjects[key] = {...prevProjects[key], ...loadedProjects[key]};
            }
            return newProjects;
          });

        }catch(err){
          handleError(err);
        }
      }

      getProjects();
    }
  }, [activeTab]);

  useEffect(()=>{
    if(!selectedProject && Object.keys(projects).length !== 0) {
      setSelectedProject(Object.keys(projects)[0]);
    }
    else if(selectedProject && Object.keys(projects).length === 0){
      setSelectedProject(undefined);
    }
  }, [projects]);

  {/* Complete reset of the website */}
  const handleLogout = async () => {
    try{
        const response = await axios.post('/api/settings/logout');
    } catch(err) { }

    localStorage.clear();
    sessionStorage.clear();
    navigate('/');

    showNotification('success', 'Successfully logged out.');
  };

  {/* Navigation to the Project Details Tab with the clicked-on project selected */}
  const switchToProjectDetails = (projectId) => {
    setSelectedProject(projectId)
    setActiveTab('projectDetails');
  }

  {/* Rendering the active tab (e.g. ProjectHub) */}
  const renderTabContent = () => {
    if(projects){
      switch(activeTab){
        case 'projects':
          return <ProjectHub onProjectClick={switchToProjectDetails} projects={projects} setProjects={setProjects}/>
        case 'projectDetails':
          if (Object.keys(projects).length !== 0 || selectedProject) {
            return <ProjectDetails projects={projects} selectedProjectId={selectedProject} setSelectedProjectId={setSelectedProject}/>
          } else {
            return <h1 className="mt-[5vh] text-4xl">Please create a project first before using this tab!</h1>;
          }
      }
    }

    return <div>Loading projects...</div>
  }

  return (
    <div className="flex h-screen bg-website-bg">
      {/* Side Bar */}
      <aside className="w-1/4 pt-[50px] px-[4vw]">
        {/* Drop-Down-Menu Head */}
        <div className="mb-2 flex hover:cursor-pointer" onClick={() => setUserMenuExpanded(!userMenuExpanded)}>
          <UserIcon/>
          <h2 className="my-auto mr-3">{JSON.parse(localStorage.getItem('user')).username}</h2>

          {/* Drop-Down-Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
               stroke="currentColor" className="size-6 my-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d={userMenuExpanded ? "m19.5 8.25-7.5 7.5-7.5-7.5" : "m4.5 15.75 7.5-7.5 7.5 7.5"}/>
          </svg>
        </div>

        {/* Dynamically rendered ContextMenu (logout, link to Settings) */}
        {userMenuExpanded ?
            <div className="w-[80%] hover:cursor-pointer text-text-subtle bg-ui-bg border-[2px] border-ui-border rounded-lg">
              <div className="p-2 border-ui-border border-b-[2px]" onClick={()=>navigate('/settings')}>
                Settings
              </div>
              <div className="p-2" onClick={handleLogout}>
                Log out
              </div>
            </div>
            : ''
        }

        {/* Tab Navigation */}
        <nav className="mt-6">
          {/* Project Details */}
          <div
              className={`flex items-center w-full mb-3 p-2 cursor-pointer rounded ${activeTab === 'projectDetails' ? 'bg-ui-bg-selected' : 'bg-transparent'}`}
              onClick={() => setActiveTab('projectDetails')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="h-5 mr-3 text-text-subtle">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"/>
            </svg>
            <span>Project Details</span>
          </div>

          {/* Project Hub */}
          <div
              className={`flex items-center w-full mb-3 p-2 cursor-pointer rounded ${activeTab === 'projects' ? 'bg-ui-bg-selected' : 'bg-transparent'}`}
              onClick={() => setActiveTab('projects')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="h-5 mr-3 text-text-subtle">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>
            </svg>
            <span>Project Hub</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-6 mt-[50px] mr-[5vw]">
        {/* Projects */}
        {renderTabContent()}
      </main>
    </div>
  );
}

export default Dashboard;