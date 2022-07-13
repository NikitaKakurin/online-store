import './style/style.scss';
import CustomNouislider from './components/custom-nouislider';

const ageSlider = new CustomNouislider('filter__age', 1980, 2022, 'age');
const amountSlider = new CustomNouislider('filter__amount', 0, 100, 'amount');
