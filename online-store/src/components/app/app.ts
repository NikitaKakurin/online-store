import AppController from '../controller/controller';
import AppView from '../view/appView';
import type { IData } from '../../typescript/interfaces';

class App {
    controller: AppController;
    private view: AppView;
    constructor() {
        this.controller = new AppController('form-search', 'form-filter');
        this.view = new AppView();
    }

    start(): void {
        const searchF = document.getElementById('form-search');
        const filterF = document.getElementById('form-filter');
        if (!searchF || !filterF) throw new Error('there is no such forms');
        const searchForm = searchF as HTMLFormElement;
        const filterForm = filterF as HTMLFormElement;
        const searchField = document.getElementById('search');
        if (!searchField) throw new Error('there is no search field');
        const search = searchField as HTMLInputElement;

        const handleChangeForms = () => {
            this.controller.handleChangeForms();
        };

        searchForm.addEventListener('reset', () => {
            this.controller.resetFilters();
        });

        [searchForm, filterForm].forEach((form) => {
            form.addEventListener('change', handleChangeForms);
        });

        search.addEventListener('input', handleChangeForms);

        document.addEventListener('changeSliderForms', handleChangeForms);


        // this.controller.applyFilters((data?: IData) => this.view.drawCards(data));
        // showSources.addEventListener('click', () => {
        //     this.view.hideShowSources();
        // });

        // [searchForm, filterForm].forEach((form) => {
        //     form.addEventListener('change', (e: Event) => {
        //         // this.controller.getCards(e, (data?: IData) => this.view.drawCards(data))
        //         const filterFormData = new FormData(filterForm);
        //         const filterData = Object.fromEntries(filterFormData.entries());
        //         const searchFormData = new FormData(searchForm);
        //         const searchData = Object.fromEntries(searchFormData.entries());

        //         console.log(searchData);
        //         console.log(filterData);
        //     });
        // });

        // document.addEventListener('click', (e: Event) => {
        //     // this.controller.getCards(e, (data?: IData) => this.view.drawCards(data))
        //     const target = e.target as HTMLElement;
        //     if(target.classList.contains(filters__category))
        // });

        // filterFieldset.addEventListener('click', (e: Event) =>
        //     this.controller.handleClickOnFieldset(e, (data?: IData) => this.view.drawCards(data))
        // );
    }
}

export default App;
