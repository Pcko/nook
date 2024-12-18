import BackgroundText from "../general/NookBackground"

function Registration(){
    return(
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText />
            <div id="Window" className="h-[600px] w-[550px] p-5 text-white bg-ui-bg rounded-xl z-10">

            </div>
        </div>
    );
}

export default Registration;