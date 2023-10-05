import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ADD, EDIT } from "../Consts/Routes";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import { auth, db, spotConverter } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { arrayRemove, collection, doc, updateDoc } from "firebase/firestore";
import { ISpot } from "../Models/spot";
import { IProfile } from "../Models/profile";
import Spot from "../Components/Spot/Spot";
import EditSpot from "../Components/EditSpot/EditSpot";
import Header from "../Components/Header/Header";
import "./HomePage.css";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<ISpot[]>();
  const [editIndex, setEditIndex] = useState<undefined | number>();
  const ref = collection(db, "users", user!.uid, "spots").withConverter(
    spotConverter
  );
  const [value, loading, error] = useCollectionData(ref);

  useEffect(() => {
    if (value) {
      setData(value as any);
    }
  }, [value]);

  // const cancelHandler = (): void => setEditIndex(undefined);

  // const deleteHandler = async (index: number) => {
  //   const ref = user && doc(db, "users", user.uid);
  //   if (ref) {
  //     await updateDoc(ref, { spots: arrayRemove(data!.spots[index]) }).catch(
  //       (e: Error) => console.error(e)
  //     );
  //   }
  // };

  // const editHandler = async (spot: ISpot) => {
  //   const ref = user && doc(db, "users", user.uid);
  //   if (ref) {
  //     const newSpots = data!.spots.map((item: ISpot, i: number) => {
  //       if (i === editIndex) {
  //         return spot;
  //       }
  //       return item;
  //     });
  //     await updateDoc(ref, { spots: newSpots }).catch((e: Error) =>
  //       console.error(e)
  //     );
  //     cancelHandler();
  //   }
  // };

  return (
    <>
      <Header auth={auth} />
      <button className="bg-primary lg border-red-800">
        <Link className="text-light" to={ADD}>
          Add Spot
        </Link>
      </button>
      {console.log("data", data)}
      {data && (
        <>
          <ul className="ml-0 p-0 spots-list">
            {data.map((spot: ISpot, index: number) => (
              <li key={`${spot.name}${index}`}>
                <Spot spot={spot}>
                  <Link
                    className="btn-link outline"
                    state={{
                      data: data[index],
                    }}
                    to={EDIT}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn-link outline"
                    // onClick={() => deleteHandler(index)}
                  >
                    Delete
                  </button>
                </Spot>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* {data && editIndex !== undefined && (
        <EditSpot
          editHandler={editHandler}
          cancelHandler={cancelHandler}
          data={data!.spots[editIndex]}
          userId={user!.uid}
        />
      )} */}
      {loading && <p>Loading data...</p>}
      {error && <p>{error.message}</p>}
      {!data && <p>You haven't added any spots yet.</p>}
    </>
  );
};

export default HomePage;
