import { Api } from "./components/base/Api";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Comunication } from "./components/Models/Comunication";
import { Product } from "./components/Models/Product";
import "./scss/styles.scss";
import { IBuyer, IProduct } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
console.log("VITE_API_ORIGIN:", import.meta.env.VITE_API_ORIGIN);
console.log(API_URL);
const productsModel = new Product();

productsModel.saveProducts(apiProducts.items);
console.log(productsModel.getProducts());

async function loadProducts() {
  try {
    const apiInstance = new Api(API_URL);
    const comunication = new Comunication(apiInstance);

    const products = await comunication.fetchProducts();
    productsModel.saveProducts(products);

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

const buyerData: IBuyer = {
  payment: "card",
  email: "test@example.com",
  phone: "+79998887766",
  address: "Москва",
};

const buyer = new Buyer(buyerData);

console.log("Инфо о покупателе:", buyer.getInfoAboutBuyer());

buyer.savePayment("cash");
buyer.saveEmail("new@example.com");
buyer.savePhone("+70000000000");
buyer.saveAddress("СПб, Невский проспект");

console.log("После обновления:", buyer.getInfoAboutBuyer());

console.log("Валидация payment:", buyer.validatePayment());
console.log("Валидация email:", buyer.validateEmail());
console.log("Валидация phone:", buyer.validatePhone());
console.log("Валидация address:", buyer.validateAddress());

buyer.deleteBuyerInfo();
console.log("После удаления данных:", buyer.getInfoAboutBuyer());

const products: IProduct[] = apiProducts.items;

const productManager = new Product(products);

console.log("Все продукты:", productManager.getProducts());

const firstId = products[0].id;
console.log("Один продукт по id:", productManager.getOneProduct(firstId));

productManager.saveProductForView(products[1]);
console.log(
  "Выбранный продукт для просмотра:",
  productManager.getProductForView()
);

const basket = new Basket();

console.log("Корзина изначально:", basket.getBasketProducts());

basket.addToBasketProducts(products[0]);
basket.addToBasketProducts(products[1]);
console.log("После добавления:", basket.getBasketProducts());

console.log("Есть ли продукт:", basket.hasProduct(products[0].id));

console.log("Количество товаров:", basket.quantityBasketProducts());
console.log("Сумма корзины:", basket.sumOfBasketProduct());

basket.deleteFromBasketProducts(products[0]);
console.log("После удаления одного продукта:", basket.getBasketProducts());

console.log(
  "Один товар из корзины:",
  basket.getOneBasketProduct(products[1].id)
);

basket.deleteEverythingFromBasket();
console.log("После очистки:", basket.getBasketProducts());
