import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import AddSpot from "../Components/AddSpot/AddSpot";
import { HOME } from "../Consts/Routes";
import { auth, db } from "../Firebase/Firebase";
import { Spot } from "../Models/spot";
import { IKContext } from "imagekitio-react";
const AddSpotPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const addSpot = async (spot: Spot) => {
    const ref = user && doc(db, "users", user.uid);
    if (ref) {
      await updateDoc(ref, { spots: arrayUnion(spot) }).catch((e: Error) =>
        console.error(e)
      );
      navigate(HOME);
    }
  };
  return (
    <IKContext
      publicKey={process.env.REACT_APP_IMAGEKIT_API_KEY}
      urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL}
      authenticationEndpoint={"http://localhost:3001/auth"}
    >
      {user ? <AddSpot submitHandler={addSpot} userId={user.uid} /> : null};
    </IKContext>
  );
};

export default AddSpotPage;
