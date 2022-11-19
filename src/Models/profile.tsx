import { Spot } from "./spot";

export interface IProfile {
  username: string;
  spots: Spot[];
  email: string;
  create: () => typeof Profile;
}

export class Profile {
  username: string = "";
  spots: Spot[] = [];
  email: string = "";
  static create(): Profile {
    return new Profile();
  }
}
