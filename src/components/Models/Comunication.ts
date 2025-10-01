import { IApi, IProduct, IBuyer, IOrder, Iprom } from "../../types";
// import { Api } from "../base/Api";


export class Comunication {
  constructor(protected api : IApi) {
  }

   async fetchProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product');
  }

  async sendOrder(buyer: IBuyer, products: IProduct[]): Promise<Iprom> {
    const order: IOrder = { buyer, products };
    return await this.api.post<Iprom>('/order', order, 'POST');
  }

}