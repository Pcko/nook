import logo from '../assets/resources/Image.png'
function Login(){
    return (
        <div className="flex items-center justify-center bg-[#202020] h-full w-full">
            <div id="Window" className="h-[400px] w-[300px] p-2 text-white bg-[#303030] rounded-xl p-5">
                <div className={"flex items-center justify-center mt-5 mb-10"}>
                    <img src={logo} className="w-1/2"/>
                </div>
                <h6>Username</h6>
                <input type="text" id="username"
                    className="w-full border-white border-[1px] bg-[#202020] pl-1 pr-1 mb-3"></input>
                <h6>Password</h6>
                <input type="password" id="password"
                    className="w-full border-white border-[1px] bg-[#202020] pl-1 pr-1"></input>
                <button id="sign-up" className=" mx-auto mt-5 rounded-xl bg-[#6B439B] font-bold py-2 px-4 rounded-full">Sign up</button>
            </div>
        </div>
    );
}

export default Login