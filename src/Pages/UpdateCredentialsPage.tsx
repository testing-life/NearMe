import React, { useState } from "react";
import { useUpdateEmail, useUpdatePassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { HOME } from "../Consts/Routes";
import { auth } from "../Firebase/Firebase";
import UpdateCredentials from "../Components/UpdateCredentials/UpdateCredentials";

const UpdateCredentialsPage = () => {
  const [updateEmail, emailUpdating, emailError] = useUpdateEmail(auth);
  const [updatePassword, passUpdating, passError] = useUpdatePassword(auth);
  const [success, setSuccess] = useState("");

  const onSubmitEmail = async (credential: string) => {
    const success = await updateEmail(credential);
    if (success) {
      setSuccess("Email updated successfully");
    }
  };

  const onSubmitPassword = async (credential: string) => {
    const success = await updatePassword(credential);
    if (success) {
      setSuccess("Password updated successfully");
    }
  };

  return (
    <div className="p-1">
      <UpdateCredentials type="password" submitHandler={onSubmitPassword} />
      {passUpdating && <p>Updating password...</p>}
      {passError && <p>{passError.message}</p>}
      <UpdateCredentials type="email" submitHandler={onSubmitEmail} />
      {emailUpdating && <p>Updating email...</p>}
      {emailError && <p>{emailError.message}</p>}
      {success && <p>{success}</p>}
      <Link to={HOME}>Back</Link>
    </div>
  );
};

export default UpdateCredentialsPage;
