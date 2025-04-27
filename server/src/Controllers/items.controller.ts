import { prisma } from "../db/prisma";

const DEFAULT_SELECT = {
  id: true,
  name: true,
  bin_id: true,
  bin: true,
  sold: true,
  web_url: true,
};

export const getItems = async () => {
  try {
    let items = await prisma.item.findMany({ select: DEFAULT_SELECT });
    return items;
  } catch (error) {
    throw error;
  }
};

export const getItemById = async (id: number) => {
  try {
    let item = await prisma.item.findFirst({
      where: { id: id },
      select: DEFAULT_SELECT,
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
    let bin = await prisma.item.delete({
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

export const bulkCreateItems = async (items: { name: string; binId?: number, sold: boolean, web_url: string }[]) => {
  try {
    // Use Prisma's createMany for bulk creation
    console.log(items)
    const createdItems = await prisma.item.createMany({
      data: items.map((item) => ({
        name: item.name,
        bin_id: item.binId || null, // Associate binId if provided, otherwise set to null
        sold: item.sold || false, // Default value for sold
        web_url: item.web_url || "https://poshmark.com", // Associate web_url if provided, otherwise set to null
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
      },
    });

    return fetchedItems;
  } catch (error) {
    console.error("Error creating items:", error);
    console.log(error)
    throw error;
  }
};
