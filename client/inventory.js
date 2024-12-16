//const API_BASE_URL = "http://localhost:8080/api";

// Загрузка данных о запасах
function loadInventory() {
    fetch(`${API_BASE_URL}/inventory`)
        .then(response => response.json())
        .then(data => {
            const inventoryTableBody = document.getElementById("inventoryTable").querySelector("tbody");
            inventoryTableBody.innerHTML = ""; // Очищаем таблицу

            data.forEach(item => {
                // ID
                const row = document.createElement("tr");
                const idCell = document.createElement("td");
                idCell.textContent = item.id
                row.appendChild(idCell);
                // Название продукта
                const nameCell = document.createElement("td");
                nameCell.textContent = item.product.name;
                row.appendChild(nameCell);

                // Количество
                const quantityCell = document.createElement("td");
                quantityCell.textContent = item.quantity > 0
                    ? item.quantity
                    : "Нет в наличии";
                quantityCell.className = item.quantity > 0 ? "" : "out-of-stock";
                row.appendChild(quantityCell);
                const priceCell = document.createElement("td");
                priceCell.textContent = item.priceall;
                row.appendChild(priceCell);
                // Кнопка изменения количества
                const dateCell = document.createElement("td");
                dateCell.textContent = item.expirationDate;
                row.appendChild(dateCell);
                const actionCell = document.createElement("td");
                const updateButton = document.createElement("button");
                const supplierCell = document.createElement("td");
                supplierCell.textContent = item.supplier.name;
                row.appendChild(supplierCell);
                updateButton.textContent = "Обновить";
                // Привязываем изменение
                updateButton.addEventListener("click", () => updateInventory(item.product.id));
                actionCell.appendChild(updateButton);
                row.appendChild(actionCell);

                inventoryTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка при загрузке запасов:", error));
}


// Обновление количества запасов
const inventoryForm = document.querySelector('#inventory-form');
inventoryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.querySelector('#product-id').value;
    const quantity = document.querySelector('#quantity').value;

    fetch(`${API_BASE_URL}/inventory/${productId}?quantity=${quantity}`, {
        method: 'POST'
    })
        .then(() => {
            loadInventory();
            inventoryForm.reset();
        })
        .catch(error => console.error("Ошибка при обновлении запасов:", error));
});

// Увеличение или уменьшение запасов
function adjustInventory(productId, adjustment) {
    fetch(`${API_BASE_URL}/inventory/${productId}?adjustment=${adjustment}`, {
        method: 'PUT'
    })
        .then(() => loadInventory())
        .catch(error => console.error("Ошибка при изменении запасов:", error));
}

// Инициализация
document.addEventListener('DOMContentLoaded', loadInventory);
