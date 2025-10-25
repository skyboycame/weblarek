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

interface ICardSelectEvent {
  title: string;
}

interface ISelectedProductEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  price?: number;
}


const events = new EventEmitter()
const productsModel = new Product(events);
const basketModel = new Basket(events)
const buyerModel = new Buyer(events,{ payment: "", email: "", phone: "", address: "" } )

const catalogContainer = document.querySelector('.gallery') as HTMLElement
const headerContainer = document.querySelector('.header') as HTMLElement
const modalContainer = document.querySelector('.modal') as HTMLElement
const contentModalContainer = document.querySelector('.modal__content') as HTMLElement
const templateBasket = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = templateBasket.content.firstElementChild!.cloneNode(true) as HTMLElement;

const gallery = new Gallery(events, catalogContainer)
const modal = new Modal(events,modalContainer);
const header = new Header(events,headerContainer);
const basketView = new BasketView(events, basketContainer);


async function loadProducts() {
  try {
    const apiInstance = new Api(API_URL);
    const comunication = new Comunication(events, apiInstance);

    const productsResponse = await comunication.fetchProducts();
    console.log(productsResponse)
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



const templateCard = document.querySelector('#card-catalog') as HTMLTemplateElement;


events.on('products:changed', () => {
  const products = productsModel.getProducts()
  console.log(typeof products)


  const cards = products.map((product: IProduct) => {
    const cardElement = templateCard.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardCatalog(events, cardElement)

     const categoryClass = product.category in categoryMap 
      ? categoryMap[product.category as keyof typeof categoryMap]
      : 'card__category_other'

 

    card.render({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      image: product.image,
      price: product.price!,
      categoryClass: categoryClass
    }as any);
    return cardElement
  })

  catalogContainer.innerHTML = ''
  cards.forEach(card => catalogContainer.appendChild(card))
})


events.on('card:select', (data: ICardSelectEvent) => {
  if (!data.title) return; 

  const product = productsModel.getProducts().find(p => p.title === data.title);
  if (!product) return;

  productsModel.saveProductForView(product as IProduct);
});

const templateCardPreview = document.querySelector('#card-preview') as HTMLTemplateElement;
events.on('selectedProducts:changed', (product: ISelectedProductEvent) => {
  if (!product) return;

  const cardPreviewElement = templateCardPreview.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const cardPreview = new CardPreview(events, cardPreviewElement);

  cardPreview.category = product.category;
  cardPreview.text = product.description;
  cardPreview.image = product.image || '';
  cardPreview.title = product.title;
  cardPreview.price = product.price || 0;


  contentModalContainer.innerHTML = '';
  contentModalContainer.appendChild(cardPreview.render());

  modal.open();
});

events.on('basket:add', () => {
  const product = productsModel.getProductForView();
  if (!product) return;

  if (!basketModel.hasProduct(product.id)) {
    basketModel.addToBasketProducts(product);
  }
});
  events.on('basket:remove', (data: { title: string }) => {
    const product = basketModel.getBasketProducts().find(p => p.title === data.title);
    if (!product) return;

    basketModel.deleteFromBasketProducts(product);
  });



events.on('basket:changed', (products: IProduct[]) => {
  const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

  const basketCards = products.map((product) => {
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardBasket(events, cardElement);

   
     card.render({
      title: product.title,
      price: product.price!,
    });
    return card
  });

  basketView.items = basketCards; 
  header.counter = products.length;
});

events.on('basket:open', () => {
  basketView.items = basketModel.getBasketProducts().map(product => {
    const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardBasket(events, cardElement);
    card.render({ title: product.title, price: product.price! });
    return card;
  });

  modal.modalContent = basketView.render({
    sum: basketModel.sumOfBasketProduct()
  });

  modal.open();
});

events.on('modal:close', () => {
  modal.close();
});

events.on('address:changed', (event: object) => {
  const value = event as unknown as string;
  buyerModel.saveAddress(value);
});

events.on('phone:changed', (event: object) => {
  const value = event as unknown as string;
  buyerModel.savePhone(value);
});

events.on('email:changed', (event: object) => {
  const value = event as unknown as string;
  buyerModel.saveEmail(value);
});

events.on('payment:changed', (event: object) => {
  const value = event as unknown as TPayment;
  buyerModel.savePayment(value);
});

events.on('basket:order', () => {
  const products = basketModel.getBasketProducts();
  if (products.length === 0) {
    alert('Корзина пуста!');
    return;
  }

  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  const orderContainer = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const orderForm = new OrderForm(events, orderContainer);

  modal.modalContent = orderForm.render();
  modal.open();
});


events.on('order:contact', () => {

  const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
  const contactsContainer = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const contactsForm = new Contacts(events, contactsContainer);

  modal.modalContent = contactsForm.render();
  modal.open();
});

events.on('contact:success', () => {
  const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
  const successContainer = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const successOrder = new SuccessOrder(events, successContainer);
  

  successOrder.CountDescOrderSuccess = basketModel.sumOfBasketProduct();
  

  modal.modalContent = successOrder.render();
  modal.open();
});