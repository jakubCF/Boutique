import { prisma } from "../db/prisma";

const DEFAULT_SELECT = {
    id: true, 
    name: true, 
    bin_id: true, 
    bin: true
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

export const createItem = async (name: string, bin_id: number) => {
    try {
        let item = await prisma.item.create({
            data: {
                name: name,
                bin_id: bin_id
            },
            select: DEFAULT_SELECT
        })
        return item;
    } catch (error) {
        throw error;
    }
}
export const deleteItem = async (id: number) => {
    try {
        await prisma.item.delete({
            where: { id: id },
            select: DEFAULT_SELECT
        }).then(() => { 
            return true;
        })
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