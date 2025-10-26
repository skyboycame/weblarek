import { Api } from "./components/base/Api";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Comunication } from "./components/Models/Comunication";
import { Product } from "./components/Models/Product";
import "./scss/styles.scss";
import { IBuyer, IProduct } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
import { Header } from "./components/View/Header";
import { EventEmitter } from "./components/base/Events";
import { CardCatalog } from "./components/View/Card/CardCatalog";
import { Modal } from "./components/View/Modal";
import { Basket as BasketView } from "./components/View/Basket";
import { Gallery } from "./components/View/Gallery";
import { categoryMap } from "./utils/constants";
import { CardPreview } from "./components/View/Card/CardPreview";
import { CardBasket } from "./components/View/Card/CardBasket";
import { TPayment } from "./types";
import { OrderForm } from "./components/View/Form/OrderForm";
import { Contacts } from "./components/View/Form/ContactForm";
import { SuccessOrder } from "./components/View/SuccessOrder";
import { CDN_URL } from "./utils/constants";

interface ICardSelectEvent {
  id: string;
}

interface ISelectedProductEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  price?: number;
}

const events = new EventEmitter();
const productsModel = new Product(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events, {
  payment: "",
  email: "",
  phone: "",
  address: "",
});

const catalogContainer = document.querySelector(".gallery") as HTMLElement;
const headerContainer = document.querySelector(".header") as HTMLElement;
const modalContainer = document.querySelector(".modal") as HTMLElement;
const contentModalContainer = document.querySelector(
  ".modal__content"
) as HTMLElement;
const templateBasket = document.querySelector("#basket") as HTMLTemplateElement;
const basketContainer = templateBasket.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;

const gallery = new Gallery(events, catalogContainer);
const modal = new Modal(events, modalContainer);
const header = new Header(events, headerContainer);
const basketView = new BasketView(events, basketContainer);

async function loadProducts() {
  try {
    const apiInstance = new Api(API_URL);
    const comunication = new Comunication(events, apiInstance);

    const productsResponse = await comunication.fetchProducts();
    console.log(productsResponse);
    productsModel.saveProducts(productsResponse.items);

    console.log("Полученные продукты:", productsModel.getProducts());
  } catch (error) {
    console.error("Ошибка при загрузке продуктов:", error);
    if (error instanceof Response) {
      const errorText = await error.text();
      console.error("Ответ сервера:", errorText);
    }
  }
}
loadProducts();

events.on("products:changed", () => {
  const products = productsModel.getProducts();
  gallery.renderProducts(products);
});

events.on("card:select", (data: ICardSelectEvent) => {
  if (!data.id) return;
  productsModel.selectProductById(data.id);
});

const templateCardPreview = document.querySelector(
  "#card-preview"
) as HTMLTemplateElement;
events.on("selectedProducts:changed", (product: ISelectedProductEvent) => {
  if (!product) return;

  const cardPreviewElement =
    templateCardPreview.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
  const cardPreview = new CardPreview(events, cardPreviewElement);

  cardPreview.category = product.category;
  cardPreview.text = product.description;
  cardPreview.image = `${CDN_URL}${product.image || ""}`;
  cardPreview.title = product.title;
  cardPreview.price = product.price || 0;

   modal.setContent(cardPreview.render());
    modal.open();
});

events.on("basket:add", () => {
  const product = productsModel.getProductForView();
  if (!product) return;

  if (!basketModel.hasProduct(product.id)) {
    basketModel.addToBasketProducts(product);
  }
});

  events.on("basket:remove", (data: { id: string }) => {
    basketModel.deleteFromBasketProductsById(data.id);
  });

events.on("basket:changed", (products: IProduct[]) => {
  const cardTemplate = document.querySelector(
    "#card-basket"
  ) as HTMLTemplateElement;

  const basketCards = products.map((product) => {
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const card = new CardBasket(events, cardElement, product.id);

    card.render({
      id: product.id,
      title: product.title,
      price: product.price!,
    });
    return card;
  });

  basketView.items = basketCards;
  header.counter = products.length;
});

events.on("basket:open", () => {
  basketView.items = basketModel.getBasketProducts().map((product) => {
    const cardTemplate = document.querySelector(
      "#card-basket"
    ) as HTMLTemplateElement;
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const card = new CardBasket(events, cardElement, product.id);
    card.render({ title: product.title, price: product.price! });
    return card;
  });

  modal.modalContent = basketView.render({
    sum: basketModel.sumOfBasketProduct(),
  });

  modal.open();
});

events.on("modal:close", () => {
  modal.close();
});

// events.on("address:changed", (event: object) => {
//   const value = event as unknown as string;
//   buyerModel.saveAddress(value);
// });

// events.on("phone:changed", (event: object) => {
//   const value = event as unknown as string;
//   buyerModel.savePhone(value);
// });

// events.on("email:changed", (event: object) => {
//   const value = event as unknown as string;
//   buyerModel.saveEmail(value);
// });

// events.on("payment:changed", (event: object) => {
//   const value = event as unknown as TPayment;
//   buyerModel.savePayment(value);
// });


const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const orderContainer = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(events, orderContainer);

const contactsTemplate = document.querySelector("#contacts") as HTMLTemplateElement;
const contactsContainer = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const contactsForm = new Contacts(events, contactsContainer);

const successTemplate = document.querySelector("#success") as HTMLTemplateElement;
const successContainer = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const successOrder = new SuccessOrder(events, successContainer);

events.on("basket:order", () => {
  const products = basketModel.getBasketProducts();
  if (products.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  modal.modalContent = orderForm.render();
  modal.open();
});

events.on("order:contact", (data: { address: string; payment: "card" | "cash" }) => {
    buyerModel.saveAddress(data.address);
    buyerModel.savePayment(data.payment);

    const errors = [
        buyerModel.validatePayment(),
        buyerModel.validateAddress(),
    ].filter(Boolean);

    if (errors.length > 0) {
        modal.modalContent = orderForm.render();
        modal.open();
        return;
    }

    modal.modalContent = contactsForm.render();
    modal.open();
});

events.on("contact:success", async (data: { email: string; phone: string }) => {
  buyerModel.saveEmail(data.email);
  buyerModel.savePhone(data.phone);

    const errors = [
        buyerModel.validatePayment(),
        buyerModel.validateAddress(),
        buyerModel.validateEmail(),
        buyerModel.validatePhone(),
    ].filter(Boolean);

    if (errors.length > 0) {
        modal.modalContent = contactsForm.render();
        modal.open();
        return;
    }

    const products = basketModel.getBasketProducts();
    if (products.length === 0) {
        modal.modalContent = contactsForm.render();
        modal.open();
        return;
    }

    try {
      console.log("Отправляемый заказ:", {
            payment: buyerModel.getInfoAboutBuyer().payment,
            address: buyerModel.getInfoAboutBuyer().address,
            email: buyerModel.getInfoAboutBuyer().email,
            phone: buyerModel.getInfoAboutBuyer().phone,
            items: products.map(p => p.id),
            total: basketModel.sumOfBasketProduct(),
        });
        const apiInstance = new Api(API_URL);
        const comunication = new Comunication(events, apiInstance);
        const response = await comunication.sendOrder(buyerModel.getInfoAboutBuyer(), products);
        basketModel.deleteEverythingFromBasket();
        buyerModel.clear();
        successOrder.countDescOrderSuccess = response.total;
        modal.modalContent = successOrder.render();
        modal.open();
        console.log("Заказ успешно оформлен:", response);
    } catch (error) {
        console.error("Ошибка при оформлении заказа:", error);
        
        modal.modalContent = contactsForm.render();
        modal.open();
    }
});