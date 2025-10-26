import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;
  private events : IEvents


  constructor(events: IEvents, buyer: IBuyer) {
    this.payment = buyer.payment;
    this.email = buyer.email;
    this.phone = buyer.phone;
    this.address = buyer.address;
    this.events = events
  }

  savePayment(payment: TPayment) {
    this.payment = payment;
    this.events.emit('payment:changed', this.getInfoAboutBuyer())
  }
  saveEmail(email: string) {
    this.email = email;
    this.events.emit('email:changed',  this.getInfoAboutBuyer())
  }
  savePhone(phone: string) {
    this.phone = phone;
    this.events.emit('phone:changed',  this.getInfoAboutBuyer())
  }
  saveAddress(address: string) {
    this.address = address;
    this.events.emit('address:changed', this.getInfoAboutBuyer())
  }
  getInfoAboutBuyer(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  deleteBuyerInfo(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
     this.events.emit('buyer:changed', this.getInfoAboutBuyer())
  }

  validatePayment(): string | null {
    if (!this.payment) return "Не выбран вид оплаты";
    return null;
  }

  validateEmail(): string | null {
    if (!this.email) return "Укажите емэйл";
    return null;
  }

  validatePhone(): string | null {
    if (!this.phone) return "Укажите телефон";
    return null;
  }

  validateAddress(): string | null {
    if (!this.address) return "Укажите адрес";
    return null;
  }

  clear() {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }
}
