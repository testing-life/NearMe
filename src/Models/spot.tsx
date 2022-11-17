export interface ISpot {
  poster: string;
  tags: string[];
  address: string;
  notes: string;
  createSpot: () => typeof Spot;
}

export class Spot {
  poster: string = "";
  tags: string[] = [];
  address: string = "";
  notes: string = "";
  static createSpot(): Spot {
    return new Spot();
  }
}
