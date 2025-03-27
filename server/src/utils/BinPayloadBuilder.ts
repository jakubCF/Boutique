import { BinReturnMessage } from "src/utils/Interfaces/BinReturnMessage";

export const payloadBuilder = (props: {
  data: BinReturnMessage["data"];
  message: BinReturnMessage["message"];
  status_code: BinReturnMessage["status_code"];
  errors: BinReturnMessage["errors"];
  operationComplete: BinReturnMessage["operationComplete"];
}): BinReturnMessage => {
  return { ...props };
};
