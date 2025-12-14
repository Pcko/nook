import React, {createContext, useContext, useEffect, useState} from "react";

const AnimationContext = createContext();

export function AnimationProvider({children}) {
    const [animationEnabled, setAnimationEnabled] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("animation");
        setAnimationEnabled(stored !== "off"); // apply user's settings or default to true if not set
    }, []);

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

export function useAnimation() {
    return useContext(AnimationContext);
}