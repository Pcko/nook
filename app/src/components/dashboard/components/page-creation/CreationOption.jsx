import {motion} from "framer-motion";
import React from "react";

/**
 * CreationOption component
 *
 * Displays one selectable option (manual or AI). Used inside PageCreationChooseStep.
 *
 * @param {Object} props
 * @param {JSX.Element} props.icon - The icon to display next to the option title.
 * @param {string} props.title - Title of the option.
 * @param {string} props.description - Short explanation of the option.
 * @param {string} props.actionText - Text displayed at the bottom as a call to action.
 * @param {Function} props.onClick - Click handler triggered when the option is chosen.
 * @returns {JSX.Element}
 */
export const CreationOption = ({icon, title, description, actionText, onClick}) => (
    <motion.div
        className="flex-1 p-4 border-2 border-ui-border rounded-[6px] bg-website-bg
                   hover:border-primary hover:shadow-md transition-colors"
        onClick={onClick}
        role="button"
        tabIndex={0}
        whileHover={{y: -3}}
        whileTap={{scale: 0.97}}
    >
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h6 className="font-semibold m-0 text-text">{title}</h6>
        </div>

        <p className="text-small text-text-subtle leading-snug">{description}</p>
        <p className="mt-4 text-right text-small font-semibold text-primary">
            {actionText}
        </p>
    </motion.div>
);