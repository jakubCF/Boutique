import express, { Request, Response } from "express";
import {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  updateItemName,
  updateItemSold,
  bulkCreateItems,
  updateItemUrl,
  updateItemFields,
} from "../Controllers/items.controller";
import { ItemReturnMessage } from "../utils/Interfaces/ItemReturnMessage";
import { ItemPayloadBuilder } from "../utils/ItemPayloadBuilder";
import { param, body, validationResult } from "express-validator";
import { FieldTypes } from "../utils/FieldTypes";

interface ItemParams {
  id: number;
  name: string;
  bin_id?: number;
  sold?: 1 | 0; // 1 = sold, 0 = not sold
  web_url?: string;
  buy_price?: number;
  listing_price?: number;
  item_desc?: string;
  brand?: string;
  purchase_date?: Date;
  sold_date?: Date;
  made_in?: string;
  posh_category?: string;
  posh_picture_url?: string;
  posh_created_at?: Date;
  posh_size?: string;
  posh_root_ancestor_post_id?: string;
}

// Define the default select for the item

const ItemsRouter = express.Router();

ItemsRouter.get(
  "/",
  async (_: Request<ItemParams>, res: Response): Promise<any> => {
    let payload: ItemReturnMessage;

    try {
      let items = await getItems();
      payload = ItemPayloadBuilder({
        items: items,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
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
        items: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
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
        items: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
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
        items: [],
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: item,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
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
        items: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
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
  "/update/:id/url",
  param("id").exists().isInt().toInt(),
  body("web_url")
    .exists()
    .isURL()
    .withMessage("url must be a valid URL")
    .trim(),
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    const { id } = req.params;
    const { web_url } = req.body;
    let payload: ItemReturnMessage;
    try {
      let item = await updateItemUrl(id, web_url);
      payload = ItemPayloadBuilder({
        items: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
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
        items: item,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }
    return res.status(payload.status_code).json(payload);
  },
);
ItemsRouter.post(
  "/bulk/create",
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one item"),
  body("items.*.name")
    .isString()
    .trim()
    .escape()
    .withMessage("Each item must have a valid name"),
  body("items.*.binId")
    .optional()
    .isInt()
    .withMessage("binId must be a valid integer"),
  body("items.*.sold")
    .optional()
    .isBoolean()
    .withMessage("sold must be a boolean value"),
    body("items.*.web_url")
    .optional()
    .isURL()
    .withMessage("url must be a valid URL"),
  body("items.*.buy_price")
    .optional()
    .isNumeric()
    .withMessage("buy_price must be a valid number"),
  body("items.*.listing_price")
    .optional()
    .isNumeric()
    .withMessage("listing_price must be a valid number"),
  body("items.*.item_desc")
    .optional()
    .isString()
    .withMessage("item_desc must be a valid string"),
  async (req: Request, res: Response): Promise<any> => {
    const { data } = req.body;
    let payload: ItemReturnMessage;
    console.log(data.values.value)
    try {
      const createdItems = await bulkCreateItems(data.values.value.items);
      payload = ItemPayloadBuilder({
        items: createdItems,
        message: "success",
        status_code: 201,
        errors: "none",
        operationComplete: true,
      });
    } catch (error) {
      payload = ItemPayloadBuilder({
        items: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      });
    }

    return res.status(payload.status_code).json(payload);
  }
);

ItemsRouter.patch(
  "/update/:id",
  [
    param("id").exists().isInt().toInt(), // Validate that id is an integer
    body("updates")
      .isArray({ min: 1 })
      .withMessage("updates must be an array with at least one update"),
    body("updates.*.field")
      .isString()
      .withMessage("Each update must have a valid field name")
      .custom((field) => {
        if (!FieldTypes[field]) {
          throw new Error(`Invalid field: ${field}`);
        }
        return true;
      }),
    body("updates.*.value").custom((value, { req }) => {
      const field = req.body.updates.find((update: any) => update.value === value)?.field;
      const expectedType = FieldTypes[field];

      if (!expectedType) {
        throw new Error(`Cannot validate value for an invalid field: ${field}`);
      }

      // Validate the value's type
      if (expectedType === "number" && typeof value !== "number") {
        throw new Error(`Value for field "${field}" must be a number`);
      }

      if (expectedType === "string" && typeof value !== "string") {
        throw new Error(`Value for field "${field}" must be a string`);
      }

      if (expectedType === "boolean" && typeof value !== "boolean") {
        throw new Error(`Value for field "${field}" must be a boolean`);
      }

      return true;
    }),
  ],
  async (req: Request<ItemParams>, res: Response): Promise<any> => {
    const { id } = req.params;
    const { updates } = req.body;

    let payload: ItemReturnMessage;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const updatedItem = await updateItemFields(id, updates);
      payload = {
        items: updatedItem,
        message: "success",
        status_code: 200,
        errors: "none",
        operationComplete: true,
      };
    } catch (error) {
      payload = {
        items: [],
        message: "fail",
        status_code: 500,
        errors: error.message,
        operationComplete: false,
      };
    }

    return res.status(payload.status_code).json(payload);
  }
);
export default ItemsRouter;
