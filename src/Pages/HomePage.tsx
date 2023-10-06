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
import TagFilter from "../Components/TagFilter/TagFilter";
import { Tags } from "../Consts/Tags";
import { filterByArray } from "../Utils/array";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<ISpot[]>();
  const [filteredData, setFilteredData] = useState<ISpot[]>();
  const ref = collection(db, "users", user!.uid, "spots").withConverter(
    spotConverter
  );
  const [value, loading, error] = useCollectionData(ref);

  useEffect(() => {
    if (value) {
      setData(value);
      setFilteredData(value);
    }
  }, [value]);

  const deleteHandler = async (ref: DocumentReference) => {
    if (ref) {
      await deleteDoc(ref).catch((e: Error) => console.error(e));
    }
  };

  const filterHandler = (filterList: (typeof Tags)[]) => {
    const filteredData = filterByArray(data as ISpot[], filterList, "tags");
    setFilteredData(filteredData);
  };

  return (
    <>
      <Header auth={auth} />
      <button className="bg-primary lg border-red-800">
        <Link className="text-light" to={ADD}>
          Add Spot
        </Link>
      </button>
      <TagFilter clickHandler={filterHandler} />
      {filteredData && (
        <>
          <ul className="ml-0 p-0 spots-list">
            {filteredData.map((spot: ISpot, index: number) => (
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
