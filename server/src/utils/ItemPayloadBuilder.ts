import { ItemReturnMessage } from "../utils/Interfaces/ItemReturnMessage";

export const ItemPayloadBuilder = (
    props: {
        data: ItemReturnMessage["data"], 
        message: ItemReturnMessage["message"],
        status_code: ItemReturnMessage["status_code"],
        errors: ItemReturnMessage["errors"],
        operationComplete: ItemReturnMessage["operationComplete"]
}):ItemReturnMessage => { return {...props} };