import logo from '../assets/resources/Image.png'
function Login(){
    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <div id="Window" className="h-[400px] w-[300px] p-2 text-white bg-ui-bg rounded-xl p-5">
                <div className={"flex items-center justify-center mt-5 mb-10"}>
                    <img src={logo} className="w-1/2"/>
                </div>
                <h6>Username</h6>
                <input type="text" id="username"
                    className="w-full border-white border-[1px] bg-ui-bg pl-1 pr-1 mb-3"></input>
                <h6>Password</h6>
                <input type="password" id="password"
                    className="w-full border-white border-[1px] bg-ui-bg pl-1 pr-1"></input>
                <button id="sign-up" className="hover:bg-primary-hover mx-auto mt-5 rounded-xl bg-primary font-bold py-2 px-4 rounded-full">Sign up</button>
            </div>
        </div>
    );
}

export default Login