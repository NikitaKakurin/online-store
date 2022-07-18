import AppController from '../controller/controller';
import AppView from '../view/appView';
import type { DataType, IAllActiveFilters } from '../../typescript/interfaces';

class App {
    private controller: AppController;
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

        const drawCards = (data: DataType) => {
            this.view.drawCards(data);
        };

        const handleChangeForms = () => {
            this.controller.handleChangeForms(drawCards);
        };

        const initLoadCards = () => {
            this.controller.initLoad(drawCards);
        };

        initLoadCards();

        searchForm.addEventListener('reset', () => {
            this.controller.resetFilters(drawCards);
        });

        [searchForm, filterForm].forEach((form) => {
            form.addEventListener('change', handleChangeForms);
        });

        search.addEventListener('input', handleChangeForms);

        document.addEventListener('changeSliderForms', handleChangeForms);

        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            const allActiveFilters = this.controller.getAllActiveFilters();
            localStorage.setItem('allActiveFilters', JSON.stringify(allActiveFilters));
        });
    }
}

export default App;
