const API_BASE_URL = "http://localhost:8081/api"; // Адрес вашего сервера

// Отобразить список продуктов и их запасы
function loadProducts() {
    fetch(`${API_BASE_URL}/inventories`)
        .then(response => response.json())
        .then(data => {
            const productsTable = document.querySelector('#products-table tbody');
            productsTable.innerHTML = "";

            // Добавляем строки для каждого продукта
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.product.id}</td> <!-- ID продукта -->
                    <td>${item.product.name}</td>
                    <td>${item.product.supplier?.id || 'N/A'}</td> <!-- ID поставщика, если доступно -->
                    <td>${item.quantity}</td>
                    <td>
                        <button onclick="reduceStock(${item.product.id}, 1)">-1</button>
                        <button onclick="reduceStock(${item.product.id}, -1)">+1</button>
                        <button onclick="editProduct(${item.product.id})">Редактировать</button>
                        <button onclick="deleteProduct(${item.product.id})">Удалить</button>
                    </td>
                `;
                productsTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Ошибка при загрузке продуктов:", error);
        });
}


// Уменьшить или увеличить запас продукта
function reduceStock(productId, adjustment) {
    fetch(`${API_BASE_URL}/inventories/${productId}?adjustment=${adjustment}`, {
        method: "PUT"
    })
        .then(() => loadProducts()) // Перезагружаем таблицу после изменения
        .catch(error => console.error("Ошибка при обновлении запасов:", error));
}

// Обновить запасы через форму
const inventoryForm = document.querySelector('#inventory-form');
inventoryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.querySelector('#product-id').value;
    const quantity = document.querySelector('#quantity').value;

    fetch(`${API_BASE_URL}/inventories/${productId}?quantity=${quantity}`, {
        method: "POST"
    })
        .then(() => {
            loadProducts();
            inventoryForm.reset();
        })
        .catch(error => console.error("Ошибка при добавлении запасов:", error));
});

// Проверить продукты с низкими запасами
const checkLowInventoryButton = document.querySelector('#check-low-inventory');
checkLowInventoryButton.addEventListener('click', function () {
    const threshold = document.querySelector('#threshold').value;

    fetch(`${API_BASE_URL}/inventories/low-inventory?threshold=${threshold}`)
        .then(response => response.json())
        .then(data => {
            const lowInventoryList = document.querySelector('#low-inventory-list');
            lowInventoryList.innerHTML = "";

            // Добавляем в список
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.product.name} — ${item.quantity} шт.`;
                lowInventoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Ошибка при проверке низких запасов:", error));
});
// Добавление нового продукта
const productForm = document.querySelector('#product-form');
productForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Останавливаем стандартное поведение формы

    // Получаем данные из формы
    const name = document.querySelector('#product-name').value;
    const description = document.querySelector('#product-description').value;
    const price = parseFloat(document.querySelector('#product-price').value);
    //console.log(JSON.stringify({name, description, price}));
    // Отправляем данные на API
    fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description, price }) // Преобразуем данные в JSON
    })
        .then(() => {
            loadProducts(); // Перезагружаем список продуктов и запасов
            productForm.reset(); // Очищаем форму
        })
        .catch(error => console.error("Ошибка при создании продукта:", error));
});
// Добавление новой поставки
const supplyForm = document.querySelector('#supply-form');
supplyForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Останавливаем стандартное поведение формы

    // Получаем данные из формы
    const productId = document.querySelector('#supply-product-id').value;
    const supplierId = document.querySelector('#supply-supplier-id').value;
    const quantity = document.querySelector('#supply-quantity').value;

    // Создаем новую поставку
    fetch(`${API_BASE_URL}/supplies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ product: { id: productId }, supplier: { id: supplierId }, quantity }) // Преобразуем данные в JSON
    })
        .then(() => {
            loadProducts(); // Перезагружаем список продуктов и запасов
            supplyForm.reset(); // Очищаем форму
        })
        .catch(error => console.error("Ошибка при добавлении поставки:", error));
});

// Загрузка начальных данных
document.addEventListener('DOMContentLoaded', loadProducts);
