export type Item = {
    id: number;
    name: string;
    binId: number;
    bin: {
        id: number,
        name: string,
        is_full: boolean
    };
    sold: boolean;
    web_url: string;
}
