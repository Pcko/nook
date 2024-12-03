import logo from '../assets/resources/webcent.png'
function Login(){
    return (
        <div className="flex items-center justify-center bg-[#202020] h-full w-full">
            <div className="h-[300px] w-[300px] p-2 text-white">
                <div className={"w-full pb-10"}>
                    <img src={logo}/>
                </div>
                <h6>Username</h6>
                <input type="text" id="username"
                       className="w-full border-white border-[1px] bg-[#202020] pl-1 pr-1 mb-3"></input>
                <h6>Password</h6>
                <input type="password" id="password"
                       className="w-full border-white border-[1px] bg-[#202020] pl-1 pr-1"></input>
                <button id="sign-up" className="text-[#505050] block mx-auto mt-8">Sign up</button>
            </div>
        </div>
    );
}

export default Login