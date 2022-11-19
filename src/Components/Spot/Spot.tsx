import { IKImage } from "imagekitio-react";
import React, { FC } from "react";
import { ISpot } from "../../Models/spot";

interface Props {
  spot: ISpot;
}

const Spot: FC<Props> = ({ spot }) => {
  return (
    <article>
      {spot.poster.filePath ? (
        <IKImage
          lqip={{ active: true, quality: 20 }}
          path={spot.poster.filePath}
        />
      ) : null}
      {spot.tags ? <span>{spot.tags[0]}</span> : null}
      <span>{spot.name}</span>
      <span>{spot.address}</span>
      {spot.notes ? <span>{spot.notes}</span> : null}
    </article>
  );
};

export default Spot;
