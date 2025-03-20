import express, { NextFunction, Request, Response } from "express";
import { getBins } from "../../Controllers/bins.controller";
import { param, Result, ValidationError, validationResult } from "express-validator";
import { Bin } from "@prisma/client";


const BinsRouter = express.Router();

// TODO: Handle response sending and errors, this is very rough

BinsRouter.get("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const bins = await getBins()
        .catch(error => {
            return res.status(500).send(error)
        })

    return res.status(200).send(bins); 
})

BinsRouter.get("/:id", param("id").isInt() , async (req: Request, res: Response) : Promise<any> => {
    const result = validationResult(req);


    if(result.isEmpty()) {
    } 
    else {
        return res.status(500).json({
            message: "Failed",
            result
        })
    }

    return res.status(200).send(result); // Result is not the right send fix later

    
})

export default BinsRouter