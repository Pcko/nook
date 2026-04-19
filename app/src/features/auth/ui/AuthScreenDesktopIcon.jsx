import { useEffect, useRef, useState } from "react";
import React from "react";

/**
 * Renders the crane animation component.
 * @returns {JSX.Element} The rendered crane animation component.
 */
function CraneAnimation() {
    const [progress, setProgress] = useState(0);
    const directionRef = useRef(1); // 1 = up, -1 = down
    const progressRef = useRef(0);

    useEffect(() => {
        let animationFrame;
        const duration = 190000; // ms per half-cycle

        /**
         *
         * @param timestamp
         */
        const animate = (timestamp) => {
            if (!animate.startTime) animate.startTime = timestamp;

            const elapsed = timestamp - animate.startTime;
            let delta = (elapsed / duration) * directionRef.current;
            let newProgress = progressRef.current + delta;

            if (newProgress >= 1) {
                newProgress = 1;
                directionRef.current = -1;
                animate.startTime = timestamp;
                setTimeout(()=>{
                    progressRef.current = newProgress;
                    setProgress(newProgress);
                    animationFrame = requestAnimationFrame(animate);
                }, 1000)
                return;
            } else if (newProgress <= 0) {
                newProgress = 0;
                directionRef.current = 1;
                animate.startTime = timestamp;
            }

            progressRef.current = newProgress;
            setProgress(newProgress);


            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // Positions
    const verticalStartY = 192;
    const verticalEndY = 102;
    const blockStartY = 238;
    const blockEndY = 174;
    const triangleTopYStart = 191.234;

    const easedProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress);
    const blockOffset = (blockStartY - blockEndY) * easedProgress;
    const blockY = blockStartY - blockOffset;
    const triangleY = triangleTopYStart - blockOffset;
    const cableTopY = verticalStartY - blockOffset;

    return (
        <>
            {/* Vertical cable */}
            <path d={`M406.5 ${cableTopY}V${verticalEndY}`} stroke="#666BE2" strokeWidth="2" />
            {/* Triangle / hook */}
            <path
                d={`M469.666 ${blockY}H343.334L406.5 ${triangleY}L469.666 ${blockY}Z`}
                stroke="#666BE2"
                strokeWidth="2"
            />
            {/* Block */}
            <rect
                fill="#EEE1FF"
                height={83}
                rx={9}
                stroke="#666BE2"
                strokeWidth="2"
                width={193}
                x={317}
                y={blockY}
            />
        </>
    );
}

/**
 * Renders the auth screen desktop icon component.
 * @returns {JSX.Element} The rendered auth screen desktop icon component.
 */
function AuthScreenDesktopIcon() {
    return (
        <svg
            fill="none"
            viewBox="0 0 759 543"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Static parts */}
            {/* All static elements */}
            <path d="M671 2L499 76" stroke="#666BE2" strokeWidth="2"/>
            <path d="M691 75L671 49.6988L691 25" stroke="#666BE2" strokeWidth="2"/>
            <path d="M691 51H671" stroke="#666BE2" strokeWidth="2"/>
            <path d="M668 99.7805L407 101L427.03 77.8293L668 76" stroke="#666BE2" strokeWidth="2"/>
            <path
                d="M663 99L641.308 77L620.821 97.7778L597.923 77L578.038 99L555.141 77L534.654 99L512.962 77L491.872 98.3889L470.179 77L446.077 99L428 77"
                stroke="#666BE2"
strokeWidth="2"/>
            <path d="M663 99V76" stroke="#666BE2" strokeWidth="2"/>
            <path d="M641 76V99" stroke="#666BE2" strokeWidth="2"/>
            <path d="M621 76V99" stroke="#666BE2" strokeWidth="2"/>
            <path d="M600 76V99" stroke="#666BE2" strokeWidth="2"/>
            <path d="M578 77V101" stroke="#666BE2" strokeWidth="2"/>
            <path d="M556 77V101" stroke="#666BE2" strokeWidth="2"/>
            <path d="M535 77V101" stroke="#666BE2" strokeWidth="2"/>
            <path d="M513 77V101" stroke="#666BE2" strokeWidth="2"/>
            <path d="M491 77V101" stroke="#666BE2" strokeWidth="2"/>
            <path d="M472 77V101" stroke="#666BE2" strokeWidth="2"/>
            <path d="M446 78V99" stroke="#666BE2" strokeWidth="2"/>
            <path d="M428 80V100" stroke="#666BE2" strokeWidth="2"/>
            <path d="M755 87L691 1" stroke="#666BE2" strokeWidth="2"/>
            <rect fill="#666BE2" height="64" rx="9.5" stroke="#666BE2" width="99" x="631.5" y="478.5"/>
            <rect fill="#666BE2" height="41" rx="9.5" stroke="#666BE2" width="68" x="690.5" y="84.5"/>
            <path
                d="M697.386 480L663 456.438L698 430.458L663 405.688L696.772 379.708L664.228 354.333L695.544 331.375L665.456 302.979L694.93 280.021L666.684 253.438L693.702 228.063L666.684 202.688L692.474 177.917L667.912 151.938L691.86 127.167L669.14 103"
                stroke="#666BE2"
strokeWidth="2"/>
            <line stroke="#666BE2" strokeWidth="3" x1="668.616" x2="661.362" y1="101.716" y2="477.716"/>
            <line stroke="#666BE2"
strokeWidth="3"
transform="matrix(0.019289 0.999814 0.999814 -0.019289 693.714 101.687)"
                  x2="376.07"
                  y1="-1.5"
y2="-1.5"/>
            <line stroke="#666BE2" strokeWidth="2" x1="699" x2="663" y1="457" y2="457"/>
            <line stroke="#666BE2" strokeWidth="2" x1="699" x2="663" y1="431" y2="431"/>
            <line stroke="#666BE2" strokeWidth="2" x1="699" x2="663" y1="405" y2="405"/>
            <line stroke="#666BE2" strokeWidth="2" x1="699" x2="663" y1="379" y2="379"/>
            <line stroke="#666BE2" strokeWidth="2" x1="699" x2="663" y1="354" y2="354"/>
            <line stroke="#666BE2" strokeWidth="2" x1="697" x2="665" y1="331" y2="331"/>
            <line stroke="#666BE2" strokeWidth="2" x1="697" x2="665" y1="302" y2="302"/>
            <line stroke="#666BE2" strokeWidth="2" x1="695" x2="665" y1="279" y2="279"/>
            <line stroke="#666BE2" strokeWidth="2" x1="696" x2="666" y1="254" y2="254"/>
            <line stroke="#666BE2" strokeWidth="2" x1="694" x2="668" y1="226" y2="226"/>
            <line stroke="#666BE2" strokeWidth="2" x1="694" x2="668" y1="202" y2="202"/>
            <line stroke="#666BE2" strokeWidth="2" x1="694" x2="668" y1="178" y2="178"/>
            <line stroke="#666BE2" strokeWidth="2" x1="694" x2="668" y1="151" y2="151"/>
            <line stroke="#666BE2" strokeWidth="2" x1="694" x2="668" y1="126" y2="126"/>
            <rect fill="#666BE2" height="26" stroke="#666BE2" width="25" x="668.5" y="75.5"/>
            <rect fill="#666BE2" height="24" stroke="#666BE2" width="21" x="669.5" y="0.5"/>
            <line stroke="#666BE2" strokeWidth="3" x1="690.378" x2="691.587" y1="0.107669" y2="77.4839"/>
            <line stroke="#666BE2" strokeWidth="3" x1="671.033" x2="668.615" y1="1.38768" y2="77.5549"/>
            <rect height="292" rx="13.5" stroke="#666BE2" strokeWidth="7" width="575" x="3.5" y="116.5"/>
            <path
                d="M565 426.5C572.456 426.5 578.5 420.456 578.5 413V401.5H3.5V413C3.5 420.456 9.54416 426.5 17 426.5H565Z"
                fill="#666BE2"
stroke="#666BE2"
strokeWidth="7"/>
            <rect fill="#666BE2" height="105" stroke="#666BE2" width="52" x="266.5" y="415.5"/>
            <path
                d="M200.435 521.5H383.565C392.366 521.5 399.5 528.634 399.5 537.435C399.5 539.68 397.68 541.5 395.435 541.5H188.565C186.32 541.5 184.5 539.68 184.5 537.435C184.5 528.772 191.413 521.723 200.023 521.505L200.435 521.5Z"
                fill="#666BE2"
stroke="#666BE2"/>
            <rect fill="#C9CBFF" height="82" rx="9" stroke="#666BE2" strokeWidth="2" width="434" x="76" y="273"/>
            <rect fill="#E3F0FF" height="83" rx="9" stroke="#666BE2" strokeWidth="2" width="221" x="76" y="174"/>
            {/* Crane animation */}
            <CraneAnimation />
        </svg>
    );
}

export default React.memo(AuthScreenDesktopIcon);
