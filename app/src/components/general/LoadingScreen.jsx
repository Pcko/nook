import BackgroundText from '../general/NookBackground';
import { motion } from 'framer-motion';

export function LoadingBubble() {
    return <div className="flex flex-col items-center">
        <motion.div
            className="w-16 h-16 border-4 border-ui-border-selected border-t-transparent rounded-full "
            animate={{rotate: 360}}
            transition={{repeat: Infinity, duration: 1, ease: 'linear'}}
        />
        <h2 className="text-2xl mt-5">Loading...</h2>
        <p className="text-ui-subtle mt-2">Please wait while we prepare everything for you.</p>
    </div>;
}

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText/>
            <div id="Window"
                 className="w-[500px] text-text bg-ui-bg border-[1px] border-ui-border rounded-[10px] z-10 p-10">
                {LoadingBubble()}
            </div>
        </div>
    );
}

export default LoadingScreen;