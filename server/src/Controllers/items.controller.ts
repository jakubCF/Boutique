import { FieldTypes } from "../utils/FieldTypes";
import { prisma } from "../db/prisma";

const DEFAULT_SELECT = {
  id: true,
  name: true,
  bin_id: true,
  bin: true,
  sold: true,
  web_url: true,
  buy_price: true, 
  listing_price: true, 
  item_desc: true,
  purchase_date: true,
  sold_date: true,
  brand: true,
  made_in: true,
  posh_category: true,
  posh_picture_url: true,
  posh_created_at: true,
  posh_size: true,
  posh_root_ancestor_post_id: true
};

export const getItems = async () => {
  try {
    let items = await prisma.item.findMany({ 
          select: DEFAULT_SELECT, 
          orderBy: [
            { posh_created_at: 'desc' },
            { id: 'desc' }
            ], 
        });
    return items;
  } catch (error) {
    throw error;
  }
};

export const updateItemFields = async (id: number, updates: { field: string; value: any }[]) => {
  try {
    // Convert the updates array into an object for Prisma
    const data: Record<string, any> = {};
    updates.forEach(({ field, value }) => {
      data[field] = value;
    });

    // Validate that all fields are valid
    const invalidFields = Object.keys(data).filter((field) => !FieldTypes[field]);
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
    }

    // Perform the update
    const item = await prisma.item.update({
      where: { id },
      data,
      select: DEFAULT_SELECT,
    });

    return item;
  } catch (error) {
    console.error("Error updating item fields:", error);
    throw error;
  }
};

export const getItemById = async (id: number) => {
  try {
    let item = await prisma.item.findFirst({
      where: { id: id },
      select: DEFAULT_SELECT,
      order: { id: "asc" },
    });
    return item;
  } catch (error) {
    throw error;
  }
};

export const createItem = async (name: string) => {
  try {
    let item = await prisma.item.create({
      data: {
        name: name,
      },
      select: DEFAULT_SELECT,
    });
    return item;
  } catch (error) {
    throw error;
  }
};
export const deleteItem = async (id: number) => {
  console.log(id);
  try {
    await prisma.item.delete({
      where: { id: id },
      select: DEFAULT_SELECT,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateItemName = async (id: number, name: string) => {
  try {
    let item = await prisma.item.update({
      where: { id: id },
      data: { name: name },
      select: DEFAULT_SELECT,
    });
    return item;
  } catch (error) {
    throw error;
  }
};

export const updateItemSold = async (id: number, sold: 1 | 0) => {
  let validation: boolean;
  switch (sold) {
    case 1:
      validation = true;
      break;
    case 0:
      validation = false;
      break;
    default:
      throw new Error("Invalid value for sold");
  }
  try {
    let item = await prisma.item.update({
      where: { id: id },
      data: { sold: validation },
      select: DEFAULT_SELECT,
    });
    return item;
  } catch (error) {
    throw error;
  }
};

export const updateItemUrl = async (id: number, web_url: string) => {
  try {
    let item = await prisma.item.update({
      where: { id: id },
      data: { web_url: web_url },
      select: DEFAULT_SELECT,
    });
    return item;
  } catch (error) {
    throw error;
  }
};

export const bulkCreateItems = async (items: { name: string; binId?: number, sold: boolean, web_url: string, buy_price: number | null, listing_price: number | null, item_desc: string | null, brand: string | null, purchase_date: Date | null, sold_date: Date | null }[]) => {
  try {
    // Use Prisma's createMany for bulk creation
    await items.map(item => console.log(item))
    await prisma.item.createMany({
      data: items.map((item) => ({
        name: item.name,
        bin_id: item.binId || null, // Associate binId if provided, otherwise set to null
        sold: item.sold || false, // Default value for sold
        web_url: item.web_url || "https://poshmark.com", // Associate web_url if provided, otherwise set to null
        buy_price: item.buy_price || null, // Associate buy_price if provided, otherwise set to null
        listing_price: item.listing_price || null, // Associate listing_price if provided, otherwise set to null  
        item_desc: item.item_desc || null,
        brand: item.brand || null,
        purchase_date: item.purchase_date || null,
        sold_date: item.sold_date || null
      })),
      skipDuplicates: true, // Avoid duplicate entries
    });

    // Fetch the created items to return them
    const fetchedItems = await prisma.item.findMany({
      where: {
        name: {
          in: items.map((item) => item.name),
        },
      },
      select: {
        id: true,
        name: true,
        bin: {
          select: {
            id: true,
            name: true,
            is_full: true,
          },
        },
        sold: true,
        web_url: true,
        buy_price: true, 
        listing_price: true, 
        item_desc: true,
        brand: true,
        purchase_date: true,
        sold_date: true
      },
    });
    console.log(fetchedItems)
    return fetchedItems;
  } catch (error) {
    throw error;
  }
};
