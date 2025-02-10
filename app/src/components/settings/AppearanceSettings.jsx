import { useState } from 'react'
import HR from './SettingsHR';

import systemThemeIcon from '../../assets/resources/icons/system-theme.jpg';
import darkThemeIcon from '../../assets/resources/icons/dark-theme.jpg';
import lightThemeIcon from '../../assets/resources/icons/light-theme.jpg';

function AppearanceSettings({changeHandler, options}){
    const {accessibility:originalAccessibility} = options;
    const originalTheme = localStorage.getItem('theme') || 'system';
    const [selectedTheme, setSelectedTheme] = useState(originalTheme);
    const handleThemeChange = (selectedOption) => {
        setSelectedTheme(selectedOption);
        //changeHandler('theme', selectedOption);

        localStorage.setItem('theme', selectedOption);

        if(selectedOption === 'light' || (selectedOption === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)){
            document.documentElement.classList.add('light');
        }else{
            document.documentElement.classList.remove('light');
        }
    };

    return (
        <div>
            <h1 className="text-5xl mb-10">Appearance</h1>

            <div className="w-full py-3 px-5 border-ui-border border-[1px] bg-ui-bg rounded-lg">

                <h2 className="mb-3">Interface Theme</h2>

                <div className="grid grid-cols-3 mx-10">
                    <img src={systemThemeIcon} className="w-10/12 m-auto border-[2px] border-ui-border rounded-[5px]" onClick={()=>{handleThemeChange('system')}}/>
                    <img src={darkThemeIcon} className="w-10/12 m-auto border-[2px] border-ui-border rounded-[5px]" onClick={()=>{handleThemeChange('dark')}}/>
                    <img src={lightThemeIcon} className="w-10/12 m-auto border-[2px] border-ui-border rounded-[5px]" onClick={()=>{handleThemeChange('light')}}/>

                    <label className="w-10/12 m-auto">
                        <input type="radio"
                               value="system"
                               onChange={(e)=>{handleThemeChange(e.target.value)}}
                               checked={selectedTheme === 'system'}
                               className="mr-1"
                        />
                        System
                    </label>
                    <label className="w-10/12 m-auto">
                        <input type="radio"
                               value="dark"
                               onChange={(e)=>{handleThemeChange(e.target.value)}}
                               checked={selectedTheme === 'dark'}
                               className="mr-1"
                        />
                        Dark
                    </label>
                    <label className="w-10/12 m-auto">
                        <input type="radio"
                               value="light"
                               onChange={(e)=>{handleThemeChange(e.target.value)}}
                               checked={selectedTheme === 'light'}
                               className="mr-1"
                        />
                        Light
                    </label>
                </div>

                <HR/>

                <div className="grid grid-cols-2 mb-2">
                    <h2>Accessibility</h2>
                    <select defaultValue={originalAccessibility}
                            onChange={(e)=>changeHandler('accessibility', e.target.value)}
                            className="w-1/2 ml-auto mr-0 p-1 rounded text-white text-center bg-ui-bg border-ui-border border-[1px]">
                        <option value="normal">Normal</option>
                        <option value="placeholder">Placeholder</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default AppearanceSettings;