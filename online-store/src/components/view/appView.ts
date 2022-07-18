import { DataType, IDataItem, IBasketProducts } from '../../typescript/interfaces';
import ProductCard from '../card';

class AppView {
    drawCards(sortedData: DataType, basketData?: IBasketProducts) {
        const article = document.querySelector('.article__wrapper') as HTMLElement;
        const data = sortedData;
        if (!data.length) {
            const title = document.createElement('h3');
            title.innerText = 'Извините, совпадений не обнаружено';
            title.classList.add('empty-message');
            article.innerHTML = '';
            article.append(title);
            return;
        }

        const fragment: DocumentFragment = document.createDocumentFragment();
        const cardTemplate = document.getElementById('template-card') as HTMLTemplateElement;

        data.forEach((item: IDataItem): void => {
            const card = new ProductCard(item, cardTemplate, basketData);
            fragment.append(card.get());
        });

        article.innerHTML = '';
        article.appendChild(fragment);
    }
}

export default AppView;
