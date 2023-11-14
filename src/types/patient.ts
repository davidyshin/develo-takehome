export type PatientAttribute =
  | "height"
  | "weight"
  | "head_circumference"
  | "bmi";

export interface Patient {
  agemos: number;
  sex: number;
  weight?: number;
  height?: number;
  head_circumference?: number;
  bmi?: number;
}