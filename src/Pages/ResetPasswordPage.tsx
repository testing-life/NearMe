import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../Firebase/Firebase";
import { ActionCodeSettings } from "firebase/auth";
import ResetPassword from "../Components/ResetPassword/ResetPassword";
import { LOG_IN } from "../Consts/Routes";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const [success, setSuccess] = useState("");

  const actionCodeSettings: ActionCodeSettings = {
    url: process.env.REACT_APP_CONTINUE_LINK as string,
  };

  const onSubmitPasswordReset = async (email: string) => {
    const success = await sendPasswordResetEmail(email, actionCodeSettings);
    if (success) {
      setSuccess("Email with password reset request has been sent.");
    }
  };

  return (
    <div className="desktop-width-limit">
      <ResetPassword submitHandler={onSubmitPasswordReset} />
      {sending && <p>Sending request email...</p>}
      {error && <p className="-is-error">{error.message}</p>}
      {success && <p>{success}</p>}
      <Link to={LOG_IN}>Back</Link>
    </div>
  );
};

export default ResetPasswordPage;
