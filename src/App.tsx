import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as ROUTES from "./Consts/Routes";
import SignupPage from "./Pages/SignupPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import AddSpotPage from "./Pages/AddSpotPage";
import EditSpotPage from "./Pages/EditSpotPage";

function App() {
  return (
    <>
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
        <Route
          path={ROUTES.EDIT}
          element={
            <PrivateRoute>
              <EditSpotPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
