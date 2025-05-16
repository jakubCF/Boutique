import { ValidationError } from "express-validator";

interface Bin {
  id: number;
  name: string;
  is_full: boolean;
}

interface Item {
  id: number;
  name: string;
  bin: Bin | null;
  bin_id?: number;
  sold?: boolean;
  buy_price: number | null;
  listing_price: number | null;
  item_desc: string | null;
  purchase_date?: Date | null;
  sold_date?: Date | null;
  brand?: string | null;
}
export interface ItemReturnMessage {
  message: string | "success" | "fail";
  items: Item | Item[] | [];
  operationComplete: boolean;
  errors: Error | Error[] | ValidationError[] | "none";
  status_code: number;
}
