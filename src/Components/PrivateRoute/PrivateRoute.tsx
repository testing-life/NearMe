import React, { FC, PropsWithChildren } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/Firebase";
import * as ROUTES from "../../Consts/Routes";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (!loading && !user) {
    return <Navigate to={ROUTES.LOG_IN} state={{ from: location }} replace />;
  }

  if (loading) {
    return <Spinner label="Warming Up" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
