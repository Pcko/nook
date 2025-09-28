import {useEffect, useState} from "react";

function AuthScreenDesktopIcon() {
    function CraneHoverAnimation({hover}) {
        const [progress, setProgress] = useState(0);


        useEffect(() => {
            let animationFrame;
            const duration = 2000; // 2s full travel
            const startTimeRef = {current: null};
            const startProgress = progress;

            const animate = (timestamp) => {
                if (!startTimeRef.current) startTimeRef.current = timestamp;
                const elapsed = timestamp - startTimeRef.current;

                let targetProgress = hover ? 1 : 0;
                const deltaProgress = targetProgress - startProgress;
                let newProgress = startProgress + (deltaProgress * (elapsed / duration));

                if (hover && newProgress > 1) newProgress = 1;
                if (!hover && newProgress < 0) newProgress = 0;

                setProgress(newProgress);

                if ((hover && newProgress < 1) || (!hover && newProgress > 0)) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    startTimeRef.current = null;
                }
            };

            animationFrame = requestAnimationFrame(animate);

            return () => cancelAnimationFrame(animationFrame);
        }, [hover]);

        // Original positions
        const verticalStartY = 192;
        const verticalEndY = 102;
        const blockStartY = 238;
        const blockEndY = 174;
        const triangleTopYStart = 191.234;

        const blockOffset = (blockStartY - blockEndY) * progress;
        const blockY = blockStartY - blockOffset;
        const triangleY = triangleTopYStart - blockOffset;
        const cableTopY = verticalStartY - blockOffset;

        return (
            <>
                {/* Vertical cable */}
                <path d={`M406.5 ${cableTopY}V${verticalEndY}`} stroke="#666BE2" strokeWidth="2"/>
                {/* Triangle / hook */}
                <path
                    d={`M469.666 ${blockY}H343.334L406.5 ${triangleY}L469.666 ${blockY}Z`}
                    stroke="#666BE2"
                    strokeWidth="2"
                />
                {/* Block being lifted */}
                <rect x={317} y={blockY} width={193} height={83} rx={9} fill="#EEE1FF" stroke="#666BE2"
                      strokeWidth="2"/>
            </>
        );
    }

    const [hover, setHover] = useState(false);

    return (
        <svg
            width="759"
            height="543"
            viewBox="0 0 759 543"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{cursor: "pointer"}}
        >
            {/* All static elements */}
            <path d="M671 2L499 76" stroke="#666BE2" stroke-width="2"/>
            <path d="M691 75L671 49.6988L691 25" stroke="#666BE2" stroke-width="2"/>
            <path d="M691 51H671" stroke="#666BE2" stroke-width="2"/>
            <path d="M668 99.7805L407 101L427.03 77.8293L668 76" stroke="#666BE2" stroke-width="2"/>
            <path
                d="M663 99L641.308 77L620.821 97.7778L597.923 77L578.038 99L555.141 77L534.654 99L512.962 77L491.872 98.3889L470.179 77L446.077 99L428 77"
                stroke="#666BE2" stroke-width="2"/>
            <path d="M663 99V76" stroke="#666BE2" stroke-width="2"/>
            <path d="M641 76V99" stroke="#666BE2" stroke-width="2"/>
            <path d="M621 76V99" stroke="#666BE2" stroke-width="2"/>
            <path d="M600 76V99" stroke="#666BE2" stroke-width="2"/>
            <path d="M578 77V101" stroke="#666BE2" stroke-width="2"/>
            <path d="M556 77V101" stroke="#666BE2" stroke-width="2"/>
            <path d="M535 77V101" stroke="#666BE2" stroke-width="2"/>
            <path d="M513 77V101" stroke="#666BE2" stroke-width="2"/>
            <path d="M491 77V101" stroke="#666BE2" stroke-width="2"/>
            <path d="M472 77V101" stroke="#666BE2" stroke-width="2"/>
            <path d="M446 78V99" stroke="#666BE2" stroke-width="2"/>
            <path d="M428 80V100" stroke="#666BE2" stroke-width="2"/>
            <path d="M755 87L691 1" stroke="#666BE2" stroke-width="2"/>
            <rect x="631.5" y="478.5" width="99" height="64" rx="9.5" fill="#666BE2" stroke="#666BE2"/>
            <rect x="690.5" y="84.5" width="68" height="41" rx="9.5" fill="#666BE2" stroke="#666BE2"/>
            <path
                d="M697.386 480L663 456.438L698 430.458L663 405.688L696.772 379.708L664.228 354.333L695.544 331.375L665.456 302.979L694.93 280.021L666.684 253.438L693.702 228.063L666.684 202.688L692.474 177.917L667.912 151.938L691.86 127.167L669.14 103"
                stroke="#666BE2" stroke-width="2"/>
            <line x1="668.616" y1="101.716" x2="661.362" y2="477.716" stroke="#666BE2" stroke-width="3"/>
            <line y1="-1.5" x2="376.07" y2="-1.5"
                  transform="matrix(0.019289 0.999814 0.999814 -0.019289 693.714 101.687)"
                  stroke="#666BE2" stroke-width="3"/>
            <line x1="699" y1="457" x2="663" y2="457" stroke="#666BE2" stroke-width="2"/>
            <line x1="699" y1="431" x2="663" y2="431" stroke="#666BE2" stroke-width="2"/>
            <line x1="699" y1="405" x2="663" y2="405" stroke="#666BE2" stroke-width="2"/>
            <line x1="699" y1="379" x2="663" y2="379" stroke="#666BE2" stroke-width="2"/>
            <line x1="699" y1="354" x2="663" y2="354" stroke="#666BE2" stroke-width="2"/>
            <line x1="697" y1="331" x2="665" y2="331" stroke="#666BE2" stroke-width="2"/>
            <line x1="697" y1="302" x2="665" y2="302" stroke="#666BE2" stroke-width="2"/>
            <line x1="695" y1="279" x2="665" y2="279" stroke="#666BE2" stroke-width="2"/>
            <line x1="696" y1="254" x2="666" y2="254" stroke="#666BE2" stroke-width="2"/>
            <line x1="694" y1="226" x2="668" y2="226" stroke="#666BE2" stroke-width="2"/>
            <line x1="694" y1="202" x2="668" y2="202" stroke="#666BE2" stroke-width="2"/>
            <line x1="694" y1="178" x2="668" y2="178" stroke="#666BE2" stroke-width="2"/>
            <line x1="694" y1="151" x2="668" y2="151" stroke="#666BE2" stroke-width="2"/>
            <line x1="694" y1="126" x2="668" y2="126" stroke="#666BE2" stroke-width="2"/>
            <rect x="668.5" y="75.5" width="25" height="26" fill="#666BE2" stroke="#666BE2"/>
            <rect x="669.5" y="0.5" width="21" height="24" fill="#666BE2" stroke="#666BE2"/>
            <line x1="690.378" y1="0.107669" x2="691.587" y2="77.4839" stroke="#666BE2" stroke-width="3"/>
            <line x1="671.033" y1="1.38768" x2="668.615" y2="77.5549" stroke="#666BE2" stroke-width="3"/>
            <rect x="3.5" y="116.5" width="575" height="292" rx="13.5" stroke="#666BE2" stroke-width="7"/>
            <path
                d="M565 426.5C572.456 426.5 578.5 420.456 578.5 413V401.5H3.5V413C3.5 420.456 9.54416 426.5 17 426.5H565Z"
                fill="#666BE2" stroke="#666BE2" stroke-width="7"/>
            <rect x="266.5" y="415.5" width="52" height="105" fill="#666BE2" stroke="#666BE2"/>
            <path
                d="M200.435 521.5H383.565C392.366 521.5 399.5 528.634 399.5 537.435C399.5 539.68 397.68 541.5 395.435 541.5H188.565C186.32 541.5 184.5 539.68 184.5 537.435C184.5 528.772 191.413 521.723 200.023 521.505L200.435 521.5Z"
                fill="#666BE2" stroke="#666BE2"/>
            <rect x="76" y="273" width="434" height="82" rx="9" fill="#C9CBFF" stroke="#666BE2" stroke-width="2"/>
            <rect x="76" y="174" width="221" height="83" rx="9" fill="#E3F0FF" stroke="#666BE2" stroke-width="2"/>
            {/* Lifted block / crane animation */}
            <CraneHoverAnimation hover={hover}/>
        </svg>
    );
}

export default AuthScreenDesktopIcon;
