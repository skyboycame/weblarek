import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CardBasket } from "./Card/CardBasket";

interface IBasket {
  sum: number
  items: CardBasket[]
}

export class Basket extends Component<IBasket> {
  protected basketList: HTMLUListElement
	protected basketButton: HTMLButtonElement
	protected basketPrice: HTMLElement

    constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
    
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container)
    this.basketList = ensureElement<HTMLUListElement>('.basket__list', this.container)
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container)

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:order')
    })
    }

  set sum(value: number) {
  this.basketPrice.textContent = `${value} синапсов`;
}
  set items(cards: CardBasket[]) {

    this.basketList.replaceChildren(...cards.map(card => card.render()))


  }


}