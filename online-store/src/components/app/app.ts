import AppController from '../controller/controller';
import AppView from '../view/appView';
import type { DataType, IBasketProducts } from '../../typescript/interfaces';

class App {
    private controller: AppController;
    private view: AppView;
    constructor() {
        this.controller = new AppController('form-search', 'form-filter', '.basket-container');
        this.view = new AppView();
    }

    start(): void {
        const searchF = document.getElementById('form-search');
        const filterF = document.getElementById('form-filter');
        const searchField = document.getElementById('search');
        if (!searchF || !filterF) throw new Error('there is no such forms');
        const searchForm = searchF as HTMLFormElement;
        const filterForm = filterF as HTMLFormElement;
        if (!searchField) throw new Error('there is no search field');
        const search = searchField as HTMLInputElement;
        let isLocalMustSave = true;
        const drawCards = (data: DataType, basketData?: IBasketProducts) => {
            this.view.drawCards(data, basketData);
        };

        const handleChangeForms = () => {
            this.controller.handleChangeForms(drawCards);
        };

        const initLoadCards = () => {
            this.controller.initLoad(drawCards);
        };

        const handleSubmitForms = (e: SubmitEvent) => {
            e.preventDefault();
        };

        initLoadCards();

        searchForm.addEventListener('reset', () => {
            this.controller.resetFilters(drawCards);
        });

        [searchForm, filterForm].forEach((form) => {
            form.addEventListener('change', handleChangeForms);
        });

        [searchForm, filterForm].forEach((form) => {
            form.addEventListener('submit', handleSubmitForms);
        });

        search.addEventListener('input', handleChangeForms);

        document.addEventListener('changeSliderForms', handleChangeForms);

        document.addEventListener('click', (e: Event) => {
            if (e.target === null) return;
            const target = e.target as HTMLElement;
            if (target.id === 'reset-settings') {
                localStorage.clear();
                isLocalMustSave = false;
                return;
            }
            if (target.id === 'search-reset') {
                search.value = '';
                handleChangeForms();
                return;
            }
            this.controller.handleClick(e);
        });

        window.addEventListener('beforeunload', (event) => {
            if (!isLocalMustSave) return;
            event.preventDefault();
            const allActiveFilters = this.controller.getAllActiveFilters();
            localStorage.setItem('allActiveFilters', JSON.stringify(allActiveFilters));
            localStorage.setItem('allProductsInBasket', JSON.stringify(this.controller.basket.allProductsInBasket));
        });
    }
}

export default App;
