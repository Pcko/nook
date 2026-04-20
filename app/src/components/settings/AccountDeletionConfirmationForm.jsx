import {useMemo} from "react";
import {useNavigate} from "react-router-dom";

import SettingsService from "../../services/SettingsService";
import useErrorHandler from "../logging/ErrorHandler";
import {useMetaNotify} from "../logging/MetaNotifyHook";

/**
 * Renders the account deletion confirmation form component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.onCancel - Callback fired for the on cancel action.
 * @returns {JSX.Element} The rendered account deletion confirmation form component.
 */
function AccountDeletionConfirmationForm({onCancel}) {
    const navigate = useNavigate();

    const baseMeta = useMemo(() => ({
        feature: "settings", component: "AccountDeletionConfirmationForm",
    }), []);

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    /**
 * Handles account deletion.
 * @returns {Promise<any>} A promise that resolves when the operation completes.
 */
    const handleAccountDeletion = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await SettingsService.deleteAccount(user);

            notify("info", "Successfully deleted your account.", {
                stage: "delete-account", username: user?.username ?? null, userId: user?.id ?? null
            }, "submit");

            navigate("/login");
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Failed to delete your account.", meta: {
                    stage: "delete-account"
                }
            });
        }
    };

    /**
 * Handles cancel.
 */
    const handleCancel = () => {
        notify("info", "Account deletion cancelled.", {
            stage: "delete-account-cancel"
        }, "cancel");
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="border border-ui-border bg-ui-bg w-[500px] p-8 rounded-lg">
            <h2 className="mb-2 font-semibold">We're sorry to see you go</h2>
            <p className="mb-4">
                This deletion is final and there is{" "}
                <span className="text-dangerous">
                    no way to recover your account
                </span>{" "}
                or any data if you choose to continue. Do you want to delete your
                account?
            </p>
            <div className="flex">
                <input
                    className="btn hover:bg-ui-button-hover bg-ui-button border-ui-border border w-[35%] ml-[25%]"
                    onClick={handleCancel}
                    type="button"
                    value="Cancel"
                />
                <input
                    className="btn bg-dangerous !text-text-on-primary hover:bg-dangerous hover:animate-pulse w-[35%] mr-0"
                    onClick={handleAccountDeletion}
                    type="button"
                    value="Delete"
                />
            </div>
        </div>
    );
}

export default AccountDeletionConfirmationForm;
