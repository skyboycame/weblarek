
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { FormParent } from "./FormParent";

interface IOrderForm {
  inputAddress: string
}

export class OrderForm extends FormParent<IOrderForm> {
  protected buttonPayCard: HTMLButtonElement
	protected buttonPayCash: HTMLButtonElement
	protected inputAddress : HTMLInputElement


  constructor(events: IEvents, container: HTMLElement) {
    super(events, container)
    this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.container)
    this.buttonPayCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container)
    this.buttonPayCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)

    this.buttonNextStep.addEventListener('click', () => {
      this.events.emit('order:contact')
    })

    this.buttonPayCard.addEventListener('click', () => {
      this.buttonPayCard.classList.add('button_alt-active');
      this.buttonPayCash.classList.remove('button_alt-active');
      this.checkNextStep();
    });

    this.buttonPayCash.addEventListener('click', () => {
      this.buttonPayCash.classList.add('button_alt-active');
      this.buttonPayCard.classList.remove('button_alt-active');
      this.checkNextStep();
    });
  }

  protected checkNextStep() {
  if ((this.buttonPayCard.classList.contains('button_alt-active') || 
       this.buttonPayCash.classList.contains('button_alt-active')) &&
      this.inputAddress.value.trim() !== '') {
    this.enableNextStep();
  } else {
    this.disableNextStep();
  }
}



  set address(value: string) {
    if (this.inputAddress) {
      this.inputAddress.value = value
      this.checkNextStep()
    }
  }
}