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
  protected _id: string = ''

  constructor(protected events: IEvents, container: HTMLElement, id: string) {
    super(events, container)
    this._id = id

    this.basketItemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container)
    this.basketRemoveButton = ensureElement<HTMLButtonElement>('.basket__item-delete.card__button', this.container)

   this.basketRemoveButton.addEventListener('click', () => {
    this.events.emit('basket:remove', { id: this._id });
    });
      }

  set id(value:string) { 
    this._id = value 
  }

   get id(): string {
    return this._id;
  } // я хз как подругому сделать
  
  set index (i: number) {
    this.basketItemIndex.textContent = String(i)
  }

  set price(value: number) {
    this.cardPrice.textContent = `${value} синапсов`
  }

  


}