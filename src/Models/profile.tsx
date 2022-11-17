import { Spot } from "./spot";

export interface IProfile {
  username: string;
  spots: Spot[];
  create: () => typeof Profile;
}

export class Profile {
  username: string = "";
  spots: Spot[] = [];
  static create(): Profile {
    return new Profile();
  }
}
