import fs = require("fs");
import csv = require("csv-parser");
import { LMSRow } from "../types/csv";

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
