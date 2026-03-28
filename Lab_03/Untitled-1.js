// Задание 1. Симулятор "Службы доставки" (Promise Chaining)
const checkStock = (item) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const inStock = item === "пицца";
            inStock ? resolve(`Товар "${item}" есть на складе`) : reject(`Товар "${item}" отсутствует`);
        }, 1000);
    });
};
const processPayment = (amount) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const balance = 1000;
            amount <= balance ? resolve(amount) : reject(`Недостаточно средств. Нужно ${amount}, доступно ${balance}`);
        }, 2000);
    });
};
const deliverOrder = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Заказ доставлен!");
        }, 1500);
    });
};
checkStock("пицца")
    .then((stockMsg) => {
    console.log(stockMsg);
    return processPayment(500);
})
    .then((paymentAmount) => {
    console.log(`Оплачено ${paymentAmount} руб.`);
    return deliverOrder();
})
    .then((deliveryMsg) => {
    console.log(deliveryMsg);
})
    .catch((error) => {
    console.error("Ошибка:", error);
})
    .finally(() => {
    console.log("Спасибо за заказ, приходите еще!");
});
// Задание 2. Гонка запросов (Promise.race)
const fetchFast = () => {
    return new Promise((resolve) => setTimeout(() => resolve("Быстрый запрос"), 500));
};
const fetchSlow = () => {
    return new Promise((resolve) => setTimeout(() => resolve("Медленный запрос"), 2000));
};
Promise.race([fetchFast(), fetchSlow()])
    .then((result) => console.log("Победитель:", result))
    .catch((err) => console.error(err));
// Реальные ситуации: таймаут запроса (если ответ не пришёл за N мс), 
// выбор самого быстрого источника данных (например, несколько CDN).
// Задание 3. "Умный" агрегатор (Promise.allSettled)
const promises = [
    Promise.resolve("Успех 1"),
    Promise.reject("Ошибка 1"),
    Promise.resolve("Успех 2"),
    Promise.reject("Ошибка 2"),
    Promise.resolve("Успех 3"),
];
Promise.allSettled(promises).then((results) => {
    const successfulResults = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
    console.log("Только успешные операции:", successfulResults);
});
// Почему allSettled лучше all? 
// allSettled ожидает выполнения всех промисов и возвращает информацию о каждом,
// что позволяет обработать успешные результаты даже при наличии ошибок.
// Promise.all прерывается на первой ошибке, и мы теряем результаты остальных промисов.
// Задание 4. Логическая задача "Микрозадачи"
console.log("Начало");
setTimeout(() => console.log("Таймаут"), 0);
Promise.resolve()
    .then(() => console.log("Промис 1"))
    .then(() => console.log("Промис 2"));
console.log("Конец");
// Порядок вывода:
// Начало
// Конец
// Промис 1
// Промис 2
// Таймаут
// Объяснение:
// Сначала выполняется синхронный код (console.log).
// Затем микротаски (промисы) – они ставятся в очередь микротасков и выполняются перед макротасками.
// Макротаски (setTimeout) выполняются после того, как очередь микротасков опустеет.
// Задание 5. Рефакторинг на Async/Await
async function getData() {
    try {
        const response = await fetch("https://api.example.com/data");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    }
    catch (err) {
        console.error("Ошибка:", err);
    }
}
// Задание 6. Параллельный запуск с ограничением
async function limitRequests(tasks, limit) {
    const results = [];
    const running = new Set();
    for (const task of tasks) {
        // Запускаем задачу и сохраняем промис
        const p = task().then((result) => {
            results.push(result);
            return result;
        });
        running.add(p);
        // После завершения промиса удаляем его из набора
        p.finally(() => running.delete(p));
        // Если количество запущенных достигло лимита, ждём завершения одного из них
        if (running.size >= limit) {
            await Promise.race(running);
        }
    }
    // Ждём завершения всех оставшихся промисов
    await Promise.all(running);
    return results;
}
// Пример использования
const imageUrls = Array.from({ length: 10 }, (_, i) => `image${i + 1}.jpg`);
const loadImage = (url) => {
    return new Promise((resolve) => {
        console.log(`Начинаю загрузку: ${url}`);
        setTimeout(() => {
            console.log(`Загружено: ${url}`);
            resolve(url);
        }, Math.random() * 2000);
    });
};
const tasks = imageUrls.map((url) => () => loadImage(url));
limitRequests(tasks, 3).then((loaded) => {
    console.log("Все загружены:", loaded);
});
// Ответы на теоретические вопросы
/*
1. Асинхронность в JavaScript – это способность выполнять операции, не блокируя основной поток выполнения.
   Это достигается за счёт event loop, очередей макро- и микрозадач, позволяя обрабатывать длительные операции (сеть, таймеры) параллельно.

2. Объект Promise – это объект, представляющий результат асинхронной операции.
   Состояния: pending (ожидание), fulfilled (успешно выполнен), rejected (ошибка).
   Переход возможен только из pending в fulfilled или rejected, обратный переход невозможен.

3. resolve и reject – это функции, вызываемые внутри executor’а промиса.
   resolve переводит промис в состояние fulfilled, reject – в rejected.
   Если вызвать оба, то промис изменит состояние только один раз (первый вызов).

4. .then() – обрабатывает успешное выполнение, возвращает новый промис.
   .catch() – обрабатывает ошибку (сокращение для .then(null, onRejected)).
   .finally() – выполняется всегда после завершения промиса, не меняя его результат.

5. Чейнинг – это последовательное соединение .then().
   Каждый .then() возвращает новый промис, и результат предыдущего .then() передаётся в следующий
   (если возвращено простое значение) или ожидается, если возвращён промис.

6. Если внутри .then() вернуть:
   - Простое число – следующий .then() получит это число.
   - Другой промис – следующий .then() будет ждать его завершения.
   - undefined – следующий .then() получит undefined.

7. Ошибка проходит по цепочке, пока не встретит .catch().
   Если .catch() стоит в конце, то ошибка из любого предыдущего .then() будет обработана.

8. Promise.all() – завершается при первой ошибке, теряя результаты всех остальных промисов.
   Promise.allSettled() – ждёт выполнения всех промисов, возвращая массив с результатами (успех/ошибка).
   Использование all() может привести к потере данных, если один из запросов завершился неудачно.

9. Promise.race() – завершается при первом завершённом (успех или ошибка). Используется для таймаутов.
   Promise.any() – завершается при первом успешном, игнорирует ошибки до тех пор, пока все не будут отклонены.

10. async-функция всегда возвращает Promise. Если внутри явно не возвращается промис,
    то возвращаемое значение автоматически оборачивается в разрешённый промис.

11. await – приостанавливает выполнение async-функции до разрешения промиса, не блокируя основной поток.
    Функция возобновляется после того, как промис завершится.

12. Обработка ошибок в async/await осуществляется через try...catch.
    Если не использовать try...catch, ошибка промиса останется необработанной и приведёт к rejection.

13. Микрозадачи – очередь, в которую попадают колбэки промисов, queueMicrotask и т.д.
    Микрозадачи выполняются сразу после завершения текущего синхронного кода, перед макрозадачами (setTimeout, setInterval).

14. Путь выполнения:
    1. Синхронный код (стек).
    2. Микрозадачи (все, включая цепочки промисов).
    3. Рендеринг (обновление UI).
    4. Одна макрозадача (например, setTimeout).
    Затем цикл повторяется. Промисы обрабатываются в фазе микрозадач.
*/ 
