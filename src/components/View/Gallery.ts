import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CardCatalog } from "./Card/CardCatalog";
import { CDN_URL } from "../../utils/constants";
import { IProduct } from "../../types";

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }

  clear() {
    this.container.replaceChildren();
  }

  renderProducts(products: IProduct[]) {
    this.container.innerHTML = "";

    products.forEach((product) => {
      const cardElement = document.querySelector(
        "#card-catalog"
      ) as HTMLTemplateElement;

      const newCard = cardElement.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      const card = new CardCatalog(this.events, newCard);

      card.render({
        id: product.id,
        title: product.title,
        category: product.category,
        image: `${CDN_URL}${product.image}`,
        price: product.price!,
      });

      this.container.appendChild(newCard);
    });
  }
}
