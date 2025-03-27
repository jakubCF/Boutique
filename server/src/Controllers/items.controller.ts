import { prisma } from "../db/prisma";

const DEFAULT_SELECT = {
    id: true, 
    name: true, 
    bin_id: true, 
    bin: true,
    sold: true
}

export const getItems = async () => {   
    try {
        let items = await prisma.item.findMany({ select: DEFAULT_SELECT });
        return items;
    } catch (error) {
        throw error;
    }
}

export const getItemById = async (id: number) => {  
    try {
        let item = await prisma.item.findFirst({
            where: { id: id },
            select: DEFAULT_SELECT
        })
        return item;
    }
    catch(error) {
        throw error
    } 
}

export const createItem = async (name: string) => {
    try {
        let item = await prisma.item.create({
            data: {
                name: name
            },
            select: DEFAULT_SELECT
        })
        return item;
    } catch (error) {
        throw error;
    }
}
export const deleteItem = async (id: number) => {
    console.log(id);
    try {
        let bin = await prisma.item.delete({
            where: { id: id },
            select: DEFAULT_SELECT
        })
        return true;
    } 
    catch (error) {
        throw error;
    }

}

export const updateItemName = async (id: number, name: string) => {
    try {
        let item = await prisma.item.update({
            where: { id: id },
            data: { name: name },
            select: DEFAULT_SELECT
        })
        return item;
    } catch (error) {
        throw error;
    }
}

export const updateItemSold = async (id: number, sold: 1 | 0) => {
    let validation: boolean;
    switch(sold) {
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
            select: DEFAULT_SELECT
        })
        return item;
    } catch (error) {
        throw error;
    }
}