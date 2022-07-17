import { DataType, IDataItem } from '../../typescript/interfaces';

function getNames(key: string) {
    const lastSlashIndex = key.lastIndexOf('/');
    const lastDotIndex = key.lastIndexOf('.');
    const nameWithExt = key.slice(lastSlashIndex + 1);
    const name = key.slice(lastSlashIndex + 1, lastDotIndex);
    return [name, nameWithExt];
}
const allProductImgSrc: Record<string, string> = {};
function importAll(r: __WebpackModuleApi.RequireContext) {
    r.keys().forEach((key: string) => {
        const [name, nameWithExt]: string[] = getNames(key);
        allProductImgSrc[name] = `./assets/${nameWithExt}`;
    });
}

importAll(require.context('../../assets/img', true, /\.(png|jpeg|jpg|svg)$/));

class AppView {
    drawCards(sortedData: DataType) {
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

        function getSrc(brand: string, model: string) {
            const brandToLower = brand.toLowerCase();
            const modelToLower = model.toLowerCase();
            if (brandToLower !== 'овен') return `${brandToLower}-${modelToLower}`;

            const brandName = brandToLower === 'овен' ? 'oven' : brandToLower;
            const modelName = modelToLower.replace('плк', 'plc');
            if (modelName.startsWith('пчв1')) return 'oven-pchv1';
            if (modelName.startsWith('пчв3')) return 'oven-pchv3';
            return `${brandName}-${modelName}`;
        }

        const fragment: DocumentFragment = document.createDocumentFragment();
        const cardTemplate = document.getElementById('template-card') as HTMLTemplateElement;

        data.forEach((item: IDataItem): void => {
            const newsClone = cardTemplate.content.cloneNode(true) as HTMLElement;

            const card: HTMLLinkElement | null = newsClone.querySelector('.product_card');
            if (!card) throw new Error('card is null');

            const cardImage: HTMLImageElement | null = newsClone.querySelector('.product-card__image');
            if (!cardImage) throw new Error('cardImage is null');
            cardImage.alt = `${item.brand} ${item.model}`;
            cardImage.src = allProductImgSrc[getSrc(item.brand, item.model)] || getSrc(item.brand, item.model);

            const cardNameBrand: HTMLElement | null = newsClone.querySelector('.product_card__name-brand');
            if (!cardNameBrand) throw new Error('cardNameBrand is null');
            cardNameBrand.textContent = item.brand;

            const cardNameModel: HTMLElement | null = newsClone.querySelector('.product_card__name-model');
            if (!cardNameModel) throw new Error('cardNameModel is null');
            cardNameModel.textContent = item.model;

            const cardBrand: HTMLElement | null = newsClone.querySelector('.product_card__brand-value');
            if (!cardBrand) throw new Error('cardBrand is null');
            cardBrand.textContent = item.brand;

            const cardModel: HTMLElement | null = newsClone.querySelector('.product_card__model-value');
            if (!cardModel) throw new Error('cardModel is null');
            cardModel.textContent = item.model;

            const cardType: HTMLElement | null = newsClone.querySelector('.product_card__type-value');
            if (!cardType) throw new Error('cardType is null');
            cardType.textContent = item.type;

            const cardYear: HTMLElement | null = newsClone.querySelector('.product_card__year-value');
            if (!cardYear) throw new Error('cardYear is null');
            cardYear.textContent = item.year;

            const cardVoltage: HTMLElement | null = newsClone.querySelector('.product_card__voltage-value');
            if (!cardVoltage) throw new Error('cardVoltage is null');
            cardVoltage.textContent = item.voltage;

            const cardAmount: HTMLElement | null = newsClone.querySelector('.product_card__amount-value');
            if (!cardAmount) throw new Error('cardAmount is null');
            cardAmount.textContent = item.amount;

            const cardPrice: HTMLElement | null = newsClone.querySelector('.product_card__price-value');
            if (!cardPrice) throw new Error('cardPrice is null');
            cardPrice.textContent = item.price;

            const cardBasket: HTMLElement | null = newsClone.querySelector('.product_card__basket-value');
            if (!cardBasket) throw new Error('cardBasket is null');
            cardBasket.textContent = '0';

            const cardPopular: HTMLElement | null = newsClone.querySelector('.product_card__popular-value');
            if (!cardPopular) throw new Error('cardPopular is null');
            cardPopular.textContent = item.popularity >= 8.5 ? 'да' : 'нет';

            fragment.append(newsClone);
        });

        article.innerHTML = '';
        article.appendChild(fragment);
    }
}

export default AppView;
