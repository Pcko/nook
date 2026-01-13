import {Component, ProjectData} from "grapesjs";

export interface AIChangeReviewPopupProps {
    open: boolean;
    title?: string;
    baseProjectData: ProjectData;
    focusTargetId?: string | null;
    changes: AIChange[];
    onChange: (changes: AIChange[]) => void;
    onApply: () => void;
    onReject: () => void;
}

export type AIChangeType = "component" | "style";

export interface AIStyleChange {
    id: string;
    type: "style";
    enabled: boolean;
    label: string;
    selectors: string[];
    style: Record<string, Object>;
}

export interface AIComponentChange {
    id: string;
    type: "component";
    enabled: boolean;
    label: string;
    targetId: string;
    component: Component;
}

export type AIChange = AIStyleChange | AIComponentChange;
