import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {

  private productsBasket : IProduct[];
  private events: IEvents
  
  constructor(events: IEvents, productsBasket: IProduct[] = []) {
    
    this.events = events
    this.productsBasket = productsBasket
  }

  getBasketProducts():IProduct[] {
    return this.productsBasket
  }

  addToBasketProducts(product: IProduct): void {
    this.productsBasket.push(product)
    this.events.emit('basket:changed', this.productsBasket)
  }

  deleteFromBasketProducts(product: IProduct): void {
    const index = this.productsBasket.indexOf(product)
    this.productsBasket.splice(index,1)
    this.events.emit('basket:changed', this.productsBasket)
  }

  deleteFromBasketProductsById(id: string) {
  this.productsBasket = this.productsBasket.filter(p => p.id !== id);
  this.events.emit('basket:changed', this.productsBasket);
}

  deleteEverythingFromBasket(): void {
    this.productsBasket.length = 0
    this.events.emit('basket:changed', this.productsBasket)
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
