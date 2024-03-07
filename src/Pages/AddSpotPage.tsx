import { addDoc, collection } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import AddSpot from '../Components/AddSpot/AddSpot';
import { HOME } from '../Consts/Routes';
import { auth, db } from '../Firebase/Firebase';
import { Spot } from '../Models/spot';
import Header from '../Components/Header/Header';
import { spotsCollectionRef } from '../Consts/SpotsRef';

const AddSpotPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const addSpot = async (spot: Spot) => {
    const ref = user && spotsCollectionRef(db);
    if (ref) {
      await addDoc(ref, spot).catch((e: Error) => console.error(e));
      navigate(HOME);
    }
  };

  return (
    <>
      <Header auth={auth} />
      <div className='p-2 max-w-sm u-center'>
        {user ? <AddSpot submitHandler={addSpot} userId={user.uid} /> : null}
      </div>
    </>
  );
};

export default AddSpotPage;
