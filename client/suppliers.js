// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    loadSuppliers(); // Загружаем текущих поставщиков при загрузке страницы

    // Кнопка "Добавить" вызывает модальное окно
    const addSupplierButton = document.getElementById('add-supplier-button');
    addSupplierButton.addEventListener('click', () => openModalForAdding());
});

// Переменные для модального окна
const modal = document.getElementById('edit-supplier-modal');
const modalTitle = document.getElementById('modal-title');
const editSupplierForm = document.getElementById('edit-supplier-form');
const closeModalButton = document.getElementById('close-modal');
const cancelModalButton = document.getElementById('cancel-modal');
let currentSupplierId = null; // Определяет, идёт добавление или редактирование

// Функция для открытия модального окна
function openModal(supplier = {}) {
    modal.style.display = "block"; // Показать окно

    // Устанавливаем значения по умолчанию (пустые при добавлении)
    const { name = '', contactInfo = '' } = supplier;
    document.getElementById('edit-supplier-name').value = name;
    document.getElementById('edit-supplier-contact').value = contactInfo;

    currentSupplierId = supplier.id || null; // Сохраняем ID или null для добавления
}

// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = "none"; // Скрываем окно
    editSupplierForm.reset(); // Сбрасываем форму
    currentSupplierId = null; // Сбрасываем ID
}

// Добавление слушателей закрытия модального окна
closeModalButton.addEventListener('click', closeModal);
cancelModalButton.addEventListener('click', closeModal);

// Закрытие модального окна при клике вне его области
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Открытие модального окна в режиме добавления
function openModalForAdding() {
    modalTitle.textContent = "Добавить поставщика"; // Заголовок окна для добавления
    openModal(); // Открываем пустое окно
}

// Открытие модального окна в режиме редактирования
function editSupplier(supplierId) {
    modalTitle.textContent = "Редактировать поставщика"; // Заголовок окна для редактирования

    // Загружаем данные поставщика и открываем окно с заполнением данных
    fetch(`${API_BASE_URL}/suppliers/${supplierId}`)
        .then((response) => response.json())
        .then((supplier) => openModal(supplier))
        .catch((error) => console.error("Ошибка при загрузке поставщика:", error));
}

// Обработка отправки формы (для добавления или редактирования)
editSupplierForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const name = document.getElementById('edit-supplier-name').value;
    const contactInfo = document.getElementById('edit-supplier-contact').value;

    if (currentSupplierId) {
        // Если есть ID, то выполняется редактирование
        fetch(`${API_BASE_URL}/suppliers/${currentSupplierId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, contactInfo }),
        })
            .then(() => {
                loadSuppliers(); // Обновляем список
                closeModal(); // Закрываем модальное окно
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
                loadSuppliers(); // Обновляем список
                closeModal(); // Закрываем модальное окно
            })
            .catch((error) => console.error("Ошибка при добавлении поставщика:", error));
    }
});

// Загрузка поставщиков
function loadSuppliers() {
    fetch(`${API_BASE_URL}/suppliers`)
        .then((response) => response.json())
        .then((data) => {
            const suppliersTable = document.querySelector("#suppliers-table tbody");

            suppliersTable.innerHTML = ""; // Удаляем старые данные

            // Заполняем таблицу данными поставщиков
            data.forEach((supplier) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${supplier.id}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.contactInfo}</td>
                    <td>
                        <button onclick="editSupplier(${supplier.id})">Редактировать</button>
                        <button onclick="deleteSupplier(${supplier.id})">Удалить</button>
                    </td>
                `;
                suppliersTable.appendChild(row);
            });
        })
        .catch((error) => console.error("Ошибка при загрузке поставщиков:", error));
}

// Удаление поставщика
function deleteSupplier(supplierId) {
    if (confirm("Вы уверены, что хотите удалить этого поставщика?")) {
        fetch(`${API_BASE_URL}/suppliers/${supplierId}`, { method: "DELETE" })
            .then(() => loadSuppliers())
            .catch((error) => console.error("Ошибка при удалении поставщика:", error));
    }
}
