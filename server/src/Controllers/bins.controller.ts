import { prisma } from "../db/prisma";

export const getBins = async () => {
    let bins = await prisma.bin.findMany({ select: {
        id: true,
        is_full: true,
        items: true, 
        name: true
    }})

    return bins;
}

export const getBin = async (id: number) => {

}