function ThemePreview({ theme }){
    let appliedClass = theme;
    if(theme === 'system'){
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            appliedClass = 'light';
        }
        else {
            appliedClass = 'dark';
        }
    }

    return (
        <div className={`${appliedClass} bg-far-bg border-ui-border border-[1px] rounded-xl p-3 pb-0 select-none`}>
            <div className="flex h-full border-ui-border border-[1px] border-b-0">
                <div className="p-2 bg-ui-bg border-r-ui-border border-r-[3px]">
                    <div className="flex h-3">
                        <div className="h-3 w-3 mr-1 rounded-full bg-primary"/>
                        <div className="my-auto rounded-sm h-2 w-3 bg-primary"/>
                    </div>
                    <div className="mx-1 mt-2 rounded-sm h-2 w-5 bg-secondary"/>
                    <div className="mx-1 mt-1 rounded-sm h-2 w-5 bg-ui-button"/>
                    <div className="mx-1 mt-1 rounded-sm h-2 w-5 bg-ui-button"/>
                    <div className="mx-1 mt-1 rounded-sm h-2 w-5 bg-ui-button"/>
                </div>
                <div className="bg-ui-bg">
                    <div className="h-[30%] flex p-1">
                        <h1 className="my-auto text-xs text-text mr-2 hover:cursor-default whitespace-nowrap">Your Dashboard</h1>
                        <div className="rounded-lg h-2 w-4 bg-ui-button-hover m-1"/>
                        <div className="rounded-lg h-2 w-4 bg-ui-button m-1"/>
                    </div>
                    <div className="rounded-sm h-[70%] w-[80%] mx-auto bg-gradient-to-b from-ui-button to-ui-bg-selected"></div>
                </div>
            </div>
        </div>
    );
}

export default ThemePreview;