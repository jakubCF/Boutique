
export const FieldTypes: Record<string, string> = {
  name: "string",
  bin_id: "number",
  sold: "boolean",
  web_url: "string",
  buy_price: "number",
  listing_price: "number",
  item_desc: "string",
  purchase_date: "date",
  sold_date: "date",
  brand: "string",
  made_in: "string",
  posh_category: "string",
  posh_picture_url: "string",
  posh_created_at: "date",
  posh_size: "string",
  posh_root_ancestor_post_id: "string"
}; // Item

export const BinFieldTypes: Record<string, string> = {
  name: "string", 
  is_full: "boolean"
}

export const SettingsFieldTypes: Record<string, string> = {
  key: "string",
  value: "string"
}