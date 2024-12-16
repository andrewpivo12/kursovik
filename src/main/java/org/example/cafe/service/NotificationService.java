package org.example.cafe.service;

import org.example.cafe.model.Inventory;
import org.example.cafe.model.Notification;
import org.example.cafe.repository.InventoryRepository;
import org.example.cafe.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cafe.model.Product;
import org.example.cafe.repository.ProductRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;
@Service
public class NotificationService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ProductRepository productRepository;

    // Проверить уровни запасов
    public void checkLowProduct() {
        List<Product> inventories = productRepository.findAll();
        for (Product product : inventories) {
            if (product.getAmount() < 10) {
                String message = "Запас " + product.getName() + " ниже минимума (" + product.getAmount() + " ед.).";

                // Проверяем, есть ли уже активное уведомление
                if (notificationRepository.findFirstByMessageAndTypeAndLevelAndIsResolvedFalse(
                        message, "запасы", "warning").isPresent()) {
                    continue; // Если уведомление уже существует, пропускаем создание
                }

                // Создаем новое уведомление
                Notification notification = new Notification();
                notification.setMessage(message);
                notification.setLevel("warning");
                notification.setType("запасы");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setResolved(false);
                notificationRepository.save(notification);
            }
        }
    }

    // Удаление решённых уведомлений (вызывается при инвентаризации)
    public void cleanupResolvedNotifications() {
        notificationRepository.deleteByIsResolvedTrue();
    }

    public void checkExpiryDates() {
        List<Inventory> inventories = inventoryRepository.findAll();
        for (Inventory inventory : inventories) {
            if (inventory.getExpirationDate() != null && inventory.getExpirationDate().isBefore(LocalDate.now().plusDays(3))) {
                String message = "Срок годности продукта " + inventory.getProduct().getName() + " истекает: " + inventory.getExpirationDate();

                // Проверяем, есть ли уже активное уведомление
                if (notificationRepository.findFirstByMessageAndTypeAndLevelAndIsResolvedFalse(
                        message, "срок годности", "critical").isPresent()) {
                    continue; // Уведомление уже существует
                }

                // Создаем новое уведомление
                Notification notification = new Notification();
                notification.setMessage(message);
                notification.setLevel("critical");
                notification.setType("срок годности");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setResolved(false);
                notificationRepository.save(notification);
            }
        }
    }
}
