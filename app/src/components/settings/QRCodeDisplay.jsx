import { motion } from "framer-motion";
import qrCode from "qrcode";
import { useEffect, useState } from "react";

import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur";

/**
 * Renders the qrcode display component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.onClose - Callback fired for the on close action.
 * @param {any} props.onContinue - Callback fired for the on continue action.
 * @param {any} props.qrCodeURL - The qr code url value.
 * @returns {JSX.Element} The rendered qrcode display component.
 */
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
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-ui-bg border border-ui-border rounded-[5px] shadow-2xl w-[360px] max-w-[90vw] text-center"
                exit={{ opacity: 0, scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
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
                            alt="QR Code"
                            className="w-40 h-40 object-contain"
                            src={url}
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-center">
                    <button
                        className="w-1/2 py-2 border border-ui-border rounded-[5px] text-ui-text hover:bg-ui-default transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-1/2 py-2 bg-primary text-text-on-primary rounded-[5px] hover:bg-primary-hover transition"
                        onClick={onContinue}
                    >
                        Continue
                    </button>
                </div>
            </motion.div>
        </CenteredWindowWithBackgroundBlur>
    );
}

export default QRCodeDisplay;
