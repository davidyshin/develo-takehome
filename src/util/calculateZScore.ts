// Assuming LMSRow is defined as before
import { LMSRow } from "./csvUtil";

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

export const calculateZScore = (
  patient: Patient,
  attribute: PatientAttribute,
  data: LMSRow[]
): number | null => {
  const { agemos, sex, ...measurements } = patient;
  const measurement = measurements[attribute];
  if (measurement === undefined) {
    return null;
  }

  const LMS = findLMSForAgeAndSex(sex, agemos, data);
  if (LMS !== null) {
    const { L, M, S } = LMS;
    // zScore calculation formula given
    return L !== 0
      ? (Math.pow(measurement / M, L) - 1) / (L * S)
      : Math.log(measurement / M) / S;
  }
  return null;
};

// Return LMS for specific age and sex provided by query params
export const findLMSForAgeAndSex = (
  sex: number,
  agemos: number,
  data: LMSRow[]
): { L: number; M: number; S: number } | null => {
  const ageFloor = Math.floor(agemos);
  const ageCeiling = ageFloor + 1;

  const row = data.find((row) => {
    const ageInData = parseFloat(row.Agemos);
    // Check if the provided age falls within the range for this data point
    // Based on https://www.cdc.gov/growthcharts/percentile_data_files.htm
    return (
      parseInt(row.Sex) === sex &&
      ageInData > ageFloor &&
      ageInData <= ageCeiling
    );
  });
  if (row) {
    return { L: row.L, M: row.M, S: row.S };
  } else {
    return null;
  }
};
