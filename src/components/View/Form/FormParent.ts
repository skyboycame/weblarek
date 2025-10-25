
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export abstract class FormParent<T> extends Component<T> {
  protected buttonNextStep: HTMLButtonElement
  protected emailInput?: HTMLInputElement
  protected numberInput?: HTMLInputElement
  protected inputAddress?: HTMLInputElement
  protected buttonPayCard?: HTMLButtonElement
  protected buttonPayCash?: HTMLButtonElement

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
    this.buttonNextStep = ensureElement<HTMLButtonElement>('.order__button, .button', this.container)
  }

  protected enableNextStep() {
    this.buttonNextStep.disabled = false
  }

  protected disableNextStep() {
    this.buttonNextStep.disabled = true
  }
}
