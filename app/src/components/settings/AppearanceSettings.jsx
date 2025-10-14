import {useState} from 'react'
import HR from './SettingsHR';
import ThemePreview from "./ThemePreview";
import AccessibilityDropdown from "./AccessibilityDropdown";

const availableThemes = ['system', 'dark', 'light'];

function AppearanceSettings({changeHandler, options}) {
    const {accessibility: originalAccessibility} = options;
    const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'system');

    const handleThemeChange = (selectedOption) => {
        const oldTheme = localStorage.getItem('theme') || 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        localStorage.setItem('theme', selectedOption);
        setSelectedTheme(selectedOption);

        if (oldTheme === 'system') {
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

    const handleAccessibilityModeChange = (selectedOption) => {
        const oldSetting = localStorage.getItem('accessibility');

        localStorage.setItem('accessibility', selectedOption);

        if (oldSetting === 'high-contrast') {
            document.documentElement.classList.remove('high-contrast');
        }

        if (selectedOption === 'high-contrast') {
            document.documentElement.classList.add('high-contrast');
        }
    };

    return (
        <div>
            <h1 className="font-medium mb-10">Appearance</h1>

            <div className="w-full py-3 px-5 border-ui-border border bg-ui-bg rounded-[5px]">

                <p className="mb-3 font-semibold">Interface Theme</p>

                <div className="flex flex-wrap gap-5 ml-9">
                    {availableThemes.map(theme => (
                        <div onClick={() => {
                            handleThemeChange(theme)
                        }}>
                            <ThemePreview theme={theme} isSelected={selectedTheme === theme}/>
                            <label className="w-10/12 m-auto">
                                <input type="radio"
                                       value={theme}
                                       checked={selectedTheme === theme}
                                       className="mr-1 mt-2 accent-primary hover:bg-secondary checked:bg-primary"
                                />
                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>

                <HR/>

                <div className="grid grid-cols-2 mb-2">
                    <p className="font-semibold">Accessibility</p>
                    <AccessibilityDropdown
                        options={["normal", "high-contrast"]}
                        selected={originalAccessibility}
                        onChange={handleAccessibilityModeChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default AppearanceSettings;