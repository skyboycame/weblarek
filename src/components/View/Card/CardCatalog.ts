import { CardParent } from "./CardParent";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ICardParent } from "./CardParent";
import { categoryMap } from "../../../utils/constants";

interface ICardCatalog extends ICardParent {
  category: string;
  image?: string;
}

export class CardCatalog extends CardParent<ICardCatalog> {
  protected buttonCard: HTMLButtonElement;
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.buttonCard = this.container as HTMLButtonElement;
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.buttonCard.addEventListener("click", () => {
      this.events.emit("card:select", {
        title: this.cardTitle.textContent ?? "",
      });
    });
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.className = "card__category";

    const className =
      categoryMap[value.toLowerCase() as keyof typeof categoryMap];

    if (className) {
      this.cardCategory.classList.add(className);
    }
  }

  set image(src: string) {
    this.setImage(this.cardImage, src);
  }

  render(data: ICardCatalog): HTMLElement {
    if (data.title) this.title = data.title;
    if (data.price) this.price = data.price;
    if (data.category) this.category = data.category;
    if (data.image) this.image = data.image;

    return this.container;
  }
}
