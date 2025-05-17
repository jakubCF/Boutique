// routes/settings.routes.ts
import express, { Request, Response } from "express";
import { getSettings, updateSettings } from "../Controllers/settings.controller"

const SettingsRouter = express.Router();

SettingsRouter.get(
  "/",
  async (_: Request, res: Response): Promise<any> => {
    let payload;

    try {
      let settings = await getSettings();
      payload = {
        settings: settings,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      };
    } catch (error: any) {
      payload = {
        settings: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      };
    }

    return res.status(payload.status_code).json(payload);
  }
);

SettingsRouter.post(
  "/",
  async (req: Request, res: Response): Promise<any> => {
    let payload;

    try {
      // Assuming updateSettings takes the request body and returns updated settings or a status
      const updatedSettings = await updateSettings(req.body.settings);

      payload = {
        settings: updatedSettings,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      };
    } catch (error: any) {
      payload = {
        settings: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      };
    }

    return res.status(payload.status_code).json(payload);
  }
);


export default SettingsRouter;