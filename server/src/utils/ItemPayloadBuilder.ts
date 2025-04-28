import { ItemReturnMessage } from "../utils/Interfaces/ItemReturnMessage";

export const ItemPayloadBuilder = (props: {
  items: ItemReturnMessage["items"];
  message: ItemReturnMessage["message"];
  status_code: ItemReturnMessage["status_code"];
  errors: ItemReturnMessage["errors"];
  operationComplete: ItemReturnMessage["operationComplete"];
}): ItemReturnMessage => {
  return { ...props };
};
