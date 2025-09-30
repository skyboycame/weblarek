import { IBuyer, TPayment } from "../../types";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;

  constructor(buyer: IBuyer) {
    this.payment = buyer.payment;
    this.email = buyer.email;
    this.phone = buyer.phone;
    this.address = buyer.address;
  }

  savePayment(payment: TPayment) {
    this.payment = payment;
  }
  saveEmail(email: string) {
    this.email = email;
  }
  savePhone(phone: string) {
    this.phone = phone;
  }
  saveAddress(address: string) {
    this.address = address;
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
}
