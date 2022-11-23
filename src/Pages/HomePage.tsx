import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ADD } from "../Consts/Routes";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { ISpot } from "../Models/spot";
import { IProfile } from "../Models/profile";
import Spot from "../Components/Spot/Spot";
import { IKContext } from "imagekitio-react";
import EditSpot from "../Components/EditSpot/EditSpot";
import Header from "../Components/Header/Header";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<IProfile>();
  const [editIndex, setEditIndex] = useState<undefined | number>();
  const [value, loading, error] = useDocument(doc(db, "users", user!.uid), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(() => {
    if (value) {
      const data = value.data();
      setData(data as IProfile);
    }
  }, [value]);

  const cancelHandler = (): void => setEditIndex(undefined);

  const deleteHandler = async (index: number) => {
    const ref = user && doc(db, "users", user.uid);
    if (ref) {
      await updateDoc(ref, { spots: arrayRemove(data!.spots[index]) }).catch(
        (e: Error) => console.error(e)
      );
    }
  };
  const editHandler = async (spot: ISpot) => {
    const ref = user && doc(db, "users", user.uid);
    if (ref) {
      const newSpots = data!.spots.map((item: ISpot, i: number) => {
        if (i === editIndex) {
          return spot;
        }
        return item;
      });
      await updateDoc(ref, { spots: newSpots }).catch((e: Error) =>
        console.error(e)
      );
      cancelHandler();
    }
  };

  return (
    <>
      <IKContext
        publicKey={process.env.REACT_APP_IMAGEKIT_API_KEY}
        urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL}
        authenticationEndpoint={process.env.REACT_APP_IMAGEKIT_PRIV_URL}
      >
        <Header auth={auth} />
        {data && editIndex === undefined && (
          <>
            <ul>
              {data.spots.map((spot: ISpot, index: number) => (
                <li key={`${spot.name}${index}`}>
                  <Spot spot={spot} />
                  <button onClick={() => setEditIndex(index)}>Edit</button>
                  <button onClick={() => deleteHandler(index)}>Delete</button>
                </li>
              ))}
            </ul>
            <Link to={ADD}>Add Spot</Link>
          </>
        )}
        {data && editIndex !== undefined && (
          <EditSpot
            editHandler={editHandler}
            cancelHandler={cancelHandler}
            data={data!.spots[editIndex]}
            userId={user!.uid}
          />
        )}
      </IKContext>
    </>
  );
};

export default HomePage;
