import { IKImage } from "imagekitio-react";
import React, { FC, ReactNode } from "react";
import { ISpot } from "../../Models/spot";
import "./Spot.css";
interface Props {
  spot: ISpot;
  children: ReactNode;
}

const Spot: FC<Props> = ({ spot, children }) => {
  return (
    <article className="card m-2">
      <div className="card__container">
        <div className="card__image bg-dark">
          {spot.poster.filePath ? (
            <IKImage
              lqip={{ active: true, quality: 20 }}
              path={spot.poster.filePath}
              className="h-100p image-cover"
            />
          ) : null}
        </div>
        <div className="card__title-container">
          <p className="title">{spot.name}</p>
          <span className="subtitle">{spot.address}</span>
        </div>
      </div>
      <div className="content w-80p .notes-max-hight">
        <p className="leading-tight">
          {spot.notes ? <span>{spot.notes}</span> : null}
        </p>
      </div>
      <div className="card__action-bar u-center">{children}</div>
      <div className="card__footer">
        <div className="u-text-center">
          <ul className="ml-0 p-2 u-flex u-gap-3 u-flex-wrap">
            {spot.tags
              ? spot.tags.map((tag) => (
                  <li className="u-inline">
                    <span>{tag}</span>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default Spot;
