import CustomNouislider from './custom-nouislider';

class Form {
    form: HTMLFormElement;
    constructor(formId: string) {
        if (document.getElementById(formId) === null) throw new Error(`Element with id: ${formId} not exist`);
        this.form = document.getElementById(formId) as HTMLFormElement;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        return data;
    }

    resetCommonFilters() {
        this.form.reset();
    }
}

export class SearchForm extends Form {
    resetFilters() {
        this.resetCommonFilters();
    }

    getFilters() {
        const formData = this.getFormData();

        return {
            formData: formData,
        };
    }
}

export class FilterForm extends Form {
    filtersWrappers: HTMLElement[];
    ageSlider: CustomNouislider;
    amountSlider: CustomNouislider;
    constructor(formId: string) {
        super(formId);
        this.filtersWrappers = Array.from(this.form.getElementsByClassName('filters__wrapper')) as HTMLElement[];
        this.ageSlider = new CustomNouislider('filter__age', 1980, 2022, 'age');
        this.amountSlider = new CustomNouislider('filter__amount', 0, 100, 'amount');

        this.initListeners();
    }

    initListeners() {
        this.form.addEventListener('click', this.changeCategory.bind(this));
    }

    changeCategory(e: Event) {
        const target = e.target as HTMLElement | null;
        if (target === null) return;
        if (target.classList.contains('filters__category-active')) {
            target.classList.remove('filters__category-active');
            this.changeWrapper(target.dataset.category, 'remove');
            return;
        }
        target.classList.add('filters__category-active');
        this.changeWrapper(target.dataset.category, 'add');
    }

    changeWrapper(category: string | undefined, command: string) {
        if (!category) return;
        this.filtersWrappers.forEach((element) => {
            if (element.dataset.category === category) {
                if (command === 'add') {
                    element.classList.add('filters__wrapper-active');
                    return;
                }
                element.classList.remove('filters__wrapper-active');
            }
        });
    }

    resetFilters() {
        this.resetCommonFilters();
        this.ageSlider.reset();
        this.amountSlider.reset();
    }

    getFilters() {
        const getNouisliderData = (slider: CustomNouislider, keyPart: string) => {
            interface INouisliderValues {
                [valueName: string]: string;
            }
            const age = <INouisliderValues>{};
            [age[`min${keyPart}`], age[`max${keyPart}`]] = slider.get() as [string, string];
            return age;
        };

        const formData = this.getFormData();
        const ageValues = getNouisliderData(this.ageSlider, 'Age');
        const amountValues = getNouisliderData(this.amountSlider, 'Amount');
        return {
            formData: formData,
            ageSlider: ageValues,
            amountSlider: amountValues,
        };
    }
}
