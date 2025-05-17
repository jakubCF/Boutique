import express, { Request, Response } from "express";

export const PoshRouter = express.Router();

PoshRouter.get("/", async (_: Request, res: Response): Promise<any> => {
  return res.json({ message: "Hello Posh" });
});
