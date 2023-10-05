import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HOME } from "../Consts/Routes";
import { auth, db } from "../Firebase/Firebase";
import { Spot } from "../Models/spot";
import Header from "../Components/Header/Header";
import EditSpot from "../Components/EditSpot/EditSpot";

const EditSpotPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  let {
    state: { data },
  } = useLocation();

  const addSpot = async (spot: Spot) => {
    const ref = user && doc(db, "users", user.uid);
    if (ref) {
      await updateDoc(ref, { spots: arrayUnion(spot) }).catch((e: Error) =>
        console.error(e)
      );
      navigate(HOME);
    }
  };

  const editHandler = async (spot: Spot) => {
    const ref = user && doc(db, "users", user.uid);
    if (ref) {
      // const newSpots = data!.spots.map((item: ISpot, i: number) => {
      //   if (i === editIndex) {
      //     return spot;
      //   }
      //   return item;
      // });
      // await updateDoc(ref, { spots: newSpots }).catch((e: Error) =>
      //   console.error(e)
      // );
    }
  };

  return (
    <>
      {console.log("spot", data)}
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
