enum ProductCategory {
    Electronics = "Электроника",
    Clothing = "Одежда",
    Books = "Книги",
    Sports = "Спорт",
    Other = "Разное"
}

class Product {
    public readonly id: number;
    public name: string;
    public price: number;
    public description?: string;
    public category: ProductCategory;

    constructor(id: number, name: string, price: number, category: ProductCategory, description?: string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
    }

    getInfo(): string {
        let info = `ID: ${this.id}, Название: ${this.name}, Цена: ${this.price} руб., Категория: ${this.category}`;
        if (this.description) {
            info += `, Описание: ${this.description}`;
        }
        return info;
    }
}

type ProductCreationData = Omit<Product, 'id' | 'getInfo'>;

class Catalog {
    private products: Product[] = [];

    constructor() {
        this.products = [];
    }

    // Добавление товара (принимает данные без id)
    addProduct(productData: ProductCreationData): Product {
        const newId = this.products.length > 0 
            ? Math.max(...this.products.map(p => p.id)) + 1 
            : 1;
        const newProduct = new Product(
            newId,
            productData.name,
            productData.price,
            productData.category,
            productData.description
        );
        this.products.push(newProduct);
        return newProduct;
    }

    removeProduct(id: number): boolean {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            return true;
        }
        return false;
    }

    getProductById(id: number): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    getAllProducts(): Product[] {
        return [...this.products];
    }

    getProductsByCategory(category: ProductCategory): Product[] {
        return this.products.filter(p => p.category === category);
    }
}

// Класс Order (дженерик)
class Order<T extends Product> {
    public readonly id: number;
    public products: T[];
    public totalPrice: number;

    constructor(id: number, products: T[]) {
        this.id = id;
        this.products = products;
        this.totalPrice = this.calculateTotalPrice();
    }

    calculateTotalPrice(): number {
        return this.products.reduce((sum, product) => sum + product.price, 0);
    }

    getOrderInfo(): string {
        const productList = this.products.map(p => `${p.name} (${p.price} руб.)`).join(', ');
        return `Заказ #${this.id}: товары: [${productList}], общая стоимость: ${this.totalPrice} руб.`;
    }
}

class Customer {
    public readonly id: number;
    public name: string;
    public email: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    getCustomerInfo(): string {
        return `Покупатель: ${this.name} (ID: ${this.id}), email: ${this.email}`;
    }
}

class OrderManager {
    private orders: Order<Product>[] = [];
    private orderCustomerMap: Map<number, number> = new Map(); // orderId -> customerId

    constructor() {
        this.orders = [];
    }

    // Создание нового заказа с привязкой к покупателю
    createOrder(customer: Customer, products: Product[]): Order<Product> {
        const newId = this.orders.length > 0 
            ? Math.max(...this.orders.map(o => o.id)) + 1 
            : 1;
        const newOrder = new Order(newId, products);
        this.orders.push(newOrder);
        this.orderCustomerMap.set(newOrder.id, customer.id);
        return newOrder;
    }

    getOrderById(id: number): Order<Product> | undefined {
        return this.orders.find(o => o.id === id);
    }

    getAllOrders(): Order<Product>[] {
        return [...this.orders];
    }

    getOrdersByCustomer(customerId: number): Order<Product>[] {
        const orderIds = Array.from(this.orderCustomerMap.entries())
            .filter(([_, custId]) => custId === customerId)
            .map(([orderId, _]) => orderId);
        return this.orders.filter(order => orderIds.includes(order.id));
    }
}

// 1. Partial<Product> — обновление товара с необязательными полями
function updateProduct(product: Product, updates: Partial<Product>): Product {
    if (updates.name !== undefined) product.name = updates.name;
    if (updates.price !== undefined) product.price = updates.price;
    if (updates.description !== undefined) product.description = updates.description;
    if (updates.category !== undefined) product.category = updates.category;
    return product;
}

// 2. Omit
function createProductCopyWithoutId(product: Product): Omit<Product, 'id'> {
    return {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        getInfo: function() {
            let info = `Название: ${this.name}, Цена: ${this.price} руб., Категория: ${this.category}`;
            if (this.description) {
                info += `, Описание: ${this.description}`;
            }
            return info;
        }
    };
}

// 3. Pick сводка по заказу
type OrderSummary = Pick<Order<Product>, 'id' | 'totalPrice'>;

function getOrderSummary(order: Order<Product>): OrderSummary {
    return {
        id: order.id,
        totalPrice: order.totalPrice
    };
}




const catalog = new Catalog();

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

const customer1 = new Customer(1, "Иван Петров", "ivan@example.com");
const customer2 = new Customer(2, "Мария Смирнова", "maria@example.com");

const orderManager = new OrderManager();

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

// Omit
const phoneCopy = createProductCopyWithoutId(phone);
console.log("\nКопия товара без ID (метод getInfo работает):");
console.log(phoneCopy.getInfo());

// Partial
console.log("\nОбновление товара (изменение цены и описания):");
updateProduct(phone, { price: 28000, description: "Смартфон со скидкой" });
console.log(phone.getInfo());