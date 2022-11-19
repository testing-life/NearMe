import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ADD } from "../Consts/Routes";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc } from "firebase/firestore";
import { ISpot } from "../Models/spot";
import { IProfile } from "../Models/profile";
import Spot from "../Components/Spot/Spot";
import { IKContext } from "imagekitio-react";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<IProfile>();
  const [value, loading, error] = useDocument(doc(db, "users", user!.uid), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(() => {
    if (value) {
      const data = value.data();

      setData(data as IProfile);
    }
  }, [value]);

  return (
    <>
      <IKContext
        publicKey={process.env.REACT_APP_IMAGEKIT_API_KEY}
        urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL}
        authenticationEndpoint={"http://localhost:3001/auth"}
      >
        <ul>
          {data
            ? data.spots.map((spot: ISpot) => (
                <li>
                  <Spot spot={spot} />
                </li>
              ))
            : null}
        </ul>
        <Link to={ADD}>Add Spot</Link>
      </IKContext>
    </>
  );
};

export default HomePage;
