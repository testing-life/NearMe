import { Spot } from "./spot";

export interface IProfile {
  username: string;
  email: string;
  create: () => typeof Profile;
}

export class Profile {
  username: string = "";
  email: string = "";
  static create(): Profile {
    return new Profile();
  }
}
