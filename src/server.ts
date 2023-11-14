import express from "express";
import { parseCSV } from "./util/csvUtil";
import { calculateZScore } from "./util/calculateZScore";
import { Patient, PatientAttribute } from "./types/patient";
import { LMSRow } from "./types/csv";
import * as path from "path";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/calculate-zscore", async (req, res) => {
  try {
    const {
      agemos,
      sex,
      height,
      weight,
      head_circumference,
      bmi,
      attribute,
      forInfant,
    } = req.query;

    // Convert query parameters to Patient type
    const patient: Patient = {
      agemos: parseFloat(agemos as string),
      sex: parseInt(sex as string),
      height: height ? parseFloat(height as string) : undefined,
      weight: weight ? parseFloat(weight as string) : undefined,
      head_circumference: head_circumference
        ? parseFloat(head_circumference as string)
        : undefined,
      bmi: bmi ? parseFloat(bmi as string) : undefined,
    };

    const validAttributes: Set<PatientAttribute> = new Set([
      "height",
      "weight",
      "head_circumference",
      "bmi",
    ]);

    // Validate attribute
    if (!validAttributes.has(req.query.attribute as PatientAttribute)) {
      return res.status(400).send("Invalid attribute.");
    }

    // Ensure the attribute has a non-null value in the patient object
    if (
      patient[attribute as keyof Patient] === undefined ||
      patient[attribute as keyof Patient] === null
    ) {
      return res.status(400).send(`${attribute} value is missing.`);
    }

    const dataName = `${attribute}-for-age`;

    // bmi calculation is not available for infants
    // head_circumference calculation is only available for infants
    // figure out which csv accordingly
    const dataFilePath =
      (attribute === "head_circumference" || forInfant === "true") &&
      attribute !== "bmi"
        ? dataName + "-infant.csv"
        : dataName + ".csv";

    const filePath = path.join(__dirname, "data", dataFilePath);
    const data: LMSRow[] = await parseCSV(filePath);

    const zScore = calculateZScore(
      patient,
      attribute as PatientAttribute,
      data
    );

    if (zScore !== null) {
      return res.json({ zScore });
    } else {
      return res
        .status(404)
        .send(
          `Could not calculate ${attribute} zScore for patient with agemos: ${patient.agemos}, sex: ${patient.sex}.`
        );
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
