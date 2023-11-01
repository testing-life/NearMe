import { DocumentSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HOME } from '../Consts/Routes';
import { auth, db, spotConverter } from '../Firebase/Firebase';
import { ISpot, Spot } from '../Models/spot';
import Header from '../Components/Header/Header';
import EditSpot from '../Components/EditSpot/EditSpot';
import { spotsDocRef } from '../Consts/SpotsRef';

const EditSpotPage = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<DocumentSnapshot<ISpot>>();
  const [updateError, setUpdateError] = useState('');
  const navigate = useNavigate();
  let {
    state: { id }
  } = useLocation();

  useEffect(() => {
    const getSpot = async () => {
      const ref = spotsDocRef(db, id);
      const querySnapshot = await getDoc(ref);
      if (querySnapshot.exists()) {
        setData(querySnapshot as DocumentSnapshot<ISpot>);
      }
    };
    if (id) {
      getSpot();
    }
  }, [id]);

  const editHandler = async (newSpot: ISpot) => {
    if (data?.ref) {
      setUpdateError('');
      updateDoc(data?.ref, { ...newSpot }).catch((e: Error) => {
        console.error(e);
        setUpdateError(e.message);
      });
      navigate(HOME);
    }
  };

  return (
    <>
      <Header auth={auth} />
      <div className='p-2 max-w-sm u-center'>
        {user && data?.data() ? (
          <EditSpot
            editHandler={editHandler}
            data={data.data() as ISpot}
            userId={user!.uid}
          />
        ) : null}
        {updateError && <p>{updateError}</p>}
        <Link to={HOME}>Cancel</Link>
      </div>
    </>
  );
};

export default EditSpotPage;
