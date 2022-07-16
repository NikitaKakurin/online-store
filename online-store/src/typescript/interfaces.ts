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

export interface IAllActiveFilters {
    [x: string]: FormDataEntryValue;
}

interface INouisliderValues {
    [valueName: string]: string;
}