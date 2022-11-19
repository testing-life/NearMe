import { GeoPoint } from "firebase/firestore";
import { Ilocation } from "../Hooks/useGeolocation";

export interface ISpot {
  poster: { filePath: string; url: URL };
  tags: string[];
  address: string;
  notes: string;
  location: Ilocation;
  name: string;
  create: () => typeof Spot;
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
