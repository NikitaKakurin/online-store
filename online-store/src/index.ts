import './style/style.scss';
import { TargetElement, Formatter } from './typescript/nouislider';
import noUiSlider from 'nouislider';

const formatSlider = document.getElementById('filter__age') as TargetElement;
if (formatSlider == null) throw new Error('no format slider');

const formatForSlider: Formatter = {
    from: function (formattedValue: string) {
        return Math.round(Number(formattedValue));
    },
    to: function (numericValue: number) {
        return Math.round(numericValue);
    },
};
noUiSlider.create(formatSlider, {
    start: ['20.0', '80.0'],
    connect: true,
    range: {
        min: 1980,
        max: 2022,
    },
    step: 1,
    format: formatForSlider,
});

if (formatSlider.noUiSlider === undefined) throw new Error('formatSlider.noUiSlider - undefined');

formatSlider.noUiSlider.set(['2000', '2021']);

const startValues = document.getElementById('filter__age_start');
const endValues = document.getElementById('filter__age_end');
if (!startValues || !endValues) throw new Error('startValues or endValues is null');
const formatValues = [startValues, endValues];

formatSlider.noUiSlider.on('update', function (values, handle) {
    formatValues[handle].innerHTML = values[handle].toString();
});
