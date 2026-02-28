import React from "react";

import TwoFactorAuthenticationCodeInputForm from "../../../components/auth/TwoFactorAuthenticationCodeInputForm";

function TwoFactorCodeForm({ submitForm }) {
    return <TwoFactorAuthenticationCodeInputForm submitForm={submitForm} />;
}

export default TwoFactorCodeForm;
