import React, {useEffect, useRef, useState} from "react";
import {Button, Tab} from "@headlessui/react";
import VisualEditor from "./VisualEditor";
import {useParams, useNavigate} from "react-router-dom";

function NodeEditor() {
    const { element } = useParams();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tabList, setTabList] = useState([]);
    const tabListRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const savedTabs = JSON.parse(localStorage.getItem("editorTabs"));
        const currentElement = JSON.parse(element);
        if (savedTabs) {
            setTabList(savedTabs);
        }

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && event.shiftKey && event.key === "E") {
                navigate('/');
                event.preventDefault();
            }
        });

        addTab(currentElement.attributes.type || currentElement.tagName || currentElement.type);
    }, []);

    function addTab(name) {
        const newTab = {name: name, id: Date.now(), element: element};
        const updatedTabs = [...tabList, newTab];
        setTabList(updatedTabs);
        localStorage.setItem("editorTabs", JSON.stringify(updatedTabs));
    }

    function removeTab(index) {
        const updatedTabs = tabList.filter((_, i) => i !== index);
        setTabList(updatedTabs);
        localStorage.setItem("editorTabs", JSON.stringify(updatedTabs));

        if (selectedIndex >= updatedTabs.length) {
            setSelectedIndex(Math.max(0, updatedTabs.length - 1));
        }
        console.log(tabList);

        if(selectedIndex <= 0) {
            navigate('/');
        }
    }

    const handleMouseDown = (e) => {
        if (!tabListRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX - tabListRef.current.offsetLeft;
        scrollLeft.current = tabListRef.current.scrollLeft;
        tabListRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || !tabListRef.current) return;
        e.preventDefault();
        const x = e.pageX - tabListRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Adjust speed
        tabListRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (tabListRef.current) tabListRef.current.style.cursor = "grab";
    };

    return (
        <div className="h-screen flex flex-col bg-gray-200">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <div className="w-full bg-[#292929] text-white flex items-center px-4 py-2 shadow-md justify-between">
                    <div className="flex bg-[#1E1F22] rounded-md px-4 py-2">
                        {/* Buttons */}
                        <Button className="bg-[#A42324] mr-5 text-white rounded p-2 hover:bg-gray-400" onClick={() => navigate('/')}>
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
                        <Button className="bg-[#2D2E30] mr-5 text-white rounded p-2 hover:bg-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"/>
                            </svg>
                        </Button>
                        <Button className="bg-[#2D2E30] mr-5 text-white rounded p-2 hover:bg-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"/>
                            </svg>
                        </Button>
                        {/*<Button className="bg-yellow-700 text-white rounded p-2 hover:bg-gray-400" onClick={addTab}>*/}
                        {/*    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}*/}
                        {/*         stroke="currentColor" className="size-6">*/}
                        {/*        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>*/}
                        {/*    </svg>*/}
                        {/*</Button>*/}
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
                                     className={({ selected }) =>` px-4 py-2 text-white rounded-md flex-none ${selected ? 'bg-primary' : 'hover:bg-primary-hover'}`}>
                                    {tab.name}
                                    <button onClick={() => removeTab(index)} className="ml-2 text-white hover:text-red">✖</button>
                                </Tab>
                            ))}
                        </Tab.List>
                    </div>
                </div>

                <Tab.Panels className="flex-1">
                    {tabList.map((tab, index) => (
                        <Tab.Panel key={tab.id}>
                            <VisualEditor tabId={tab.id}/>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

export default NodeEditor