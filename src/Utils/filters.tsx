import { ISpot } from "../Models/spot";

export const filterSpots = (spot: ISpot, filters: string[]) =>
  filters.every((filter) => spot.tags.includes(filter));
