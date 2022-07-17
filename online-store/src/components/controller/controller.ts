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

    resetFilters(callback: (data: DataType | []) => void) {
        this.filterForm.resetFilters();
        callback(data);
    }

    handleChangeForms(callback: (sortedData: DataType | []) => void) {
        const allActiveFilters: IAllActiveFilters = this.getAllActiveFilters();
        const filteredData = this.getFilterData(allActiveFilters);
        const sortedData = this.sortFilterData(filteredData, allActiveFilters.sort as string);
        console.log(sortedData);
        callback(sortedData);
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

        const checkPopularity = () => {
            if (!allActiveFilters.popular) return this.data;
            return this.data.filter((card: IDataItem) => {
                return card.popularity >= 8.5;
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
        this.data = checkPopularity();
        this.data = checkSearch();
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
