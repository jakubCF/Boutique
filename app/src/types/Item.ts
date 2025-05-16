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
    purchase_date: Date | null;
    sold_date: Date | null;
    made_in: string;
    posh_category: string;
    posh_picture_url: string;
    posh_created_at: Date | null;
    posh_size: string;
    posh_root_ancestor_post_id: string;

}
