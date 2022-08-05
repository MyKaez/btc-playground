export interface Column<T> {
    name: string;
    mapFunc: (item: T) => any;
    length: number;
}