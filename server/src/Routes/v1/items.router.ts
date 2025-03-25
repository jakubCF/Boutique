import express, { Request, Response } from "express";
import { getItems, getItemById, createItem, deleteItem, updateItemName, updateItemSold } from "../../Controllers/items.controller";
import { ItemReturnMessage } from "../../utils/Interfaces/ItemReturnMessage";
import { ItemPayloadBuilder } from "../../utils/ItemPayloadBuilder";

interface ItemParams {
    id: number;
}

const ItemsRouter = express.Router();

ItemsRouter.get("/", async (req: Request<ItemParams>, res: Response): Promise<any> => {
    let payload: ItemReturnMessage;

    try {
        let items = await getItems();
        payload = ItemPayloadBuilder({
            data: items,
            message: "success",
            status_code: 200,
            errors: "none",
            operationComplete: true
        })
    }
    catch (error) {
        payload = ItemPayloadBuilder({
            data: [],
            message: "fail",
            status_code: 500,
            errors: error,
            operationComplete: false
        })
    }
    
    return res.status(payload.status_code).json(payload);
})

export default ItemsRouter