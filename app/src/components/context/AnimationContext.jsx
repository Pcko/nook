import React, {createContext, useContext, useEffect, useState} from "react";

const AnimationContext = createContext();

/**
 * Renders the animation provider component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.children - Nested content rendered inside the component.
 * @returns {JSX.Element} The rendered animation provider component.
 */
export function AnimationProvider({children}) {
    const [animationEnabled, setAnimationEnabled] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("animation");
        setAnimationEnabled(stored !== "off"); // apply user's settings or default to true if not set
    }, []);

    /**
 * Toggles animation.
 */
    const toggleAnimation = () => {
        const newValue = !animationEnabled;
        setAnimationEnabled(newValue);
        localStorage.setItem("animation", newValue ? "on" : "off");
    };

    return (
        <AnimationContext.Provider value={{animationEnabled, toggleAnimation}}>
            {children}
        </AnimationContext.Provider>
    );
}

/**
 * Provides the use animation hook.
 */
export function useAnimation() {
    return useContext(AnimationContext);
}