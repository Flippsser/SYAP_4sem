// Перечисление категорий товаров
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["Electronics"] = "\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u0438\u043A\u0430";
    ProductCategory["Clothing"] = "\u041E\u0434\u0435\u0436\u0434\u0430";
    ProductCategory["Books"] = "\u041A\u043D\u0438\u0433\u0438";
    ProductCategory["Sports"] = "\u0421\u043F\u043E\u0440\u0442";
    ProductCategory["Other"] = "\u0420\u0430\u0437\u043D\u043E\u0435";
})(ProductCategory || (ProductCategory = {}));
// Класс Product
class Product {
    constructor(id, name, price, category, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
    }
    // Информация о товаре
    getInfo() {
        let info = `ID: ${this.id}, Название: ${this.name}, Цена: ${this.price} руб., Категория: ${this.category}`;
        if (this.description) {
            info += `, Описание: ${this.description}`;
        }
        return info;
    }
}
// Класс Catalog
class Catalog {
    constructor() {
        this.products = [];
        this.products = [];
    }
    // Добавление товара (принимает данные без id и метода)
    addProduct(productData) {
        const newId = this.products.length > 0
            ? Math.max(...this.products.map(p => p.id)) + 1
            : 1;
        const newProduct = new Product(newId, productData.name, productData.price, productData.category, productData.description);
        this.products.push(newProduct);
        return newProduct;
    }
    removeProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            return true;
        }
        return false;
    }
    getProductById(id) {
        return this.products.find(p => p.id === id);
    }
    getAllProducts() {
        return [...this.products];
    }
    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }
}
// Класс Order (дженерик)
class Order {
    constructor(id, products) {
        this.id = id;
        this.products = products;
        this.totalPrice = this.calculateTotalPrice();
    }
    calculateTotalPrice() {
        return this.products.reduce((sum, product) => sum + product.price, 0);
    }
    getOrderInfo() {
        const productList = this.products.map(p => `${p.name} (${p.price} руб.)`).join(', ');
        return `Заказ #${this.id}: товары: [${productList}], общая стоимость: ${this.totalPrice} руб.`;
    }
}
// Класс Customer
class Customer {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    getCustomerInfo() {
        return `Покупатель: ${this.name} (ID: ${this.id}), email: ${this.email}`;
    }
}
// Класс OrderManager
class OrderManager {
    constructor() {
        this.orders = [];
        this.orderCustomerMap = new Map(); // orderId -> customerId
        this.orders = [];
    }
    // Создание нового заказа с привязкой к покупателю
    createOrder(customer, products) {
        const newId = this.orders.length > 0
            ? Math.max(...this.orders.map(o => o.id)) + 1
            : 1;
        const newOrder = new Order(newId, products);
        this.orders.push(newOrder);
        this.orderCustomerMap.set(newOrder.id, customer.id);
        return newOrder;
    }
    getOrderById(id) {
        return this.orders.find(o => o.id === id);
    }
    getAllOrders() {
        return [...this.orders];
    }
    getOrdersByCustomer(customerId) {
        const orderIds = Array.from(this.orderCustomerMap.entries())
            .filter(([_, custId]) => custId === customerId)
            .map(([orderId, _]) => orderId);
        return this.orders.filter(order => orderIds.includes(order.id));
    }
}
// Демонстрация утилитных типов
// 1. Partial<Product> — обновление товара с необязательными полями
function updateProduct(product, updates) {
    if (updates.name !== undefined)
        product.name = updates.name;
    if (updates.price !== undefined)
        product.price = updates.price;
    if (updates.description !== undefined)
        product.description = updates.description;
    if (updates.category !== undefined)
        product.category = updates.category;
    return product;
}
// 2. Omit<Product, 'id'> — создание объекта, похожего на товар, но без id (с методом getInfo)
function createProductCopyWithoutId(product) {
    return {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        getInfo: function () {
            let info = `Название: ${this.name}, Цена: ${this.price} руб., Категория: ${this.category}`;
            if (this.description) {
                info += `, Описание: ${this.description}`;
            }
            return info;
        }
    };
}
function getOrderSummary(order) {
    return {
        id: order.id,
        totalPrice: order.totalPrice
    };
}
// Пример использования
const catalog = new Catalog();
// Добавляем товары (используем ProductCreationData)
const phone = catalog.addProduct({
    name: "Смартфон",
    price: 30000,
    category: ProductCategory.Electronics,
    description: "Мощный телефон"
});
const laptop = catalog.addProduct({
    name: "Ноутбук",
    price: 60000,
    category: ProductCategory.Electronics
});
const tshirt = catalog.addProduct({
    name: "Футболка",
    price: 1500,
    category: ProductCategory.Clothing
});
console.log("Все товары в каталоге:");
catalog.getAllProducts().forEach(p => console.log(p.getInfo()));
console.log("\nТовары в категории Электроника:");
catalog.getProductsByCategory(ProductCategory.Electronics).forEach(p => console.log(p.getInfo()));
// Создаём покупателей
const customer1 = new Customer(1, "Иван Петров", "ivan@example.com");
const customer2 = new Customer(2, "Мария Смирнова", "maria@example.com");
// Создаём менеджер заказов
const orderManager = new OrderManager();
// Создаём заказы
const order1 = orderManager.createOrder(customer1, [phone, laptop]);
const order2 = orderManager.createOrder(customer2, [tshirt]);
const order3 = orderManager.createOrder(customer1, [laptop, tshirt]);
console.log("\nИнформация о заказах:");
console.log(order1.getOrderInfo());
console.log(order2.getOrderInfo());
console.log(order3.getOrderInfo());
// Получаем сводку по заказу с помощью Pick
const summary = getOrderSummary(order1);
console.log("\nСводка по заказу #1:", summary);
// Поиск заказов покупателя
console.log(`\nЗаказы покупателя ${customer1.name}:`);
const customerOrders = orderManager.getOrdersByCustomer(customer1.id);
customerOrders.forEach(o => console.log(o.getOrderInfo()));
// Демонстрация Omit<Product, 'id'> — копия товара без id
const phoneCopy = createProductCopyWithoutId(phone);
console.log("\nКопия товара без ID (метод getInfo работает):");
console.log(phoneCopy.getInfo());
// Демонстрация Partial — обновление товара
console.log("\nОбновление товара (изменение цены и описания):");
updateProduct(phone, { price: 28000, description: "Смартфон со скидкой" });
console.log(phone.getInfo());
