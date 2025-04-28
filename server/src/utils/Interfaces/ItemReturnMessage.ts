import { ValidationError } from "express-validator";

export interface ItemReturnMessage {
  message: string | "success" | "fail";
  items:
    | {
        id: number;
        name: string;
        bin: {
          id: number;
          name: string;
          is_full: boolean;
        };
        bin_id: number;
      }[]
    | {
        id: number;
        name: string;
        bin: {
          id: number;
          name: string;
          is_full: boolean;
        };
        bin_id: number;
      }
    |
    {
      id: number;
      name: string;
      bin: {
        id: number;
        name: string;
        is_full: boolean;
      } | null;
      sold: boolean;
    }[]
  | [];
  operationComplete: boolean;
  errors: Error[] | "none" | Error | ValidationError[];
  status_code: number;
}
