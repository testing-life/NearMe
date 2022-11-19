import { GeoPoint } from "firebase/firestore";
import { Ilocation } from "../Hooks/useGeolocation";

export interface ISpot {
  poster: { filePath: string; url: string };
  tags: string[];
  address: string;
  notes: string;
  location: Ilocation;
  name: string;
}

export class Spot {
  poster = { filePath: "", url: "" };
  tags: string[] = [];
  address: string = "";
  notes: string = "";
  name: string = "";
  location: Ilocation = new GeoPoint(0, 0);
  static create(): Spot {
    return new Spot();
  }
}
