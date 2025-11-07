export interface LegoSet {
  code: string;
  requestedName: string;
  legoName: string;
  productUrl: string;
  exists: boolean;
  theme?: string;
  note?: string;
  imageUrl?: string;
}
