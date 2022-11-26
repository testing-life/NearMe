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
import "./HomePage.css";
import TagButton from "../Components/TagButton/TagButton";
import { Tags } from "../Consts/Tags";
import { filterSpots } from "../Utils/filters";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<IProfile>();
  const [filters, setFilters] = useState<string[]>([]);
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
        <button className="bg-primary lg border-red-800">
          <Link className="text-light" to={ADD}>
            Add Spot
          </Link>
        </button>
        <div>
          <h3>Filter:</h3>
          <ul className="u-flex u-flex-wrap u-gap-1">
            {Tags.map((tag: typeof Tags[number], index: number) => {
              return !filters.includes(tag) ? (
                <li>
                  <TagButton
                    tagLabel={tag}
                    key={`${tag}${index}`}
                    clickHandler={() => setFilters([...filters, tag])}
                  />
                </li>
              ) : (
                <li>
                  <TagButton
                    remove
                    isSelected
                    tagLabel={tag}
                    key={`${tag}${index}`}
                    clickHandler={() => {
                      const newFilters = filters.filter((t) => t !== tag);
                      setFilters(newFilters);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        {data && editIndex === undefined && (
          <>
            <ul className="ml-0 p-0 spots-list">
              {data.spots
                .filter((spot) => filterSpots(spot, filters))
                .map((spot: ISpot, index: number) => (
                  <li key={`${spot.name}${index}`}>
                    <Spot spot={spot}>
                      <button
                        className="btn-link outline"
                        onClick={() => setEditIndex(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-link outline"
                        onClick={() => deleteHandler(index)}
                      >
                        Delete
                      </button>
                    </Spot>
                  </li>
                ))}
            </ul>
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
