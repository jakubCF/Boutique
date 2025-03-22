import express, { NextFunction, Request, Response } from "express";
import { createBin, deleteBin, getBin, getBins, updateBinName } from "../../Controllers/bins.controller";
import { param, validationResult } from "express-validator";
import { BinReturnMessage } from "../../utils/Interfaces/BinReturnMessage";
import { payloadBuilder } from "../../utils/BinPayloadBuilder";
const BinsRouter = express.Router();

// TODO: Handle response sending and errors, this is very rough
// Every function should have 1 return 
// If request has 1 param, it should be invoked through req.params, more than 1 param should use the request body 

BinsRouter.get("/", async (_: Request, res: Response, __: NextFunction): Promise<any> => {
    let payload: BinReturnMessage;

    try {
        const bins = await getBins();
        payload = payloadBuilder({
            data: bins,
            message: "success",
            status_code: 200,
            errors: "none",
            operationComplete: true
        });
    } catch (error) {
        payload = payloadBuilder({
            data: [],
            message: "failure",
            status_code: 500,
            errors: error,
            operationComplete: false
        });
    }

    return res.status(payload.status_code).send(payload);
});

BinsRouter.get("/:id", param("id").isInt() , async (req: Request, res: Response) : Promise<any> => {
    const result = validationResult(req); // Validate errors 
    
    let payload: BinReturnMessage;

    if(result.isEmpty()) { // Passes test calls controller function
        try {
            const bin = await getBin(parseInt(req.params.id));

            payload = payloadBuilder({
                data: bin,
                message: "success",
                status_code: 200,
                errors: "none",
                operationComplete: true
            });
        }
        catch(error) {
            payload = payloadBuilder({
                data: [],
                message: "failure",
                status_code: 500,
                errors: error,
                operationComplete: false
            });
        }
    } 
    else {
        payload = payloadBuilder({
            data: [],
            message: "failure",
            status_code: 400,
            errors: result.array(),
            operationComplete: false
        });
    }
    return res.status(payload.status_code).send(payload);
});

BinsRouter.post("/create/:name", 
    param("name").isString().exists().trim(), 
    async (req: Request, res: Response) : Promise<any> => {
    
        const result = validationResult(req);

        let payload: BinReturnMessage;

        if(result.isEmpty()) {
            try {
                const bin = await createBin(req.params.name);

                payload = payloadBuilder({
                    data: bin,
                    message: "success",
                    status_code: 200,
                    errors: "none",
                    operationComplete: true
                });
            } catch (error) {
                payload = payloadBuilder({
                    data: [],
                    message: "failure",
                    status_code: 500,
                    errors: error,
                    operationComplete: false
                });
            }
        }
        else {
            payload = payloadBuilder({
                data: [],
                message: "failure",
                status_code: 400,
                errors: result.array(),
                operationComplete: false
            });
        }

        return res.status(payload.status_code).send(payload);
});

BinsRouter.delete("/delete/:id", param("id").isInt(), async (req: Request, res: Response) : Promise<any> => {
    const result = validationResult(req);

    let payload: BinReturnMessage;

    if(result.isEmpty()) {
        try {
            const bin = await deleteBin(parseInt(req.params.id)); // Returns boolean on delete

            payload = payloadBuilder({
                data: [],
                message: "success",
                status_code: 200,
                errors: "none",
                operationComplete: bin // Boolean
            });
        } catch (error) {
            payload = payloadBuilder({
                data: [],
                message: "failure",
                status_code: 500,
                errors: error,
                operationComplete: false
            });
        }
    }
    else {
            payload = payloadBuilder({
            data: [],
            message: "failure",
            status_code: 400,
            errors: result.array(),
            operationComplete: false
            });
        }

        return res.status(payload.status_code).send(payload);
});

BinsRouter.patch("/update/:id/name/:value",
    param("id").isInt(),
    param("value").isString().exists().trim(),
    async (req: Request, res: Response) : Promise<any> => {
        const result = validationResult(req);

        let payload: BinReturnMessage;

        if(result.isEmpty()) {
            try {
                const bin = await updateBinName(parseInt(req.params.id), req.params.value);

                payload = payloadBuilder({
                    data: bin,
                    message: "success",
                    status_code: 200,
                    errors: "none",
                    operationComplete: true
                });
            } catch (error) {
                payload = payloadBuilder({
                    data: [],
                    message: "failure",
                    status_code: 500,
                    errors: error,
                    operationComplete: false
                });
            }
        }
        else {
            payload = payloadBuilder({
                data: [],
                message: "failure",
                status_code: 400,
                errors: result.array(),
                operationComplete: false
            });
        }

        return res.status(payload.status_code).send(payload);
});

BinsRouter.patch("/update/:id/is_full/:value", async (req: Request, res: Response) : Promise<any> => {
    
});

BinsRouter.patch("/update/:id/add_item/:item_id", async (req: Request, res: Response) : Promise<any> => {
});

BinsRouter.patch("/update/:id/remove_item/:item_id", async (req: Request, res: Response) : Promise<any> => {
});


export default BinsRouter