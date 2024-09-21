import axios from "axios";
import { plainToClass } from "class-transformer";
import { IsString, Length, validate } from "class-validator";
import { Request, Response } from "express";

const http = axios.create({
  baseURL: "http://localhost:3000",
});

class RequestBody {
  @Length(1, 30)
  @IsString()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

async function getBalanceSheet(req: Request, res: Response): Promise<void> {
  var date = req.query.date;
  var periods = req.query.periods;
  var timeframe = req.query.timeframe;
  try {
    const response = await http.get(
      `/api.xro/2.0/Reports/BalanceSheet?date=${date}&periods=${periods}&timeframe=${timeframe}`
    );
    const data = plainToClass(RequestBody, response.data);
    const validationErrors = await validate(data);

    if (validationErrors.length === 0) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ errors: validationErrors });
    }
  } catch (error) {
    console.error("Error fetching balance sheet:", error);

    // Optionally send fake data
    // const fakeData = require("../fakeData.json");
    // res.status(200).json(fakeData);

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message || "Internal Server Error";

    res.status(statusCode).json({ error: errorMessage });
  }
}

export default getBalanceSheet;
