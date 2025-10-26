
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface ICardParent {
  title: string,
  price: number
  id: string
}

export class CardParent<T extends ICardParent> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement

constructor(protected events: IEvents, container: HTMLElement) {
  super(container)

  this.cardTitle = ensureElement<HTMLElement>('.card__title',this.container)
  this.cardPrice = ensureElement<HTMLElement>('.card__price',this.container)
}

set title(value: string) {
  this.cardTitle.textContent = value
}

set price(value: number) {
  this.cardPrice.textContent = `${value} синапсов`
}

render(data?: Partial<ICardParent>): HTMLElement {
    if (data) Object.assign(this, data);
    return this.container;
  }
}