import { IBasketProducts, IDataItem } from '../typescript/interfaces';

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

importAll(require.context('../assets/img', true, /\.(png|jpeg|jpg|svg)$/));

class ProductCard {
    cardData: IDataItem;
    cardClone: HTMLElement;
    card: HTMLElement | null;
    cardImage: HTMLImageElement | null;
    cardNameBrand: HTMLElement | null;
    cardNameModel: HTMLElement | null;
    cardBrand: HTMLElement | null;
    cardModel: HTMLElement | null;
    cardType: HTMLElement | null;
    cardYear: HTMLElement | null;
    cardVoltage: HTMLElement | null;
    cardAmount: HTMLElement | null;
    cardPrice: HTMLElement | null;
    cardBasket: HTMLElement | null;
    cardPopular: HTMLElement | null;
    buttonPlus: HTMLElement | null;
    buttonMinus: HTMLElement | null;
    basketCount: number;
    basketData: IBasketProducts | undefined;

    constructor(cardData: IDataItem, cardTemplate: HTMLTemplateElement, basketData?: IBasketProducts) {
        this.cardData = cardData;
        this.basketCount = 0;
        this.basketData = basketData;

        this.cardClone = cardTemplate.content.cloneNode(true) as HTMLElement;

        this.card = this.cardClone.querySelector('.product_card');
        if (!this.card) throw new Error('card is null');

        this.cardImage = this.cardClone.querySelector('.product-card__image');
        if (!this.cardImage) throw new Error('this.cardImage is null');
        this.cardImage.alt = `${this.cardData.brand} ${this.cardData.model}`;
        this.cardImage.src = allProductImgSrc[this.getSrc(this.cardData.brand, this.cardData.model)];

        this.cardNameBrand = this.cardClone.querySelector('.product_card__name-brand');
        if (!this.cardNameBrand) throw new Error('this.cardNameBrand is null');
        this.cardNameBrand.textContent = this.cardData.brand;

        this.cardNameModel = this.cardClone.querySelector('.product_card__name-model');
        if (!this.cardNameModel) throw new Error('this.cardNameModel is null');
        this.cardNameModel.textContent = this.cardData.model;

        this.cardBrand = this.cardClone.querySelector('.product_card__brand-value');
        if (!this.cardBrand) throw new Error('this.cardBrand is null');
        this.cardBrand.textContent = this.cardData.brand;

        this.cardModel = this.cardClone.querySelector('.product_card__model-value');
        if (!this.cardModel) throw new Error('this.cardModel is null');
        this.cardModel.textContent = this.cardData.model;

        this.cardType = this.cardClone.querySelector('.product_card__type-value');
        if (!this.cardType) throw new Error('this.cardType is null');
        this.cardType.textContent = this.cardData.type;

        this.cardYear = this.cardClone.querySelector('.product_card__year-value');
        if (!this.cardYear) throw new Error('this.cardYear is null');
        this.cardYear.textContent = this.cardData.year;

        this.cardVoltage = this.cardClone.querySelector('.product_card__voltage-value');
        if (!this.cardVoltage) throw new Error('this.cardVoltage is null');
        this.cardVoltage.textContent = this.cardData.voltage;

        this.cardAmount = this.cardClone.querySelector('.product_card__amount-value');
        if (!this.cardAmount) throw new Error('this.cardAmount is null');
        this.cardAmount.textContent = this.cardData.amount;

        this.cardPrice = this.cardClone.querySelector('.product_card__price-value');
        if (!this.cardPrice) throw new Error('this.cardPrice is null');
        this.cardPrice.textContent = this.cardData.price;

        this.cardBasket = this.cardClone.querySelector('.product_card__basket-value');
        if (!this.cardBasket) throw new Error('this.cardBasket is null');
        if (basketData) {
            this.cardBasket.textContent =
                basketData[`${this.cardData.brand}-${this.cardData.model}`]?.count.toString() || '0';
        } else {
            this.cardBasket.textContent = '0';
        }

        this.cardPopular = this.cardClone.querySelector('.product_card__popular-value');
        if (!this.cardPopular) throw new Error('this.cardPopular is null');
        this.cardPopular.textContent = this.cardData.popularity >= 8.5 ? 'да' : 'нет';

        this.buttonPlus = this.cardClone.querySelector('.product_card__add');
        if (!this.buttonPlus) throw new Error('this.buttonPlus is null');

        this.buttonMinus = this.cardClone.querySelector('.product_card__delete');
        if (!this.buttonMinus) throw new Error('this.buttonMinus is null');
    }

    getSrc(brand: string, model: string) {
        const brandToLower = brand.toLowerCase();
        const modelToLower = model.toLowerCase();
        if (brandToLower !== 'овен') return `${brandToLower}-${modelToLower}`;

        const brandName = brandToLower === 'овен' ? 'oven' : brandToLower;
        const modelName = modelToLower.replace('плк', 'plc');
        if (modelName.startsWith('пчв1')) return 'oven-pchv1';
        if (modelName.startsWith('пчв3')) return 'oven-pchv3';
        return `${brandName}-${modelName}`;
    }

    get() {
        return this.cardClone;
    }
}

export default ProductCard;
