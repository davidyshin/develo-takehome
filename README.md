# Develo - Growth Chart Calculation (Take Home)

## Introduction
This project is a backend service that calculates how a patient is growing, as a percentile, relative to how they should be growing based on inter/national growth standards from the WHO and CDC

## Technologies Used
- **Node.js**
- **TypeScript**
- **Express.js**
- **csv-parser**

## Setup and Installation
To get this project up and running on your local machine, follow these steps:


### Installation Steps
1. Clone the repository:
```
git clone https://github.com/davidyshin/develo-takehome.git
```

2. Navigate to the project directory:
```
cd develo-takehome
```
3. Install dependencies:
```
npm install
```

### Running the Server
To start the server, run:
```
npm start
```

The server will start on `http://localhost:3000`.

### API Endpoint
The main endpoint provided by this server is:

- `GET /calculate-zscore`: Calculates the Z-score based on patient data and growth attributes.
  - Example query: 
   `/calculate-zscore?agemos=13.5&sex=1&height=70&attribute=height`

### Code Structure
- `src/server.ts`: The main server file where the basic Express app is configured and `/calculate-zscore` endpoint lives.
- `src/csvUtil.ts`: Utility for handling the parsing of CSV files.
- `data/`: Directory containing the growth standard CSV files.


### CSV Data Handling
I chose to download the local CSV files provided and keep it in my codebase. I would have preferred using an API for real time, maintained data. However, after some research I found that the WHO/CDC provides the growth standards in CSV format. 

Using a uniform file name (ex: {attribute}-for-age.csv), we can use the attribute passed into the query parameters and can read the respective CSV file to locate the data we need.

- One feature I decided to add was the `forInfant` boolean parameter. This parameter allows the API to determine whether to use the csv file tailored for infants or the standard growth data csv file.
  - If `forInfant === true`, we append `"-infant"` to the csv file name.
  ```
    // bmi calculation is not available for infants
    // head_circumference calculation is only available for infants
    // figure out which csv accordingly
    const dataFilePath =
      (attribute === "head_circumference" || forInfant === "true") &&
      attribute !== "bmi"
        ? dataName + "-infant.csv"
        : dataName + ".csv";
    ```


### Challenges and Solutions
- **Understanding Growth Data**: Grasping the medical concepts of growth chart data, especially the L, M, and S values, was a unique challenge. However, with the given zScore calculation formula, it became a matter of parsing the csv, shaping the data and effectively plugging it in.

```
 if (LMS !== null) {
    const { L, M, S } = LMS;
    // zScore calculation formula given
    return L !== 0
      ? (Math.pow(measurement / M, L) - 1) / (L * S)
      : Math.log(measurement / M) / S;
  }
```

### Nice to haves
- **Unit Tests**: I went ahead and tested this endpoint manually, but think that I could've achieved a higher level of quality assurance by writing unit tests.
- **Additional Endpoints**: I'd love to see how I can further expand the API to include more endpoints for different types of growth data and calculations.

### Conclusion
Thank you for considering this project. I look forward to any feedback and the opportunity to discuss my work further.
