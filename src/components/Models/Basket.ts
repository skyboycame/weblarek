import { IProduct } from "../../types";

export class Basket {

  private productsBasket : IProduct[];
  
  constructor(productsBasket: IProduct[] = []) {
  
    this.productsBasket = productsBasket
  }

  getBasketProducts():IProduct[] {
    return this.productsBasket
  }

  addToBasketProducts(product: IProduct): void {
    this.productsBasket.push(product)
  }

  deleteFromBasketProducts(product: IProduct): void {
    const index = this.productsBasket.indexOf(product)
    this.productsBasket.splice(index,1)
  }

  deleteEverythingFromBasket(): void {
    this.productsBasket.length = 0
  }

  sumOfBasketProduct(): number  {
    return this.productsBasket.reduce((sum, el) => {
      sum += el.price ?? 0
      return sum
    }, 0)
  }
  quantityBasketProducts(): number {
    return this.productsBasket.length
  }
   
   getOneBasketProduct(id: string): IProduct | undefined {
    return this.productsBasket.find(product => product.id === id)
  }
  
   hasProduct(id: string): boolean {
    return this.productsBasket.some(product => product.id === id);
  }




}
