import React from 'react';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import * as ROUTES from './Consts/Routes';
import SignupPage from './Pages/SignupPage';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import AddSpotPage from './Pages/AddSpotPage';
// import "cirrus-ui";
import UpdateCredentialsPage from './Pages/UpdateCredentialsPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import EditSpotPage from './Pages/EditSpotPage';
import Drawer from './Components/Drawer/Drawer';
import useDrawerStore from './Stores/drawerStore';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from './Firebase/Firebase';

function App() {
  const drawerOpen = useDrawerStore((state) => state.isOpen);
  const [signOut, loading, error] = useSignOut(auth);
  return (
    <div className='wrapper'>
      <Drawer isOpen={drawerOpen}>
        <nav>
          <ul>
            <li>
              <button onClick={async () => await signOut()}>Log out</button>
            </li>
            <li>
              <Link className='text-light' to={ROUTES.UPDATE}>
                Update Details
              </Link>
            </li>
          </ul>
        </nav>
      </Drawer>
      <Routes>
        <Route
          path='/'
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
        <Route
          path={ROUTES.UPDATE}
          element={
            <PrivateRoute>
              <UpdateCredentialsPage />
            </PrivateRoute>
          }
        />
        <Route path={ROUTES.RESET} element={<ResetPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
