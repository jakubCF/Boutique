import { BinFieldTypes } from "../utils/FieldTypes";
import { prisma } from "../db/prisma";

const DEFAULT_SELECT = {
  id: true,
  is_full: true,
  name: true,
  items: true,
};

export const getBins = async () => {
  try {
    let bins = await prisma.bin.findMany({ select: DEFAULT_SELECT });
    return bins;
  } catch (error) {
    throw error;
  }
};

export const getBin = async (id: number) => {
  try {
    let bin = await prisma.bin.findFirst({
      where: { id: id },
      select: DEFAULT_SELECT,
    });

    return bin;
  } catch (error) {
    throw error;
  }
};

export const createBin = async (name: string) => {
  try {
    let bin = await prisma.bin.create({
      data: {
        name: name,
      },
      select: DEFAULT_SELECT,
    });
    return bin;
  } catch (error) {
    throw error;
  }
};

export const deleteBin = async (id: number) => {
  try {
    await prisma.bin.delete({
      where: { id: id },
      select: DEFAULT_SELECT,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateBinName = async (id: number, name: string) => {
  try {
    let bin = await prisma.bin.update({
      where: { id: id },
      data: { name: name },
      select: DEFAULT_SELECT,
    });
    return bin;
  } catch (error) {
    throw error;
  }
};

export const updateBinIsFull = async (id: number, isFull: 1 | 0) => {
  let validation: boolean;
  switch (isFull) {
    case 1:
      validation = true;
      break;
    case 0:
      validation = false;
      break;
    default:
      throw new Error("Invalid value for isFull");
  }
  try {
    let bin = await prisma.bin.update({
      where: { id: id },
      data: { is_full: validation },
      select: DEFAULT_SELECT,
    });
    return bin;
  } catch (error) {
    throw error;
  }
};

export const addItemToBin = async (id: number, item_id: number) => {
  try {
    let bin = await prisma.bin.update({
      where: { id: id },
      data: {
        items: {
          connect: {
            id: item_id,
          },
        },
      },
      select: DEFAULT_SELECT,
    });
    return bin;
  } catch (error) {
    throw error;
  }
};


// addItemToBin will automatically connect the new bin and disconnect the old one, this is called to remove the bin only if we are not putting the item in another bin
export const removeItemFromBin = async (id: number, item_id: number) => { 
  try {
    let bin = await prisma.bin.update({
      where: { id: id },
      data: {
        items: {
          disconnect: {
            id: item_id,
          },
        },
      },
      select: DEFAULT_SELECT,
    });
    return bin;
  } catch (error) {
    throw error;
  }
};

export const updateBinFields = async (id: number, updates: { field: string; value: any }[]) => {
  try {
    // Convert the updates array into an object for Prisma
    const data: Record<string, any> = {};
    updates.forEach(({ field, value }) => {
      data[field] = value;
    });

    // Validate that all fields are valid
    const invalidFields = Object.keys(data).filter((field) => !BinFieldTypes[field]);
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
    }

    // Perform the update
    const bin = await prisma.bin.update({
      where: { id },
      data,
      select: DEFAULT_SELECT,
    });

    return bin;
  } catch (error) {
    throw error;
  }
};
