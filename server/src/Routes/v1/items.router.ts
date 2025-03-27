import express, { Request, Response } from "express";
import {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  updateItemName,
  updateItemSold,
} from "../../Controllers/items.controller";
import { ItemReturnMessage } from "../../utils/Interfaces/ItemReturnMessage";
import { ItemPayloadBuilder } from "../../utils/ItemPayloadBuilder";
import { param } from "express-validator";

interface ItemParams {
  id: number;
  name: string;
  bin_id: number;
  sold: 1 | 0; // 1 = sold, 0 = not sold
}

const ItemsRouter = express.Router();

ItemsRouter.get(
  "/",
  async (_: Request<ItemParams>, res: Response): Promise<any> => {
    let payload: ItemReturnMessage;

    try {
      let items = await getItems();
      payload = ItemPayloadBuilder({
        data: items,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        data: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }

    return res.status(payload.status_code).json(payload);
  },
);

ItemsRouter.get(
  "/:id",
  param("id").isInt().toInt(),
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    let payload: ItemReturnMessage;
    let id = req.params.id;

    try {
      let item = await getItemById(id);

      if (!item) {
        throw new Error("Item not found");
      }

      payload = ItemPayloadBuilder({
        data: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        data: [],
        message: "fail",
        status_code: error.message == "Item not found" ? 404 : 500, // 404 if item not found, 500 if other error
        errors: error.message,
        operationComplete: false,
      });
    }
    return res.status(payload.status_code).json(payload);
  },
);
ItemsRouter.post(
  "/create/:name",
  param("name").isString().trim().escape(),
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    const { name } = req.params;

    let payload: ItemReturnMessage;

    try {
      let item = await createItem(name);
      payload = ItemPayloadBuilder({
        data: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        data: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }
    return res.status(payload.status_code).json(payload);
  },
);

ItemsRouter.delete(
  "/delete/:id",
  param("id").exists().isInt().toInt(),
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    const { id } = req.params;

    let payload: ItemReturnMessage;

    try {
      let item = await deleteItem(id);

      payload = ItemPayloadBuilder({
        data: [],
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: item,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        data: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }
    return res.status(payload.status_code).json(payload);
  },
);

ItemsRouter.patch(
  "/update/name/:id/:name",
  param("id").exists().isInt().toInt(),
  param("name").exists().isString().trim().escape(),
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    const { id, name } = req.params;

    let payload: ItemReturnMessage;

    try {
      let item = await updateItemName(id, name);
      payload = ItemPayloadBuilder({
        data: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        data: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }
    return res.status(payload.status_code).json(payload);
  },
);

ItemsRouter.patch(
  "/update/sold/:id/:sold",
  param("id").exists().isInt().toInt(),
  param("sold")
    .exists()
    .toInt()
    .isIn([0, 1])
    .withMessage("value must be 0 or 1"),
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    const { id, sold } = req.params;

    let payload: ItemReturnMessage;

    try {
      let item = await updateItemSold(id, sold);
      payload = ItemPayloadBuilder({
        data: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        data: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }
    return res.status(payload.status_code).json(payload);
  },
);

export default ItemsRouter;
