import { IProduct } from "../../types";

export class Product {

  private products:IProduct[];
  private selectedProduct: IProduct | null

  constructor(products :IProduct[] = [], selectedProduct?: IProduct) {
    this.products = products;
    this.selectedProduct = selectedProduct ?? null
  }

  saveProducts(products:IProduct[]): void {
    this.products = products
  }

  getProducts():IProduct[] {
    return this.products
  }

  getOneProduct(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id)
  }

   saveProductForView(product:IProduct): void {
    this.selectedProduct = product
  }

   getProductForView():IProduct | null {
    return this.selectedProduct
  }
}