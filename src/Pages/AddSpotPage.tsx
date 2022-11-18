import React from "react";
import AddSpot from "../Components/AddSpot/AddSpot";
import { Spot } from "../Models/spot";

const AddSpotPage = () => {
  const addSpot = (spot: Spot) => {
    console.log("spot", spot);
  };

  return <AddSpot submitHandler={addSpot} />;
};

export default AddSpotPage;
