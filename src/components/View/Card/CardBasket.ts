import { CardParent } from "./CardParent";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ICardParent } from "./CardParent";

interface ICardBasket extends ICardParent {
  index: number
}

export class CardBasket extends CardParent<ICardBasket> {
  protected basketItemIndex: HTMLElement
  protected basketRemoveButton: HTMLButtonElement
  priceValue: number = 0

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container)

    this.basketItemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container)
    this.basketRemoveButton = ensureElement<HTMLButtonElement>('.basket__item-delete.card__button', this.container)

    this.basketRemoveButton.addEventListener('click', () => {
      this.events.emit('basket:remove', {title: this.cardTitle.textContent})
    })

  }
  
  set index (i: number) {
    this.basketItemIndex.textContent = String(i)
  }

  set price(value: number) {
    this.priceValue = value 
    this.cardPrice.textContent = `${value} синапсов`
  }

}