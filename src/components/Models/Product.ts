import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Product {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private events: IEvents;

  constructor(
    events: IEvents,
    products: IProduct[] = [],
    selectedProduct?: IProduct
  ) {
    this.products = products;
    this.selectedProduct = selectedProduct ?? null;
    this.events = events;
  }

  saveProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("products:changed", this.products);
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getOneProduct(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  saveProductForView(product: IProduct): void {
    (this.selectedProduct = { ...product }),
      this.events.emit("selectedProducts:changed", this.selectedProduct);
  }

  getProductForView(): IProduct | null {
    return this.selectedProduct;
  }
}
