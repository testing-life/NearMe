import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase/Firebase";
import * as ROUTES from "../Consts/Routes";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (!user) {
    return <Navigate to={ROUTES.LOG_IN} />;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  return <div>HomePage</div>;
};

export default HomePage;
