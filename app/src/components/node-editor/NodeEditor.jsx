import React, {useEffect, useRef, useState} from "react";
import {Button, Tab} from "@headlessui/react";
import NodeEditorPage from "./NodeEditorPage";
import {useNotifications} from "../general/NotificationContext";
import {ArrangeIcon, ExitIcon, ExportIcon, ImportIcon, SettingsIcon} from "../general/Icons";

/**
 * Main Node Editor component that provides a tabbed interface for working with multiple node graphs.
 *
 * Features include:
 * - Tab management for multiple graphs
 * - Import/export functionality for graph state
 * - Keyboard shortcuts
 * - Graph arrangement tools
 * - Integration with NodeEditorPage for individual graph editing
 *
 * @param {Object} props - Component properties
 * @param {Component} props.element - Reference to the GrapesJS element
 * @param {Function} props.onClose - Callback function to navigate back
 *
 * @returns {JSX.Element} The rendered component
 *
 * @example
 * <NodeEditor
 *   element={grapesjsElementRef}
 *   goBack={() => navigateBack()}
 * />
 */
function NodeEditor({element, onClose}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tabList, setTabList] = useState([]);
    const [arrangeNodes, setArrangeNodes] = useState(() => {});
    const [reloadPage, setReloadPage] = useState(false);
    const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);

    // Refs for DOM manipulation and state tracking
    const tabListRef = useRef(null);

    const {showNotification} = useNotifications();


    /**
     * Initializes the editor on component mount
     */
    useEffect(() => {
        const givenElement = element;
        const tabName = givenElement?.getName() || givenElement?.get("tagName");
        const loadedTabs = JSON.parse(sessionStorage.getItem("tabs") || "[]");

        if (tabList.length === 0) {
            setTabList(loadedTabs);
        }

        // Set up keyboard shortcut (Ctrl+Shift+Q to go back)
        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && event.shiftKey && event.key === "Q") {
                event.preventDefault();
                onClose();
            }
        });

        addTab(tabName, givenElement);
    }, []);

    /**
     * Persists tabs to session storage when they change
     */
    useEffect(() => {
        sessionStorage.setItem("tabs", JSON.stringify(tabList));
    }, [tabList]);

    /**
     * Adds a new tab to the editor
     *
     * @param {string} name - Name for the new tab
     * @param {Object} givenElement - GrapesJS element associated with the tab
     * @returns {void}
     */
    function addTab(name, givenElement) {
        if (!givenElement) return;

        const existingTab = tabList.find((tab) => tab.id === givenElement.getId());
        if (existingTab) {
            setSelectedIndex(tabList.findIndex((tab) => tab.id === givenElement.getId()));
            return;
        }

        const newTab = {name, id: givenElement.getId(), element: givenElement};

        setTabList([...tabList, newTab]);
        setSelectedIndex(tabList.length);
    }

    /**
     * Removes a tab from the editor
     *
     * @param {number} index - Index of the tab to remove
     * @returns {void}
     */
    function removeTab(index) {
        const updatedTabs = tabList.filter((_, i) => i !== index);
        setTabList(updatedTabs);

        if (selectedIndex >= updatedTabs.length) {
            setSelectedIndex(Math.max(0, updatedTabs.length - 1));
        }

        if (updatedTabs.length === 0) {
            onClose();
        }
    }

    /**
     * Exports the current graph state as a JSON file
     *
     * @returns {void}
     *
     * @example
     * // Programmatic usage:
     * exportGraph();
     */
    const exportGraph = () => {
        if (!tabList[selectedIndex]?.element) {
            console.error("No active tab to export.");
            return;
        }

        const graphState = tabList[selectedIndex].element.get('graph');
        if (!graphState) {
            return;
        }

        const jsonString = JSON.stringify(graphState, null, 2);
        const blob = new Blob([jsonString], {type: 'application/json'});
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `${tabList[selectedIndex].name || 'graph'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * Imports a graph state into the current tab
     *
     * @param {Object} graphState - The graph state to import
     * @returns {void}
     *
     * @throws Will log errors to console if import fails
     */
    const importGraph = (graphState) => {
        if (!tabList[selectedIndex]?.element) {
            showNotification('error', 'No active tab to import into.')
            return;
        }

        try {
            tabList[selectedIndex].element.set('graph', graphState);
            setReloadPage(true);
        } catch (err) {
            showNotification('error', 'Error importing graph!')
        } finally {
            setIsImportMenuOpen(false);
            setTimeout(() => {
                setReloadPage(false);
            }, 100);
        }
    };

    /**
     * Handles file input for graph import
     *
     * @param {Event} event - File input change event
     * @returns {void}
     */
    const handleFileInput = (event) => {
        const file = event.target.files[0];

        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const graphState = JSON.parse(e.target.result);
                    importGraph(graphState);
                } catch (err) {
                    showNotification('error', 'Error parsing the graph file!')
                }
            };
            reader.readAsText(file);
        } else {
            showNotification('error', 'Invalid file type. Please select a JSON file.')
        }
    };

    /**
     * Triggers the hidden file input for import
     *
     * @returns {void}
     */
    const triggerFileInput = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', handleFileInput);
        fileInput.click();
    };

    return (
        <div className="h-screen flex flex-col bg-website-bg">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <div
                    className="w-full bg-ui-bg text-text flex items-center px-4 py-2 shadow-md justify-between border-[1px] border-ui-border">
                    {/* Toolbar */}
                    <div className="flex bg-ui-subtle rounded-md px-4 py-2">
                        <Button className="bg-ui-bg mr-5 text-text rounded p-2 hover:bg-gray-400"
                                onClick={() => onClose()}>
                            <ExitIcon/>
                        </Button>
                        <Button className="bg-ui-bg mr-5 text-text rounded p-2 hover:bg-gray-400">
                            <SettingsIcon/>
                        </Button>
                        <Button className="bg-ui-bg mr-5 text-text rounded p-2 hover:bg-gray-400"
                                onClick={() => exportGraph()}>
                            <ExportIcon/>
                        </Button>
                        <Button className="bg-ui-bg mr-5 text-text rounded p-2 hover:bg-gray-400"
                                onClick={() => triggerFileInput()}>
                            <ImportIcon/>
                        </Button>
                        <Button className="bg-ui-bg mr-5 text-text rounded p-2 hover:bg-gray-400"
                                onClick={() => arrangeNodes()}>
                            <ArrangeIcon/>
                        </Button>
                    </div>

                    {/* Draggable Tab List */}
                    <div
                        ref={tabListRef}
                        className="flex flex-1 rounded-md px-4 py-2 space-x-2 overflow-hidden cursor-grab select-none"
                    >
                        <Tab.List className="flex space-x-2">
                            {tabList.map((tab, index) => (
                                <Tab key={tab.id}
                                     className={({selected}) => `px-4 py-2 text-white rounded-md flex-none ${selected ? 'bg-primary' : 'hover:bg-primary-hover'}`}>
                                    {tab.name}
                                    <button onClick={() => removeTab(index)}
                                            className="ml-2 text-text-invert hover:text-dangerous">✖
                                    </button>
                                </Tab>
                            ))}
                        </Tab.List>
                    </div>
                </div>

                {/* Tab Panels */}
                <Tab.Panels className="flex-1">
                    {tabList.map((tab) => (
                        <Tab.Panel key={tab.id}>
                            <NodeEditorPage element={tab.element} doReload={reloadPage} setArrangeNodes={setArrangeNodes}/>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

export default NodeEditor;