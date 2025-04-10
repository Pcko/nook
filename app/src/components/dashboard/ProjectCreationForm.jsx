import { useState } from 'react';
import axios from '../auth/AxiosInstance';
import { isInvalidStringForURL } from "../general/FormChecks";
import { useNotifications } from "../general/NotificationContext";

function ProjectCreationForm({ closeForm, setProjects }){
    const [projectName, setProjectName] = useState('');
    const { showNotification } = useNotifications();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        /* Form Checks */
        const result = isInvalidStringForURL(projectName);
        if(result){
            return showNotification('error', result);
        }

        try{
            const response = await axios.post('/api/projects', { projectName });

            setProjects((prevProjects) => {
                const updatedProjects = { ...prevProjects };
                updatedProjects[response.data.projectName] = response.data.projectDetails;
                return updatedProjects;
            });

            showNotification('success', 'Successfully added your new project.');
        }catch (err) {
            return showNotification('error', 'There was an issue communicating with our servers.');
        }

        closeForm();
    };

    return (
        <div className="bg-ui-bg border-[1px] border-ui-border rounded-lg w-[30vw]">
            <div className="flex px-2 py-3 border-b-[1px] border-ui-border">
                <h1 className="text-xl">Name your Project</h1>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-5 ml-auto mr-1 hover:cursor-pointer" onClick={()=>closeForm()}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </div>

            <form onSubmit={handleFormSubmit} className="m-3 mt-4">
                <label htmlFor="projectName" className="block mb-1">Project Name</label>
                <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    required
                    minLength="2"
                    className="w-full h-8 px-2 border-ui-border focus:border-ui-border-selected focus:outline-none border-[1px] rounded bg-ui-bg mb-3"
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    placeholder="Example: My Project"
                />
                <div className="flex mt-2">
                    <div className="mr-0 ml-auto">
                        <input type="button" value="Cancel" onClick={() => closeForm()} className="py-1 px-4 bg-ui-button rounded-lg mr-3 hover:cursor-pointer"/>
                        <input type="submit" value="Create Project" className="py-1 px-4 bg-primary text-text-on-primary rounded-lg hover:cursor-pointer"/>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProjectCreationForm;