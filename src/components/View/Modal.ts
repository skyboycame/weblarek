import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";


interface IModal {
  modalContent: HTMLElement
}

export class Modal extends Component<IModal> {
  protected modalClose: HTMLButtonElement
  protected modalContainer: HTMLElement

constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.modalClose = ensureElement<HTMLButtonElement>('.modal__close', this.container)
    this.modalContainer = ensureElement<HTMLElement>('.modal__content',this.container)
    
    this.modalClose.addEventListener('click', () => {
      this.events.emit('modal:close')
    })

    this.container.addEventListener('click' ,(e) => {
    if(e.target === this.container) {
      this.events.emit('modal:close')
    }
    
    }
    )
}

set modalContent (items:HTMLElement) {
  this.modalContainer.replaceChildren(items)
}

open() {
    this.container.classList.add('modal_active')
  }

    setContent(content: HTMLElement) {
    this.modalContainer.innerHTML = '';
    this.modalContainer.appendChild(content);
  }

  close() {
  this.container.classList.remove('modal_active')
}
}