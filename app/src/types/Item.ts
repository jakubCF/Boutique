export type Item = {
    id: number;
    name: string;
    binId: number;
    bin?: {
        id: number,
        name: string,
        is_full: boolean
    } | null;
    sold: boolean;
    web_url: string;
    buy_price: number;
    listing_price: number;
    item_desc: string;
    brand: string;
    purchase_date: Date;
    sold_date: Date;
}
