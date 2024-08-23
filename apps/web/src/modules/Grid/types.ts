export enum SortOptionsEnum {
  dateDesc = 'dateDesc',
  dateAsc = 'dateAsc',
  rating = 'rating',
  popularity = 'popularity',
}

export interface YearRange {
  min: Date;
  max: Date;
}
