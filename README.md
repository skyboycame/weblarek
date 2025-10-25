# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### Архитектура (Данные)

Товар = {
	Название
	Категория 
	Логотип
	Цена / ее отсутствие
	Описание
}

Каталог на главной:

export class Product {

  private products:IProduct[];
  private selectedProduct: IProduct | null

  constructor(products :IProduct[] = [], selectedProduct?: IProduct) {
    this.products = products;
    this.selectedProduct = selectedProduct ?? null
  }

  saveProducts(products:IProduct[]): void {
    this.products = products
  }

  getProducts():IProduct[] {
    return this.products
  }

  getOneProduct(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id)
  }

   saveProductForView(product:IProduct): void {
    this.selectedProduct = product
  }

   getProductForView():IProduct | null {
    return this.selectedProduct
  }
}

Методы:
1) Список товаров,
2) Сохранить выбранную карточку,
3) Получить выбранную карточку,
4) Сохранить массив товаров

Корзина с товарами:
	Массив товаров

	import { IProduct } from "../../types";

export class Basket {

  private productsBasket : IProduct[];
  
  constructor(productsBasket: IProduct[] = []) {
  
    this.productsBasket = productsBasket
  }

  getBasketProducts():IProduct[] {
    return this.productsBasket
  }

  addToBasketProducts(product: IProduct): void {
    this.productsBasket.push(product)
  }

  deleteFromBasketProducts(product: IProduct): void {
    const index = this.productsBasket.indexOf(product)
    this.productsBasket.splice(index,1)
  }

  deleteEverythingFromBasket(): void {
    this.productsBasket.length = 0
  }

  sumOfBasketProduct(): number  {
    return this.productsBasket.reduce((sum, el) => {
      sum += el.price ?? 0
      return sum
    }, 0)
  }
  quantityBasketProducts(): number {
    return this.productsBasket.length
  }
   
   getOneBasketProduct(id: string): IProduct | undefined {
    return this.productsBasket.find(product => product.id === id)
  }
  
   hasProduct(id: string): boolean {
    return this.productsBasket.some(product => product.id === id);
  }




}


Методы: 
1) Добавлять товар
2) Удалять товар
3) Количество товаров
4) Список товаров
5) Сумма стоимости
6) Есть ли товар в корзине или нет


 Покупатель = {
	 Способ оплаты(два варианта)
	 Адрес доставки
	 Email
	 Телефон
 }
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

  
   проверка введенных данных
   Получение данных
   Сохранение данных


##### API

interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}


##### POST запрос ордера
То, что мы отправляем на сервер в body: {
	payment: 'card' | 'cash' | '',
	email: string,
	phone: string,
	address: string,
	total: number,
	items: id[]
}

Ответ сервера на пост запрос: {
id: string
total: number  (общая стоимость)
}


##### Слой коммуникации

class Communication extends Api {
	Этот класс будет использовать композицию, чтобы выполнить запрос на сервер с помощью метода get класса Api и будет получать с сервера объект с массивом товаров.
}

##### VIEW

Блоки которые отображаются в модальном окне:
1) Описание товара
2) Корзина
3)  форма с видом оплаты
4)  форма емейл телефон
5) Заказ оформлен
6) Модальное окно

Части, блоки:
Корзина с счетчиком товаров
Список карточек товара
	Карточка
Корзина 
	Карточка товаров в корзине


Переиспользуемые сущности:
Информация о товаре используется в :
1) Карточке товара
2) В корзине, когда товар добавлен
3) В модальном окне, когда выбираешь определенную карточку

 формы


Поиск элементов в классе не должен осуществляться через document, а через родительский контейнер

За каждый блок будет отвечать отдельный класс(в ts). Например за весь header будет отвечать один class :

Отдельные классы для:
В нем нужно найти те элементы, которые меняются , а также с которыми взаимодействует пользователь:
	interface HeaderData {
	counter: number
	}

1) class Header extends Component <HeaderData>{


	Я так понимаю, что эти элементы нужно будет найти в constuctor
	basketButton : htmlButtonElement
	private counter: htmlElement
	 }

	(Наверное так)
	set counter(value: number){
		this.counter = value
		}





interface GalleryData {
catalog: HTMLElement[]
} 

2) Каталог с карточками товара
   class Gallery extends Component <GalleryData> {


	main: htmlElement
	нужен будет метод который передает в main карточки
	для этого понадобится set Catalog(items: HTMLElement[]) {
		this.catalog  = [items]  (НАВЕРНОЕ)
	}
}

3) Модальное окно - просто оболочка без содержимого, в нее нужно будет вставлять template - шаблоны (Вспомнить как пользоваться шаблонами)

interface ModalData {
	modalContent: HTMLElement
}
class Modal extends Component <ModalData> {
	modalClose : HTMLButtonElement
	modalContent: htmlElement

set modalContent (element: HTMLElement) я так понимаю нужно будет сюда вставлять template
}


4)  Успешно выполненный ордер

interface SuccessOrderData {
	descOrderSuccess: string
}

class SuccessOrder extends Component<SuccessOrderData> {

		descOrderSuccess: string
		buttonOrderSucces: HTMLButtonElement

set descOrderSuccess(value:  string) {
	сеттер должен передавать общую сумму заказа
}
}

5) Отдельная Карточка в каталоге на главной странице


	Interface CardCatalogData {
		cardCategory: string 
		cardTitle: string
		cardPrice: string
	}

   class CardCatalog extends CardParent<CardCatalogData> {

	buttonCard: HTMLButtonElement
	cardCategory: string 
	cardTitle: string
	cardImage: HTMLImageElement
	cardPrice: string
	
set CardCategory(value: string) 
set cardTitle(value: string)
set cardPrice(value: string)

Так понял, что img уже готовым методом
}


6) Карточка которая открывается в модальном окне

interface fullCardData {
	cardCategory: string 
	cardTitle: string
	cardPrice: string
	cardText: string
}

class fullCard extends CardParent <fullCardData> {
	cardCategory: string 
	cardTitle: string
	cardImage: HTMLImageElement
	cardPrice: string
	cardText: string
	cardBasketButton: HTMLButtonElement

Так понял, что img уже готовым методом
set CardCategory(value: string) 
set cardTitle(value: string)
set cardPrice(value: string)
set cardText(value:string)
}

7) Элемент списка добавленных товаров в корзину (вставляется в basket__list , а уже он в свою очередь в модальное окно)

interface BasketItemData {
	cardTitle: string
	cardPrice: string
}

class BasketItem extends CardParent <BasketItemData> {

	basketItemIndex : number,
	cardTitle: string
	cardPrice: string
	buttonBasketDelete: HTMLButtonElement


set cardTitle(value: string)
set cardPrice(value: string)
}


8) Корзина, которая вставляется в модалку

interface BasketData {
	basketList: HTMLUListElement
	basketPrice: string
}

class Basket extends Component <BasketData> {

	basketList: HTMLUListElement
	basketButton: HTMLButtonElement
	basketPrice: string

setBasketList(items: BasketItem (ПО ИДЕЕ))
setBasketPrice(value:string)
}

9) Ордер (вставляется в модалку)

Interface OrderData {
inputAddress : HTMLInputElement
}

class Order extends FormParent <OrderData> {

	buttonPayCard: HTMLButtonElement
	buttonPayCash: HTMLButtonElement
	inputAddress : HTMLInputElement
	buttonNextStap: HTMLButtonElement

	set inputAddress(value:string)
}


10) Контакты (вставляется в модалку)

interface ContactsData {
	emailInput : HTMLInputElement
	numberInput : HTMLInputElement
}

class Contacts extends FormParent <ContactsData> {

	emailInput : HTMLInputElement
	numberInput : HTMLInputElement
	buttonNextStap: HTMLButtonElement


	set emailInput(value: string)
	set number(value: string)
}


Сделаем общего родителя форм (наверное так)

class FormParent extends Component {
	buttonNextStap: HTMLButtonElement
	emailInput? : HTMLInputElement
	numberInput? : HTMLInputElement		
	buttonPayCard?: HTMLButtonElement
	buttonPayCash?: HTMLButtonElement
	inputAddress? : HTMLInputElement
}

Общий родитель карточек 


class CardParent extends Component {
 я думаю сделать так что общие ключи сделать обязательными
 а которые где-то есть где-то нет сделать необязательными
	cardTitle: string
	cardPrice: string
	cardCategory?: string 
	cardImage?: HTMLImageElement
	cardText?: string

set cardTitle(value: string)
set cardPrice(value: string)
		
}



##### События 

modal:close - закрытие модалки 
basket:open - открытие корзины
card:select - выбор карточки
basket:order - в модалке из корзины в ордер
order:contact - в модалке из ордера в контакты
contact:success - в модалке из контактов в саксес
basket:add 
basket:remove
address:changed - при смене адреса
phone:changed -при смене телефона
email:changed
payment:changed
buyer:changed - при смене всей информации о покупателе
products:fetched - загрузка всех продуктов
order:sent - отправка заказа на сервер
selectedProducts:changed - выбраный товар 
products:changed - сохраняет продукты которые пришли с сервера


###### Presenter 

Реализовывать буду в main.ts