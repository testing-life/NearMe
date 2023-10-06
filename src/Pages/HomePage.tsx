import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ADD, EDIT } from "../Consts/Routes";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import { auth, db, spotConverter } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { DocumentReference, collection, deleteDoc } from "firebase/firestore";
import { ISpot } from "../Models/spot";
import Spot from "../Components/Spot/Spot";
import Header from "../Components/Header/Header";
import "./HomePage.css";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<ISpot[]>();
  const ref = collection(db, "users", user!.uid, "spots").withConverter(
    spotConverter
  );
  const [value, loading, error] = useCollectionData(ref);

  useEffect(() => {
    if (value) {
      setData(value as any);
    }
  }, [value]);

  const deleteHandler = async (ref: DocumentReference) => {
    if (ref) {
      await deleteDoc(ref).catch((e: Error) => console.error(e));
    }
  };

  return (
    <>
      <Header auth={auth} />
      <button className="bg-primary lg border-red-800">
        <Link className="text-light" to={ADD}>
          Add Spot
        </Link>
      </button>
      {data && (
        <>
          <ul className="ml-0 p-0 spots-list">
            {data.map((spot: ISpot, index: number) => (
              <li key={spot.id}>
                <Spot spot={spot}>
                  {spot?.id && (
                    <Link
                      className="btn-link btn-primary outline"
                      state={{ id: spot.id }}
                      to={EDIT}
                    >
                      Edit
                    </Link>
                  )}
                  <button
                    className="btn-link bg-orange-2 outline"
                    onClick={() => deleteHandler(spot.ref)}
                  >
                    Delete
                  </button>
                </Spot>
              </li>
            ))}
          </ul>
        </>
      )}
      {loading && <p>Loading data...</p>}
      {error && <p>{error.message}</p>}
      {!data && <p>You haven't added any spots yet.</p>}
    </>
  );
};

export default HomePage;
