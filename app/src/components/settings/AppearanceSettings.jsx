import { useState } from 'react'
import HR from './SettingsHR';

import systemThemeIcon from '../../assets/resources/icons/system-theme.jpg';
import darkThemeIcon from '../../assets/resources/icons/dark-theme.jpg';
import lightThemeIcon from '../../assets/resources/icons/light-theme.jpg';

function AppearanceSettings({changeHandler, options}){
    const {accessibility:originalAccessibility, theme:originalTheme} = options;
    const [selectedTheme, setSelectedTheme] = useState(originalTheme);

    const handleThemeChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedTheme(selectedOption); // Update the selected value
        changeHandler('theme', selectedOption); // Call changeHandler with 'theme' and the selected value
    };

    return (
        <div>
            <h1 className="text-5xl mb-10">Appearance</h1>

            <div className="w-full py-3 px-5 border-ui-border border-[1px] bg-ui-bg rounded-lg">

                <h2 className="mb-3">Interface Theme</h2>

                <div className="grid grid-cols-3 mx-10">
                    <img src={systemThemeIcon} onClick={()=>{setSelectedTheme('system'); changeHandler('theme', 'system');}}/>
                    <img src={darkThemeIcon} onClick={()=>{setSelectedTheme('dark'); changeHandler('theme', 'dark');}}/>
                    <img src={lightThemeIcon} onClick={()=>{setSelectedTheme('light'); changeHandler('theme', 'light');}}/>

                    <label>
                        <input type="radio"
                               value="system"
                               onChange={handleThemeChange}
                               checked={selectedTheme === 'system'}
                               className="mr-1"
                        />
                        System
                    </label>
                    <label>
                        <input type="radio"
                               value="dark"
                               onChange={handleThemeChange}
                               checked={selectedTheme === 'dark'}
                               className="mr-1"
                        />
                        Dark
                    </label>
                    <label>
                        <input type="radio"
                               value="light"
                               onChange={handleThemeChange}
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