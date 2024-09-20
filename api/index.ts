import express, { NextFunction, Request, Response } from "express";
import { Length, IsString, validate } from "class-validator";
import cors from "cors";
import { plainToClass } from "class-transformer";
import axios from "axios";
import path from "path";

const app = express();
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

app.use(cors());
app.use(express.json());

app.get("/api/balanceSheet", async (req: Request, res: Response) => {
  try {
    const response = await http.get(`/api.xro/2.0/Reports/BalanceSheet`);

    const data = plainToClass(RequestBody, response.data);
    const validationErrors = await validate(data);

    if (validationErrors.length === 0) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ errors: validationErrors });
    }
  } catch (error) {
    console.error("Error fetching balance sheet:", error);
    res.status(500).json({ error: "Internal Server Error" });
    // Optionally send fake data
    // const fakeData = require("./fakeData.json");
    // res.status(200).json(fakeData);
  }
});

app.use(express.static(path.join(__dirname, "build")));
app.use((req: Request, res: Response, next: NextFunction) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    return next();
  }

  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Expires", "-1");
  res.setHeader("Pragma", "no-cache");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
