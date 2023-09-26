import React, { FC, ReactNode } from "react";
import { ISpot } from "../../Models/spot";
import "./Spot.css";
interface Props {
  spot: ISpot;
  children: ReactNode;
}

const Spot: FC<Props> = ({ spot, children }) => {
  return (
    <article className="card m-2 h-100p u-flex u-flex-column">
      <div className="card__container">
        <div className="card__image bg-dark">
          {spot.poster.url ? (
            <img
              className="h-100p w-100p image-cover"
              src={spot.poster.url}
              alt=""
            />
          ) : null}
        </div>
        <div className="card__title-container">
          <p className="title">{spot.name}</p>
          <span className="subtitle">{spot.address}</span>
        </div>
      </div>
      {spot.notes ? (
        <div className="content w-80p notes-max-hight">
          <p className="leading-tight">
            <span>{spot.notes}</span>
          </p>
        </div>
      ) : null}
      <div className="card__action-bar u-center">{children}</div>
      <div className="card__footer">
        <div className="u-text-center">
          <ul className="ml-0 p-1 u-flex u-gap-1 u-flex-wrap tag-container">
            {spot.tags
              ? spot.tags.map((tag) => (
                  <li className="u-inline">
                    <span className="tag bg-yellow-300 text-yellow-900 tag--rounded tag--sm">
                      {tag}
                    </span>
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
