import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import * as ROUTES from "./Consts/Routes";
import SignupPage from "./Pages/SignupPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import AddSpotPage from "./Pages/AddSpotPage";
import "cirrus-ui";

function App() {
  return (
    <div className="bg-blue-300 h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path={ROUTES.SIGN_UP} element={<SignupPage />} />
        <Route path={ROUTES.LOG_IN} element={<LoginPage />} />
        <Route
          path={ROUTES.ADD}
          element={
            <PrivateRoute>
              <AddSpotPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
