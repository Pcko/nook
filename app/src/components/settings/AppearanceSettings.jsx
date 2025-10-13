import { useState } from 'react'
import HR from './SettingsHR';
import ThemePreview from "./ThemePreview";

const availableThemes = ['system', 'dark', 'light'];

function AppearanceSettings({changeHandler, options}){
    const {accessibility:originalAccessibility} = options;
    const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'system');

    const handleThemeChange = (selectedOption) => {
        const oldTheme = localStorage.getItem('theme') || 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        localStorage.setItem('theme', selectedOption);
        setSelectedTheme(selectedOption);

        if(oldTheme === 'system') {
            document.documentElement.classList.remove(systemTheme);
        } else {
            document.documentElement.classList.remove(oldTheme);
        }

        if (selectedOption === 'system') {
            document.documentElement.classList.add(systemTheme);
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
            <h1 className="mb-10">Appearance</h1>

            <div className="w-full py-3 px-5 border-ui-border border-[1px] bg-ui-bg rounded-lg">

                <p className="mb-3 font-bold">Interface Theme</p>

                <div className="flex flex-wrap gap-5 mx-5">
                    {availableThemes.map(theme => (
                        <div onClick={()=>{handleThemeChange(theme)}}>
                            <ThemePreview theme={theme}/>
                            <label className="w-10/12 m-auto">
                                <input type="radio"
                                       value={theme}
                                       checked={selectedTheme === theme}
                                       className="mr-1 mt-3"
                                />
                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>

                <HR/>

                <div className="grid grid-cols-2 mb-2">
                    <p className="font-bold">Accessibility</p>
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