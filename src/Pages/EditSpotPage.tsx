import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HOME } from "../Consts/Routes";
import { auth, db } from "../Firebase/Firebase";
import { ISpot, Spot } from "../Models/spot";
import Header from "../Components/Header/Header";
import EditSpot from "../Components/EditSpot/EditSpot";

const EditSpotPage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<ISpot>();
  const navigate = useNavigate();
  let {
    state: { id },
  } = useLocation();

  useEffect(() => {
    const getSpot = async () => {
      const ref = doc(db, "users", user!.uid, "spots", id);
      const querySnapshot = await getDoc(ref);
      if (querySnapshot.exists()) {
        setData(querySnapshot.data() as ISpot);
      }
    };
    if (id) {
      getSpot();
    }
  }, [id]);

  const editHandler = async (newSpot: ISpot) => {
    const ref = doc(db, "users", user!.uid, "spots", id);
    if (ref) {
      updateDoc(ref, { ...newSpot }).catch((e: Error) => console.error(e));
      navigate(HOME);
    }
  };

  return (
    <>
      <Header auth={auth} />
      <div className="p-2 max-w-sm u-center">
        {user && data ? (
          <EditSpot editHandler={editHandler} data={data} userId={user!.uid} />
        ) : null}
        <Link to={HOME}>Cancel</Link>
      </div>
    </>
  );
};

export default EditSpotPage;
