interface Item {
    id: number;
    name: string;
    binId: number;
    bin: {
        id: number,
        name: string,
        is_full: boolean
    };
    sold: boolean;
}

export default Item;