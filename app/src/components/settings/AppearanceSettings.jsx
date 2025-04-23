import { useState } from 'react'
import HR from './SettingsHR';
import ThemePreview from "./ThemePreview";

const availableThemes = ['system', 'dark', 'light', 'volcano', 'forest', 'legacy', 'neon-pulse', 'daylight', 'cosmic'];

function AppearanceSettings({changeHandler, options}){
    const {accessibility:originalAccessibility} = options;
    const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'system');

    const handleThemeChange = (selectedOption) => {
        const oldTheme = localStorage.getItem('theme') || 'system';
        localStorage.setItem('theme', selectedOption);
        setSelectedTheme(selectedOption);

        if(oldTheme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.classList.remove('light');
        }

        if (selectedOption === 'system') {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.documentElement.classList.add('light');
            }
        } else {
            document.documentElement.classList.remove(oldTheme);
            document.documentElement.classList.add(selectedOption);
        }
    };

    const handleAccessibilityModeChange = (selectedOption)=>{
        const oldSetting = localStorage.getItem('accessibility');

        localStorage.setItem('accessibility', selectedOption);

        if(oldSetting === 'high-contrast') {
            document.documentElement.classList.remove('high-contrast');
        }

        if(selectedOption === 'high-contrast'){
            document.documentElement.classList.add('high-contrast');
        }
    };

    return (
        <div>
            <h1 className="text-5xl mb-10">Appearance</h1>

            <div className="w-full py-3 px-5 border-ui-border border-[1px] bg-ui-bg rounded-lg">

                <h2 className="mb-3">Interface Theme</h2>

                <div className="flex flex-wrap gap-5 mx-5">
                    {availableThemes.map(theme => (
                        <div onClick={()=>{handleThemeChange(theme)}}>
                            <ThemePreview theme={theme}/>
                            <label className="w-10/12 m-auto">
                                <input type="radio"
                                       value={theme}
                                       checked={selectedTheme === theme}
                                       className="mr-1"
                                />
                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>

                <HR/>

                <div className="grid grid-cols-2 mb-2">
                    <h2>Accessibility</h2>
                    <select defaultValue={originalAccessibility}
                            onChange={(e)=>handleAccessibilityModeChange(e.target.value)}
                            className="w-1/2 ml-auto mr-0 p-1 rounded text-text text-center bg-ui-bg border-ui-border border-[1px]">
                        <option value="normal">Normal</option>
                        <option value="high-contrast">High Contrast</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default AppearanceSettings;