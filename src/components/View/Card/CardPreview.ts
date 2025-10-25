import { CardParent } from "./CardParent";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ICardParent } from "./CardParent";
import { categoryMap } from "../../../utils/constants";

interface ICardPreview extends ICardParent {
  category: string;
  text: string;
  image?: string;
}

export class CardPreview extends CardParent<ICardPreview> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected cardBasketButton: HTMLButtonElement;

  private _inBasket = false;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.cardBasketButton = ensureElement<HTMLButtonElement>(
      ".button.card__button",
      this.container
    );
    this.cardText = ensureElement<HTMLElement>(".card__text", this.container);
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.cardBasketButton.addEventListener("click", () => {
      this.toogleBasket();
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

  set text(value: string) {
    this.cardText.textContent = value;
  }

  set inBasket(value: boolean) {
    this._inBasket = value;
    this.updateButton();
  }

  private updateButton() {
    if (this._inBasket) {
      this.cardBasketButton.textContent = "Удалить из корзины";
    } else {
      this.cardBasketButton.textContent = "Добавить в корзину";
    }
  }

  private toogleBasket() {
    this._inBasket = !this._inBasket;
    this.updateButton();

    this.events.emit(this._inBasket ? "basket:add" : "basket:remove", {
      title: this.cardTitle.textContent,
    });
  }
}
