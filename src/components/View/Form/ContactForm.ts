
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { FormParent } from "./FormParent";

interface IContactsData {
  email: string
  phone: string
}

export class Contacts extends FormParent<IContactsData> {


  constructor(events: IEvents, container: HTMLElement) {


    super(events, container)
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container)
    this.numberInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container)

    if(this.emailInput.value || this.numberInput.value) {
      this.enableNextStep()
    }

      this.buttonNextStep.addEventListener('click', () => {
      this.events.emit('contact:success')
    })

    this.emailInput.addEventListener('input', () => this.checkNextStep());
    this.numberInput.addEventListener('input', () => this.checkNextStep());
  }

  protected checkNextStep() {
  if (this.emailInput?.value.trim() !== '' && this.numberInput?.value.trim() !== '') {
    this.enableNextStep();
  } else {
    this.disableNextStep();
  }
}


  set email(value: string) {
    if (this.emailInput) this.emailInput.value = value
  }

  set phone(value: string) {
    if (this.numberInput) this.numberInput.value = value
  }
}