import fs = require("fs");
import csv = require("csv-parser");

export interface LMSRow {
  Sex: string; // 1 for male, 2 for female
  Agemos: string;
  L: number;
  M: number;
  S: number;
}

export const parseCSV = (filePath: string): Promise<LMSRow[]> => {
  const results: LMSRow[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => reject(err));
  });
};
