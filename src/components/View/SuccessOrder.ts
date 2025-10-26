
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ISuccessOrder {
  total : number
}

export class SuccessOrder extends Component<ISuccessOrder> {
  protected descOrderSuccess: HTMLElement;
  protected buttonOrderSuccess: HTMLButtonElement

  constructor(protected events: IEvents, container: HTMLElement ) {
    super(container)

    this.descOrderSuccess = ensureElement<HTMLElement>('.order-success__description', this.container)
    this.buttonOrderSuccess = ensureElement<HTMLButtonElement>('.button.order-success__close',this.container)

     this.buttonOrderSuccess.addEventListener('click', () => {
      this.events.emit('modal:close')
    })
  }

  set countDescOrderSuccess(value: number) {
    this.descOrderSuccess.textContent = `Списано ${value} синапсов`
  }
}