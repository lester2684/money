import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import getBalanceSheet from "./services/xeroService";

const app = express();

app.use(cors());
app.use(express.json());

app.get(
  "/api/balanceSheet/:date?/:periods?/:timeframe?",
  async (req: Request, res: Response) => {
    getBalanceSheet(req, res);
  }
);

app.use(express.static(path.join(__dirname, "build")));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

export { app, server };
