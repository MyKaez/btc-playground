
export interface ApiBlock {
    data: Block;
}

export interface Block {
    height: number,
    hash: string;
    difficulty: number;
}