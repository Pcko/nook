import React, { useEffect } from 'react';

const BackgroundWithText = () => {

    useEffect(() => {
        const createBackgroundText = () => {
            // Create a container for the "nook" text
            const container = document.createElement('div');
            container.classList.add('absolute','text-primary', 'top-0', 'left-0', 'w-full', 'h-full', 'overflow-hidden','select-none');
            document.body.appendChild(container);

            // Create the text element ("nook")
            const textElement = document.createElement('div');
            textElement.textContent = "nook";
            textElement.classList.add(
                'text-xl',
                'font-bold',
                'text-secondary',
                'opacity-65',
                'transform',
                'rotate-[-45deg]',
                'absolute'
            );

            let xPos = 0;
            let yPos = 0;
            const spacing = 200;  // Adjust spacing for the repeated text

            textElement.style.fontSize = '3rem';

            // Fill the screen with repeated "nook" text
            while (yPos < window.innerHeight*18) {
                while (xPos < window.innerWidth*18) {
                    const clone = textElement.cloneNode(true);
                    clone.style.left = `${xPos}px`;
                    clone.style.top = `${yPos}px`;
                    container.appendChild(clone);
                    xPos += spacing;
                }
                xPos = 0;
                yPos += spacing;
            }
        };

        // Call the function when the component is mounted
        createBackgroundText();

        // Cleanup when the component unmounts
        return () => {
            const container = document.querySelector('div.absolute');
            if (container) {
                container.remove();
            }
        };
    }, []);

    return null; // No need to render anything for the background component itself
};

export default BackgroundWithText;
