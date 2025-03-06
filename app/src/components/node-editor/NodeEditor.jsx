import React, {useEffect, useRef, useState} from "react";
import {Button, Dialog, Tab} from "@headlessui/react";
import NodeEditorPage from "./NodeEditorPage";

function NodeEditor({element, goBack}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tabList, setTabList] = useState([]);
    const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
    const [arrangeNodes, setArrangeNodes] = useState(()=>{});

    const tabListRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [reloadPage, setReloadPage] = useState(false);

    useEffect(() => {
        const givenElement = element?.current;
        const tabName = givenElement?.getName() || givenElement?.get('tagName');
        const loadedTabs = JSON.parse(sessionStorage.getItem('tabs') || '[]');

        if (tabList.length === 0) {
            setTabList(loadedTabs);
        }

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && event.shiftKey && event.key === "Q") {
                event.preventDefault();
                goBack();
            }
        });
        addTab(tabName, givenElement);
    }, []);

    useEffect(() => {
        sessionStorage.setItem('tabs', JSON.stringify(tabList));
    }, [tabList]);

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

    function removeTab(index) {
        const updatedTabs = tabList.filter((_, i) => i !== index);
        setTabList(updatedTabs);

        if (selectedIndex >= updatedTabs.length) {
            setSelectedIndex(Math.max(0, updatedTabs.length - 1));
        }

        if (updatedTabs.length === 0) {
            goBack();
        }
    }

    const handleMouseDown = (e) => {
        if (!tabListRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX - tabListRef.current.offsetLeft;
        scrollLeft.current = tabListRef.current.scrollLeft;
        tabListRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || !tabListRef.current) return;
        e.preventDefault();
        const x = e.pageX - tabListRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        tabListRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (tabListRef.current) {
            tabListRef.current.style.cursor = 'grab';
        }
    };

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

    const importGraph = (graphState) => {
        if (!tabList[selectedIndex]?.element) {  //
            console.error("No active tab to import into.");
            return;
        }

        try {
            tabList[selectedIndex].element.set('graph', graphState);
            setReloadPage(true);
        } catch (err) {
            console.error("Error importing graph:", err);
        } finally {
            setIsImportMenuOpen(false);
            setTimeout(() => {
                setReloadPage(false);
            }, 100);
        }
    };

    const handleFileInput = (event) => {
        const file = event.target.files[0];

        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const graphState = JSON.parse(e.target.result);
                    importGraph(graphState);
                } catch (err) {
                    console.error('Error parsing the graph file:', err);
                }
            };
            reader.readAsText(file);
        } else {
            console.error('Wrong type!');
        }
    };

    const triggerFileInput = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', handleFileInput);
        fileInput.click();
    };

    return (
        <div className="h-screen flex flex-col bg-gray-200">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <div className="w-full bg-[#292929] text-white flex items-center px-4 py-2 shadow-md justify-between">
                    {/* Toolbar */}
                    <div className="flex bg-[#1E1F22] rounded-md px-4 py-2">
                        <Button className="bg-[#A42324] mr-5 text-white rounded p-2 hover:bg-gray-400"
                                onClick={() => goBack()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"/>
                            </svg>
                        </Button>
                        <Button className="bg-[#2D2E30] mr-5 text-white rounded p-2 hover:bg-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                        </Button>
                        <Button className="bg-[#2D2E30] mr-5 text-white rounded p-2 hover:bg-gray-400"
                                onClick={() => exportGraph()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"/>
                            </svg>
                        </Button>
                        <Button className="bg-[#2D2E30] mr-5 text-white rounded p-2 hover:bg-gray-400"
                                onClick={() => triggerFileInput()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"/>
                            </svg>
                        </Button>
                        <Button className="bg-[#2D2E30] mr-5 text-white rounded p-2 hover:bg-gray-400"
                                onClick={() => arrangeNodes()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/>
                            </svg>
                        </Button>
                    </div>

                    {/* Draggable Tab List */}
                    <div
                        ref={tabListRef}
                        className="flex flex-1 rounded-md px-4 py-2 space-x-2 overflow-hidden cursor-grab select-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <Tab.List className="flex space-x-2">
                            {tabList.map((tab, index) => (
                                <Tab key={tab.id}
                                     className={({selected}) => ` px-4 py-2 text-white rounded-md flex-none ${selected ? 'bg-primary' : 'hover:bg-primary-hover'}`}>
                                    {tab.name}
                                    <button onClick={() => removeTab(index)}
                                            className="ml-2 text-white hover:text-red">✖
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
                            <NodeEditorPage tabId={tab.id} element={tab.element} doReload={reloadPage} setArrangeNodes={setArrangeNodes}/>
                        </Tab.Panel>
                    ))}s
                </Tab.Panels>
            </Tab.Group>
            {/* Import Overlay */}
            <Dialog open={isImportMenuOpen} onClose={() => setIsImportMenuOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Select Tab for Import</h2>
                        <div className="space-y-2">
                            {tabList.map((tab) => (
                                <div key={tab.id}
                                     className={`p-2 cursor-pointer rounded ${tabList[selectedIndex] === tab.id ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                     onClick={() => setSelected(tabList.indexOf(tab))}>
                                    {tab.name}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button className="bg-gray-500 text-white px-3 py-1 rounded"
                                    onClick={() => setIsImportMenuOpen(false)}>Cancel</Button>
                            <Button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={triggerFileInput}>Upload
                                JSON</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default NodeEditor;