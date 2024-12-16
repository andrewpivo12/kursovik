//const API_BASE_URL = "http://localhost:8080/api";
const openModalButton = document.getElementById("open-create-modal");
const closeModalButton = document.getElementById("close-modal");
const cancel = document.getElementById("cancel-modal");
const modal = document.getElementById("create-product-modal");
const modalTitle = document.getElementById('modal-title');
// Загружаем продукты
function loadProducts() {
    fetch(`${API_BASE_URL}/products`)
        .then(response => response.json())
        .then(data => {
            const productsTable = document.querySelector('#products-table tbody');
            productsTable.innerHTML = "";
            data.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.amount}</td>
                    <td>${product.price}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Редактировать</button>
                        <button onclick="deleteProduct(${product.id})">Удалить</button>
                    </td>
                `;
                productsTable.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка при загрузке продуктов:", error));
}
function openModal(product = {}) {
    modal.style.display = "block"; // Показать окно

    // Устанавливаем значения по умолчанию (пустые при добавлении)
    const { name = '', amount = 0, price = 0 } = product;
    document.getElementById('product-name').value = name;
    document.getElementById('product-amount').value = amount;
    document.getElementById('product-price').value = price;

    currentSupplierId = product.id || null; // Сохраняем ID или null для добавления
}
function editProduct(productId) {
    modalTitle.textContent = "Редактировать продукт";
    // Загружаем данные поставщика и открываем окно с заполнением данных
    fetch(`${API_BASE_URL}/products/${productId}`)
        .then((response) => response.json())
        .then((product) => openModal(product))
        .catch((error) => console.error("Ошибка при загрузке продукта:", error));

    /*<fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            amount: newAmount,
            price: newPrice
        })
    })
        .then(() => loadProducts())
        .catch(error => console.error("Ошибка при редактировании продукта:", error));*/
}
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        productForm.reset();
    }
});
// Открытие модального окна
openModalButton.addEventListener("click", () => {
    modal.style.display = "block";// Загрузить данные в селекторы модального окна
});

// Закрытие модального окна
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
    productForm.reset();
});
cancel.addEventListener("click", () => {
    modal.style.display = "none";
    productForm.reset();
});

// Добавление продукта
const productForm = document.querySelector('#product-form');
productForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const amount = document.getElementById('product-amount').value
    const price = document.getElementById('product-price').value
    if (currentSupplierId) {
        // Если есть ID, то выполняется редактирование
        fetch(`${API_BASE_URL}/products/${currentSupplierId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, amount, price }),
        })
            .then(() => {
                loadProducts(); // Обновляем список
                modal.style.display = "none";
                productForm.reset(); // Закрываем модальное окно
            })
            .catch((error) => console.error("Ошибка при обновлении поставщика:", error));
    } else {
        // Если ID нет, выполняем добавление
        fetch(`${API_BASE_URL}/suppliers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, contactInfo }),
        })
            .then(() => {
                loadProducts(); // Обновляем список
                modal.style.display = "none";
                productForm.reset(); // Закрываем модальное окно
            })
            .catch((error) => console.error("Ошибка при добавлении поставщика:", error));
    }
});

// Удаление продукта
function deleteProduct(productId) {
    if (confirm("Вы уверены, что хотите удалить этот продукт?")) {
        fetch(`${API_BASE_URL}/products/${productId}`, { method: 'DELETE' })
            .then(() => loadProducts())
            .catch(error => console.error("Ошибка при удалении продукта:", error));
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', loadProducts);
