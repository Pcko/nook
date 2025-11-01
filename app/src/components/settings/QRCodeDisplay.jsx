import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import qrCode from "qrcode";
import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";

function QRCodeDisplay({ onClose, onContinue, qrCodeURL }) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        qrCode
            .toDataURL(qrCodeURL)
            .then((value) => setUrl(value))
            .catch(() =>
                setUrl("https://media.tenor.com/dblb_XKGVC4AAAAe/pepe-the-frog-sad.png")
            );
    }, [qrCodeURL]);

    return (
        <CenteredWindowWithBackgroundBlur>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="p-6 bg-ui-bg border border-ui-border rounded-[5px] shadow-2xl w-[360px] max-w-[90vw] text-center"
            >
                <h1 className="text-xl font-semibold mb-2 text-text">
                    Authenticator QR Code
                </h1>
                <p className="text-sm text-ui-text-dim mb-6">
                    Scan this code with your mobile device to complete two-factor authentication setup.
                </p>

                <div className="flex justify-center mb-8">
                    <div className="p-3 bg-ui-default border border-ui-border rounded-[5px] shadow-inner">
                        <img
                            src={url}
                            alt="QR Code"
                            className="w-40 h-40 object-contain"
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="w-1/2 py-2 border border-ui-border rounded-[5px] text-ui-text hover:bg-ui-default transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onContinue}
                        className="w-1/2 py-2 bg-primary text-text-on-primary rounded-[5px] hover:bg-primary-hover transition"
                    >
                        Continue
                    </button>
                </div>
            </motion.div>
        </CenteredWindowWithBackgroundBlur>
    );
}

export default QRCodeDisplay;
