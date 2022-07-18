import { IBasketProducts } from '../typescript/interfaces';
class Basket {
    container: HTMLElement;
    count: HTMLElement;
    price: HTMLElement;
    totalPrice: number;
    totalCount: number;
    allProductsInBasket: IBasketProducts;
    constructor(className: string) {
        this.totalCount = 0;
        this.totalPrice = 0;
        this.allProductsInBasket = {};
        if (!document.querySelector(className)) throw new Error('there is no basket');
        this.container = document.querySelector(className) as HTMLElement;

        if (!this.container.querySelector('.basket__count')) throw new Error('there is no .basket__count');
        this.count = this.container.querySelector('.basket__count') as HTMLElement;

        if (!this.container.querySelector('.basket__total_price')) throw new Error('there is no .basket__count');
        this.price = this.container.querySelector('.basket__total_price') as HTMLElement;
    }

    getProducts() {
        return this.allProductsInBasket;
    }

    changeProduct(name: string, count: number, price: number) {
        this.allProductsInBasket[name] = {
            count: count,
            totalPrice: price * count,
        };
        this.calcTotal();
    }

    calcTotal() {
        this.totalPrice = 0;
        this.totalCount = 0;
        Object.values(this.allProductsInBasket).forEach((obj) => {
            this.totalPrice += obj.totalPrice;
            this.totalCount += obj.count;
        });
        this.count.textContent = this.totalCount.toString();
        this.price.textContent = `${this.totalPrice}$`;
    }
}

export default Basket;
