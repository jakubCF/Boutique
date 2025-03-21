import { prisma } from "../db/prisma";

export const getBins = async () => {
    try {
        let bins = await prisma.bin.findMany({
            select: {
                id: true,
                is_full: true,
                name: true,
                items: true
            }
        });
        return bins;
    } catch (error) {
        throw error;
    }
}

export const getBin = async (id: number) => {
    try {
        let bin = await prisma.bin.findFirst({
            where: { id: id },
            select: {
                items: true,
                id: true,
                is_full: true,
                name: true
            }
        })
        
        return bin;
    }
    catch(error) {
        throw error
    } 
}