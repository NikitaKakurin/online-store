import { SearchForm, FilterForm } from '../forms';
import { DataType, IDataItem, IAllActiveFilters } from '../../typescript/interfaces';
import data from '../data/data';
class AppController {
    searchForm: SearchForm;
    filterForm: FilterForm;
    data: DataType | [];

    constructor(searchFormId: string, filterFormId: string) {
        this.searchForm = new SearchForm(searchFormId);
        this.filterForm = new FilterForm(filterFormId);
        this.data = data;
    }

    resetFilters() {
        this.filterForm.resetFilters();
        return data;
    }

    // 12VAC: "on"+
    // 12VDC: "on"+
    // 24VAC: "on"+
    // 24VDC: "on"+
    // 220VAC: "on"+
    // 220VDC: "on"+
    // 380VAC: "on"+
    // abb: "on"+
    // delta: "on"+
    // fc: "on"+
    // maxAge: 2007
    // maxAmount: 72
    // minAge: 1987
    // minAmount: 19
    // oven: "on"+
    // plc: "on"+
    // popular: "on"+
    // schneider: "on"+
    // search: "hgfg"+
    // siemens: "on"+
    // sort: "name-up"

    handleChangeForms() {
        const allActiveFilters: IAllActiveFilters = this.getAllActiveFilters();
        const filteredData = this.getFilterData(allActiveFilters);
        const sortedData = this.sortFilterData(filteredData, allActiveFilters.sort as string);
        console.log(sortedData);
        return sortedData;
    }

    sortFilterData(data: DataType | [], sort: string) {
        if (!data.length || !sort) {
            return data;
        }
        switch (sort) {
            case 'name-up':
                data.sort((a, b) => {
                    const nameA = `${a.brand} ${a.model}`;
                    const nameB = `${b.brand} ${b.model}`;
                    return nameA > nameB ? 1 : -1;
                });
                break;
            case 'name-down':
                data.sort((a, b) => {
                    const nameA = `${a.brand} ${a.model}`;
                    const nameB = `${b.brand} ${b.model}`;
                    return nameA > nameB ? -1 : 1;
                });
                break;
            case 'year-up':
                data.sort((a, b) => {
                    return Number(a.year) - Number(b.year);
                });
                break;
            case 'year-down':
                data.sort((a, b) => {
                    return Number(b.year) - Number(a.year);
                });
                break;
        }
        return data;
    }

    getFilterData(allActiveFilters: IAllActiveFilters) {
        this.data = data;
        const allKeys = Object.keys(allActiveFilters);

        const filterBySliders = (minKey: string, maxKey: string, prop: string) => {
            const min = +allActiveFilters[minKey];
            const max = +allActiveFilters[maxKey];
            const cardProp = +prop;
            return min <= cardProp && cardProp <= max;
        };

        const checkVoltage = () => {
            const allVoltages = ['12VAC', '24VAC', '220VAC', '380VAC', '12VDC', '24VDC', '220VDC', '380VDC'];
            if (!allVoltages.some((voltage) => allActiveFilters[voltage])) return this.data;

            return this.data.filter((card: IDataItem) => {
                return allActiveFilters[card.voltage];
            });
        };

        const checkBrand = () => {
            const allBrand = ['siemens', 'delta', 'schneider', 'abb', 'oven'];
            if (!allBrand.some((brand) => allActiveFilters[brand])) return this.data;

            return this.data.filter((card: IDataItem) => {
                const brand = card.brand.toLowerCase() === 'овен' ? 'oven' : card.brand.toLowerCase();
                return allKeys.some((key) => key.toLowerCase() === brand);
            });
        };

        const checkType = () => {
            const allType = ['plc', 'fc'];
            if (!allType.some((brand) => allActiveFilters[brand])) return this.data;

            return this.data.filter((card: IDataItem) => {
                const type = card.type.toLowerCase() === 'controller' ? 'plc' : card.type.toLowerCase();
                return allKeys.some((key) => key.toLowerCase() === type);
            });
        };

        const checkYear = () => {
            return this.data.filter((card: IDataItem) => {
                const res = filterBySliders('minAge', 'maxAge', card.year);
                return res;
            });
        };

        const checkAmount = () => {
            return this.data.filter((card: IDataItem) => {
                const res = filterBySliders('minAmount', 'maxAmount', card.amount);
                return res;
            });
        };

        const checkSearch = () => {
            if (!allActiveFilters.search) return this.data;

            return this.data.filter((card: IDataItem) => {
                const subStrToLower = (allActiveFilters.search as string).toLowerCase();
                const brand = card.brand.toLowerCase();
                const model = card.model.toLowerCase();
                return brand.includes(subStrToLower) || model.includes(subStrToLower);
            });
        };

        this.data = checkVoltage();
        this.data = checkBrand();
        this.data = checkType();
        this.data = checkYear();
        this.data = checkAmount();
        this.data = checkSearch();

        //     Object.keys(allActiveFilters).forEach((filterKey: string) => {
        //         switch (filterKey) {
        //             case '12VAC':
        //             case '24VAC':
        //             case '220VAC':
        //             case '380VAC':
        //             case '12VDC':
        //             case '24VDC':
        //             case '220VDC':
        //             case '380VDC':
        //                 this.data = this.data.filter((card: IDataItem) => {
        //                     return filterKey.toLowerCase() === card.voltage.toLowerCase();
        //                 });
        //                 break;
        //             case 'delta':
        //             case 'siemens':
        //             case 'schneider':
        //             case 'sbb':
        //             case 'sven':
        //                 this.data = this.data.filter((card: IDataItem) => {
        //                     const filterKeyToLower = filterKey.toLowerCase();
        //                     const key = filterKeyToLower === 'oven' ? 'овен' : filterKeyToLower;
        //                     return key === card.brand.toLowerCase();
        //                 });
        //                 break;
        //             case 'plc':
        //             case 'fc':
        //                 this.data = this.data.filter((card: IDataItem) => {
        //                     const filterKeyToLower = filterKey.toLowerCase();
        //                     const key = filterKeyToLower === 'plc' ? 'controller' : filterKeyToLower;
        //                     return key === card.brand.toLowerCase();
        //                 });
        //                 break;
        //             case 'minAge':
        //                 this.data = this.data.filter((card: IDataItem) => {
        //                     return filterBySliders('minAge', 'maxAge', card.year);
        //                 });
        //                 break;
        //             case 'minAmount':
        //                 this.data = this.data.filter((card: IDataItem) => {
        //                     return filterBySliders('minAmount', 'maxAmount', card.amount);
        //                 });
        //                 break;
        //             case 'search':
        //                 this.data = this.data.filter((card: IDataItem) => {
        //                     const subStrToLower = (allActiveFilters.search as string).toLowerCase();
        //                     const brand = card.brand.toLowerCase();
        //                     const model = card.model.toLowerCase();
        //                     return brand.includes(subStrToLower) || model.includes(subStrToLower);
        //                 });
        //                 break;
        //         }
        //     });
        return this.data;
    }

    getAllActiveFilters() {
        const searchFormFilters = this.searchForm.getFilters();
        const filterFormFilters = this.filterForm.getFilters();
        const allActiveFilters = {
            ...searchFormFilters.formData,
            ...filterFormFilters.formData,
            ...filterFormFilters.ageSlider,
            ...filterFormFilters.amountSlider,
        };
        return allActiveFilters;
    }
}
export default AppController;
