import { ValidationError } from "express-validator";

export interface BinReturnMessage {
  message: string | "success" | "fail";
  data:
    | {
        id: number;
        name: string;
        is_full: boolean;
        items?: {
          id: number;
          name: string;
          sold: boolean;
          bin_id: number;
        }[];
      }[]
    | {
        id: number;
        name: string;
        is_full: boolean;
        items: {
          id: number;
          name: string;
          sold: boolean;
          bin_id: number;
        }[];
      }
    | [];
  operationComplete: boolean;
  errors: Error[] | "none" | Error | ValidationError[];
  status_code: number;
}
