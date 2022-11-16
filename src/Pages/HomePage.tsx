import React, { ChangeEvent, useState } from "react";
import { blobToBase64 } from "../Utils/image";

const HomePage = () => {
  const [first, setfirst] = useState("");
  const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("target", e.target);
    const img = await blobToBase64(e.target.files![0]);
    setfirst(`url(${img}`);
  };
  return (
    <div
      style={{
        backgroundSize: "contain",
        backgroundImage: first,
        height: "100vh",
      }}
    >
      HomePage
      <input type="file" placeholder="image" onChange={uploadHandler} />
    </div>
  );
};

export default HomePage;
