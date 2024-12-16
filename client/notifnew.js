document.addEventListener('DOMContentLoaded', () => {
    const notificationsCount = document.getElementById('notifications-count');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    const notificationsLink = document.getElementById('notifications-link');

    // Инициализация счетчика
// Функция загрузки уведомлений
function loadNotifications() {
    fetch(`${API_BASE_URL}/notifications`)
        .then(response => response.json())
        .then(data => {
            notificationsCount.textContent = data.length; // Обновляем счетчик уведомлений
            notificationsDropdown.innerHTML = ""; // Очищаем меню

            if (data.length === 0) {
                const noNotificationsItem = document.createElement("li");
                noNotificationsItem.textContent = "Нет новых уведомлений.";
                notificationsDropdown.appendChild(noNotificationsItem);
                return;
            }

            data.forEach(notification => {
                const listItem = document.createElement("li");
                listItem.textContent = notification.message;

                // Добавляем стиль важности
                listItem.classList.add(notification.level); // warning, critical, etc.

                // Кнопка "Закрыть"
                const closeButton = document.createElement("button");
                closeButton.textContent = "Закрыть";
                closeButton.classList.add("close-button");
                closeButton.addEventListener("click", () => {
                    closeNotification(notification.id, listItem);
                });

                listItem.appendChild(closeButton);
                notificationsDropdown.appendChild(listItem);
            });
        })
        .catch(error => console.error("Ошибка загрузки уведомлений:", error));
}
function closeNotification(notificationId, listItem) {
    fetch(`${API_BASE_URL}/notifications/${notificationId}/resolve`, { method: "PATCH" })
        .then(response => {
            if (response.ok) {
                listItem.remove(); // Удаляем уведомление из меню
                const count = parseInt(notificationsCount.textContent) - 1;
                notificationsCount.textContent = count >= 0 ? count : 0;
            } else {
                console.error("Ошибка при закрытии уведомления.");
            }
        })
        .catch(error => console.error("Ошибка при отправке запроса на закрытие уведомления:", error));
}
notificationsLink.addEventListener('click', (event) => {
    event.preventDefault();
    notificationsDropdown.classList.toggle('visible'); // Тоггл видимости меню
});})