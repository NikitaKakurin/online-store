import { SearchForm, FilterForm } from '../forms';
import { SortedDataType, IDataItem, IAllActiveFilters, IBasketProducts } from '../../typescript/interfaces';
import data from '../data/data';
import Basket from '../basket';
class AppController {
    searchForm: SearchForm;
    filterForm: FilterForm;
    basket: Basket;
    data: SortedDataType;
    allFilters: (HTMLInputElement | HTMLSelectElement)[];
    isDrawDeactivate: boolean;
    basketCount: number;
    constructor(searchFormId: string, filterFormId: string, basketClass: string) {
        this.searchForm = new SearchForm(searchFormId);
        this.filterForm = new FilterForm(filterFormId);
        this.basket = new Basket(basketClass);
        this.data = data;
        this.allFilters = [
            ...this.filterForm.form.getElementsByTagName('input'),
            ...this.searchForm.form.getElementsByTagName('input'),
            ...this.searchForm.form.getElementsByTagName('select'),
        ];
        this.isDrawDeactivate = false;
        this.basketCount = 0;
    }

    resetFilters(callback: (data: SortedDataType) => void) {
        this.isDrawDeactivate = true;
        this.filterForm.resetFilters();
        this.isDrawDeactivate = false;
        callback(data);
    }

    handleChangeForms(
        callback: (sortedData: SortedDataType, basketData?: IBasketProducts) => void,
        basketData?: IBasketProducts
    ) {
        if (this.isDrawDeactivate) return;
        const allActiveFilters: IAllActiveFilters = this.getAllActiveFilters();
        const filteredData = this.getFilterData(allActiveFilters);
        const sortedData = this.sortFilterData(filteredData, allActiveFilters.sort);
        callback(sortedData, basketData);
    }

    handleClick(e: Event) {
        if (e.target === null) return;
        const target = e.target as HTMLElement;

        if (target.closest('.product_card__add')) {
            const card = getCard(target);
            const cardMessage = getCardElem(card, '.product_card__message');

            if (this.basketCount + 1 > 20) {
                cardMessage.textContent = 'Извините, все слоты заполнены';
                return;
            }

            this.basketCount++;
            const [cardBasket, cardPrice, cardBrand, cardModel] = getElements(card);

            const cardName = `${cardBrand.textContent || ''}-${cardModel.textContent || ''}`;

            cardBasket.textContent = cardBasket.textContent ? `${+cardBasket.textContent + 1}` : '1';

            cardPrice.textContent = cardPrice.textContent || '';

            this.basket.changeProduct(cardName, +cardBasket.textContent, +cardPrice.textContent.slice(0, -1));
            return;
        }

        if (target.closest('.product_card__delete')) {
            const card = getCard(target);
            const cardMessage = getCardElem(card, '.product_card__message');
            cardMessage.textContent = '';
            const [cardBasket, cardPrice, cardBrand, cardModel] = getElements(card);

            if (cardBasket.textContent === '0') return;

            this.basketCount = this.basketCount - 1 < 0 ? 0 : this.basketCount - 1;

            const cardName = `${cardBrand.textContent || ''}-${cardModel.textContent || ''}`;

            cardBasket.textContent = cardBasket.textContent || '0';
            cardBasket.textContent = +cardBasket.textContent - 1 >= 0 ? `${+cardBasket.textContent - 1}` : '0';

            this.basket.changeProduct(cardName, +cardBasket.textContent, +(cardPrice.textContent || '0$').slice(0, -1));
            return;
        }

        function getCardElem(card: HTMLElement, className: string) {
            const elem = card.querySelector(className);
            if (!elem) throw new Error(`There is no ${className}`);
            return elem as HTMLElement;
        }

        function getCard(target: HTMLElement) {
            if (!target.closest('.product_card')) throw new Error('there is no .product_card');
            return target.closest('.product_card') as HTMLElement;
        }

        function getElements(card: HTMLElement) {
            const cardBasket = getCardElem(card, '.product_card__basket-value');
            const cardBrand = getCardElem(card, '.product_card__brand-value');
            const cardModel = getCardElem(card, '.product_card__model-value');
            const cardPrice = getCardElem(card, '.product_card__price-value');
            return [cardBasket, cardPrice, cardBrand, cardModel];
        }
    }

    sortFilterData(data: SortedDataType, sort: string) {
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
                const subStrToLower = allActiveFilters.search.toLowerCase();
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
        return allActiveFilters as IAllActiveFilters;
    }

    initLoad(callback: (sortedData: SortedDataType) => void) {
        this.isDrawDeactivate = true;
        this.setFilters();
        const allProductsInBasket = localStorage.getItem('allProductsInBasket');
        if (allProductsInBasket) {
            this.basket.allProductsInBasket = JSON.parse(allProductsInBasket) as IBasketProducts;
            this.basket.calcTotal();
        }

        this.isDrawDeactivate = false;
        this.handleChangeForms(callback, this.basket.allProductsInBasket);
    }

    setFilters() {
        const stringActiveFilters = localStorage.getItem('allActiveFilters');
        if (!stringActiveFilters) return;
        const activeFilters = JSON.parse(stringActiveFilters) as IAllActiveFilters;

        this.allFilters.forEach((input) => {
            if (!activeFilters[input.name]) {
                return;
            }
            if (input.type === 'checkbox') {
                (input as HTMLInputElement).checked = true;
                return;
            }
            input.value = activeFilters[input.name];
        });

        this.filterForm.ageSlider.set(+activeFilters.minAge, +activeFilters.maxAge);
        this.filterForm.amountSlider.set(+activeFilters.minAmount, +activeFilters.maxAmount);
    }
}
export default AppController;
