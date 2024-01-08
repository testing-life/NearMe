import React, { FC } from "react";
import "./Pill.css";

interface Props {
  label: string;
}

const Pill: FC<Props> = ({ label }) => {
  return <span className="pill">{label}</span>;
};

export default Pill;
