export interface IDataItem {
    brand: string;
    model: string;
    year: string;
    type: string;
    price: string;
    amount: string;
    voltage: string;
    popularity: number;
}

export type DataType = IDataItem[];

export type SortedDataType = DataType | [];

export interface IAllActiveFilters {
    [x: string]: string;
}

export interface IBasketProductsProp {
    count: number;
    totalPrice: number;
}
export interface IBasketProducts {
    [productName: string]: IBasketProductsProp;
}
