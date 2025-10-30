import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";
import qrCode from "qrcode";
import { useEffect, useState } from "react";

function QRCodeDisplay({ onClose, onContinue, qrCodeURL }){
    const [url, setUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif");

    useEffect(() => {
        qrCode.toDataURL(qrCodeURL)
            .then(value => {
                setUrl(value);
            })
            .catch(err => {
                setUrl("https://media.tenor.com/dblb_XKGVC4AAAAe/pepe-the-frog-sad.png");
            });
    }, [qrCodeURL]);


    return(
        <CenteredWindowWithBackgroundBlur>
            <div className="p-4 bg-ui-bg rounded-xl border-ui-border border w-[350px]">
                <h1>Scan QR-Code</h1>
                <img src={url} alt="Generating QR Code..." className="px-[15%] pt-5 pb-10 w-full" />
                <div className="flex">
                    <input type="button" value="Cancel" onClick={() => onClose()} className="w-[40%] py-1 px-4 bg-ui-button rounded-lg ml-[5%] mr-auto hover:cursor-pointer hover:bg-ui-button-hover btn"/>
                    <input type="button" value="Continue" onClick={() => onContinue()} className="w-[40%] py-1 px-4 bg-primary rounded-lg mr-[5%] ml-auto hover:cursor-pointer hover:bg-primary-hover btn"/>
                </div>
            </div>
        </CenteredWindowWithBackgroundBlur>
    )
}

export default QRCodeDisplay;