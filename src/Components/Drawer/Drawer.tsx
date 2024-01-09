import React, { FC, ReactNode } from "react";
import "./Drawer.css";
import DrawerButton from "../DrawerButton/DrawerButton";
import useDrawerStore from "../../Stores/drawerStore";
import { Auth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import * as ROUTES from "./../../Consts/Routes";
import { useSignOut } from "react-firebase-hooks/auth";

interface Props {
  isOpen: boolean;
  user: Auth;
}

const Drawer: FC<Props> = ({ isOpen, user }) => {
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);
  const [signOut, loading, error] = useSignOut(user);
  return (
    <div className={`drawer__wrapper ${isOpen ? "-is-open" : ""}`}>
      <div className="drawer ">
        <DrawerButton isClose onClick={() => toggleDrawer(true)} />
        <nav className="-sticky-top">
          <ul>
            <li>
              <button onClick={async () => await signOut()}>Log out</button>
            </li>
            <li>
              <Link className="text-light" to={ROUTES.UPDATE}>
                Update Details
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* <div className="drawer__overlay"></div> */}
    </div>
  );
};

export default Drawer;
