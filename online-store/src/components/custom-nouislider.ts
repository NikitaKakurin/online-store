import { TargetElement, Formatter } from '../typescript/nouislider';
import noUiSlider from 'nouislider';

class CustomNouislider {
    id: string;
    min: number;
    max: number;
    tooltipsIdPart: string;
    formatSlider: TargetElement;
    constructor(id: string, min: number, max: number, tooltipsIdPart: string) {
        this.id = id;
        this.min = min;
        this.max = max;
        this.formatSlider = document.getElementById(this.id) as TargetElement;
        this.tooltipsIdPart = tooltipsIdPart;
        this.initSlider();
    }

    initSlider = (): void => {
        if (this.formatSlider === null) throw new Error('no format slider');

        const formatForSlider: Formatter = {
            from: function (formattedValue: string) {
                return Math.round(Number(formattedValue));
            },
            to: function (numericValue: number) {
                return Math.round(numericValue);
            },
        };
        noUiSlider.create(this.formatSlider, {
            start: ['20.0', '80.0'],
            connect: true,
            range: {
                min: this.min,
                max: this.max,
            },
            step: 1,
            format: formatForSlider,
        });

        if (this.formatSlider.noUiSlider === undefined) throw new Error('formatSlider.noUiSlider - undefined');

        this.set(this.min, this.max);

        const startValues = document.getElementById(`filter__${this.tooltipsIdPart}_start`);
        const endValues = document.getElementById(`filter__${this.tooltipsIdPart}_end`);
        if (!startValues || !endValues) throw new Error('startValues or endValues is null');

        const formatValues = [startValues, endValues];
        const event = new Event('changeSliderForms');
        this.formatSlider.noUiSlider.on('update', function (values, handle) {
            formatValues[handle].innerHTML = values[handle].toString();
            document.dispatchEvent(event);
        });
    };

    set(min: number, max: number): void {
        if (this.formatSlider.noUiSlider === undefined) throw new Error('formatSlider.noUiSlider - undefined');
        this.formatSlider.noUiSlider.set([min, max]);
    }

    get() {
        if (this.formatSlider.noUiSlider === undefined) throw new Error('formatSlider.noUiSlider - undefined');
        return this.formatSlider.noUiSlider.get();
    }

    reset() {
        if (this.formatSlider.noUiSlider === undefined) throw new Error('formatSlider.noUiSlider - undefined');
        this.formatSlider.noUiSlider.set([this.min, this.max]);
    }
}

export default CustomNouislider;
