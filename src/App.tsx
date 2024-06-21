import './App.css';
import { Route, Routes } from 'react-router-dom';
import * as ROUTES from './Consts/Routes';
import SignupPage from './Pages/SignupPage';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import AddSpotPage from './Pages/AddSpotPage';
import UpdateCredentialsPage from './Pages/UpdateCredentialsPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import EditSpotPage from './Pages/EditSpotPage';
import Drawer from './Components/Drawer/Drawer';
import useDrawerStore from './Stores/drawerStore';
import { auth } from './Firebase/Firebase';
import LandingPage from './Pages/LandingPage';

function App() {
  const drawerOpen = useDrawerStore((state) => state.isOpen);

  return (
    <div className='wrapper'>
      <Drawer isOpen={drawerOpen} user={auth} />
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
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
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
