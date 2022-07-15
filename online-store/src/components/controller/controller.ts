import { SearchForm, FilterForm } from '../forms';
import { IData } from '../../typescript/interfaces';
import data from '../data/data';
class AppController {
    searchForm: SearchForm;
    filterForm: FilterForm;
    data: IData;

    constructor(searchFormId: string, filterFormId: string) {
        this.searchForm = new SearchForm(searchFormId);
        this.filterForm = new FilterForm(filterFormId);
        this.data = data;
    }

    resetFilters() {
        this.filterForm.resetFilters();
        return data;
    }

    handleChangeForms() {
        const allActiveFilters = this.getAllActiveFilters();
        console.log(allActiveFilters);
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
