import { Item } from "./Item";

export type Bin = {
    id: number;
    name: string;
    is_full: boolean;
    items: Item[]; // Assuming you have an Item type defined elsewhere
}