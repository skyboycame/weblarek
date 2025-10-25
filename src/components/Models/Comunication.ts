import { IApi, IProduct, IBuyer, IOrder, Iprom } from "../../types";
import { IEvents } from "../base/Events";
// import { Api } from "../base/Api";


export class Comunication {
  constructor(protected events: IEvents, protected api : IApi) {
  }

   async fetchProducts(): Promise<{ total: number; items: IProduct[] }> {
    const products =  this.api.get<{ total: number; items: IProduct[] }>('/product');
    this.events.emit('products:fetched', products)
    return products
  }

  async sendOrder(buyer: IBuyer, products: IProduct[]): Promise<Iprom> {
    const order: IOrder = { buyer, products };
    const response = await this.api.post<Iprom>('/order', order, 'POST');
    this.events.emit('order:sent', response); 
    return response;
  }

}