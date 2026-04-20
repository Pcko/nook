import {motion} from "framer-motion";
import {useState} from 'react'

import {useAnimation} from "../context/AnimationContext";

import AccessibilityDropdown from "./AccessibilityDropdown";
import HR from './SettingsHR';
import ThemePreview from "./ThemePreview";

const availableThemes = ['system', 'dark', 'light'];

/**
 * Renders the appearance settings component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.changeHandler - The change handler value.
 * @param {any} props.options - The options value.
 * @returns {JSX.Element} The rendered appearance settings component.
 */
function AppearanceSettings({changeHandler, options}) {
    const {accessibility: originalAccessibility} = options;

    const [selectedAccessibility, setSelectedAccessibility] = useState(originalAccessibility);
    const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'system');

    const {toggleAnimation, animationEnabled} = useAnimation();

    /**
     *
     * @param selectedOption
     */
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

    /**
     *
     * @param selectedOption
     */
    const handleAccessibilityModeChange = (selectedOption) => {
        const oldSetting = localStorage.getItem('accessibility');

        localStorage.setItem('accessibility', selectedOption);

        if (oldSetting === 'high-contrast') {
            document.documentElement.classList.remove('high-contrast');
        }

        if (selectedOption === 'high-contrast') {
            document.documentElement.classList.add('high-contrast');
        }

        setSelectedAccessibility(selectedOption);
    };

    /**
 * Handles animation toggle change.
 */
    const handleAnimationToggleChange = () => {
        toggleAnimation();
    };

    return (
        <div>
            <h1 className="font-medium mb-10">Appearance</h1>

            <div className="w-full py-3 px-5 mb-1 border-ui-border border bg-ui-bg rounded-[5px]">
                <p className="mb-3 font-semibold">Interface Theme</p>

                <div className="flex flex-wrap gap-5 ml-9">
                    {availableThemes.map(theme => (
                        <div onClick={() => {
                            handleThemeChange(theme)
                        }}>
                            <ThemePreview isSelected={selectedTheme === theme} theme={theme}/>
                            <label className="w-10/12 m-auto">
                                <input checked={selectedTheme === theme}
                                       className="mr-1 mt-2 accent-primary hover:bg-secondary checked:bg-primary"
                                       type="radio"
                                       value={theme}
                                />
                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>

                <HR/>
                <div className="grid grid-cols-2 mb-2">
                    <p className="font-semibold mt-1">Accessibility</p>
                    <AccessibilityDropdown
                        onChange={handleAccessibilityModeChange}
                        options={["normal", "high-contrast"]}
                        selected={selectedAccessibility}
                    />
                </div>
                <div className="grid grid-cols-2 mb-2">
                    <p className="font-semibold mt-1">Animations</p>
                    <motion.div
                        aria-checked={animationEnabled}
                        className={`w-1/2 p-1 ml-auto mr-0 border-2 cursor-pointer select-none rounded-[5px] transition-colors text-center ${
                            animationEnabled
                                ? 'bg-primary border-ui-border-selected text-text-on-primary'
                                : 'bg-ui-bg-ui-bg border-ui-border text-ui-text'
                        }`}
                        onClick={handleAnimationToggleChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnimationToggleChange()}
                        role="switch"
                        tabIndex={0}
                        whileTap={{scale: 0.9}}
                    >
                        {animationEnabled ? ' On' : ' Off'}
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

export default AppearanceSettings;