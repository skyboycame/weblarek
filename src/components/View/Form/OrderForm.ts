
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
  private selectedPayment: 'card' | 'cash' | null = null;


  constructor(events: IEvents, container: HTMLElement) {
    super(events, container, '.order__button')
    this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.container)
    this.buttonPayCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container)
    this.buttonPayCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)
   
   this.buttonPayCard.addEventListener('click', () => this.selectPayment('card'))
    this.buttonPayCash.addEventListener('click', () => this.selectPayment('cash'))
   
    this.selectPayment('card');
    
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();


      this.events.emit("order:contact", {
        address: this.inputAddress.value.trim(),
        payment: this.selectedPayment,
      });
    });
  }

  private selectPayment(payment: "card" | "cash") {
    this.selectedPayment = payment;
    this.buttonPayCard.classList.toggle("button_alt-active", payment === "card");
    this.buttonPayCash.classList.toggle("button_alt-active", payment === "cash");
    this.checkNextStep();
  }

  protected checkNextStep() {
    if (this.inputAddress.value.trim() && this.selectedPayment) {
      this.enableNextStep();
    } else {
      this.disableNextStep();
    }
  }

  set address(value: string) {
    this.inputAddress.value = value;
    this.checkNextStep();
  }
}