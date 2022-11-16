import React, { FC, PropsWithChildren } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/Firebase";
import * as ROUTES from "../../Consts/Routes";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  if (!user) {
    return <Navigate to={ROUTES.LOG_IN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
