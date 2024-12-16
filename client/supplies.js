const modal = document.getElementById("create-supply-modal");
const openModalButton = document.getElementById("open-create-modal");
const closeModalButton = document.getElementById("close-create-modal");
const modalSupplyForm = document.getElementById("modalSupplyForm");
const modalProductIdSelect = document.getElementById("modalProductId");
const modalSupplierIdSelect = document.getElementById("modalSupplierId");
const suppliesTableBody = document.getElementById("suppliesTable").querySelector("tbody")

// Переменные для пагинации
let currentPage = 1;
const recordsPerPage = 5; // Показывать только 5 записей на странице

// Открытие модального окна
openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
    loadProductsAndSuppliersForModal(); // Загрузить данные в селекторы модального окна
});

// Закрытие модального окна
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Закрытие модального окна при клике вне него
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
async function cancelSupply(supplyId) {

    fetch(`${API_BASE_URL}/supplies/${supplyId}/cancel`, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

        },

    })

    .then(response => {

        if (response.ok) {

            alert('Поставка успешно отменена!');

            // Перезагрузить список поставок или обновить данные

            loadSupplies();

        } else {

            alert('Не удалось отменить поставку.');

        }

    })

    .catch(error => {

        console.error('Ошибка:', error);

    });

}
// Загрузка продуктов и поставщиков в модальное окно
async function loadProductsAndSuppliersForModal() {
    try {
        // Загрузка продуктов
        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        const products = await productsResponse.json();
        modalProductIdSelect.innerHTML = "";
        products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = `${product.name} (в наличии: ${product.amount})`;
            modalProductIdSelect.appendChild(option);
        });

        // Загрузка поставщиков
        const suppliersResponse = await fetch(`${API_BASE_URL}/supplies/suppliers`);
        const suppliers = await suppliersResponse.json();
        modalSupplierIdSelect.innerHTML = "";
        suppliers.forEach((supplier) => {
            const option = document.createElement("option");
            option.value = supplier.id;
            option.textContent = supplier.name;
            modalSupplierIdSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка загрузки продуктов или поставщиков для модального окна:", error);
    }
}

// Обработка отправки формы в модальном окне
modalSupplyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const productId = modalProductIdSelect.value;
    const supplierId = modalSupplierIdSelect.value;
    const quantity = document.getElementById("modalQuantity").value;
    const deliveryDate = document.getElementById("modalDeliveryDate").value;
    const expirationDate = document.getElementById("modalExpirationDate").value;

    try {
        const response = await fetch(`${API_BASE_URL}/supplies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: parseFloat(productId),
                supplierId: supplierId,
                quantity: parseInt(quantity),
                deliveryDate,
                expirationDate
            })
        });
        if (response.ok) {
            alert("Поставка успешно создана!");
            modal.style.display = "none"; // Закрываем модальное окно
            loadSupplies(); // Перезагружаем поставки
        } else {
            alert("Ошибка при создании поставки.");
        }
    } catch (error) {
        console.error("Ошибка при создании поставки:", error);
    }
});

// Пагинация
async function loadSupplies() {
    try {
        const response = await fetch(`${API_BASE_URL}/supplies`);
        const supplies = await response.json();
        displaySupplies(supplies, currentPage); // Отображаем поставки на первой странице
        setupPagination(supplies);
    } catch (error) {
        console.error("Ошибка при загрузке поставок:", error);
    }
}

// Отображение поставок на текущей странице
function displaySupplies(supplies, page) {
    suppliesTableBody.innerHTML = ""; // Очистить таблицу
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const currentPageSupplies = supplies.slice(startIndex, endIndex);

    currentPageSupplies.forEach((supply) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${supply.id}</td>
            <td>${supply.product.name}</td>
            <td>${supply.supplier.name}</td>
            <td>${supply.quantity}</td>
            <td>${new Date(supply.creationDate).toLocaleString()}</td>
            <td>${new Date(supply.deliveryDate).toLocaleString()}</td>
            <td>${supply.status}</td>
            <td>${supply.totalPrice.toFixed(2)}</td>
            <td><button onclick="cancelSupply(${supply.id})">Отменить заказ</button></td>
        `;
        suppliesTableBody.appendChild(row);
    });
}

// Настройка пагинации
function setupPagination(supplies) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Очистить пагинацию

    const pageCount = Math.ceil(supplies.length / recordsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.toggle("active", i === currentPage);
        button.addEventListener("click", () => {
            currentPage = i;
            displaySupplies(supplies, currentPage); // Отобразить записи для страницы
            setupPagination(supplies); // Обновить активную кнопку
        });
        pagination.appendChild(button);
    }
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", loadSupplies);
