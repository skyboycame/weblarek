import { IApi, IProduct, IBuyer, IOrder } from "../../types";
// import { Api } from "../base/Api";


export class Comunication {
  constructor(protected api : IApi) {
  }

   async fetchProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product');
  }

  async sendOrder(buyer: IBuyer, products: IProduct[]): Promise<void> {
    const order: IOrder = { buyer, products };
    await this.api.post<{}>('/order', order, 'POST');
  }

}