package org.example.cafe.service;

import org.aspectj.weaver.ast.Not;
import org.example.cafe.model.Inventory;
import org.example.cafe.model.Notification;
import org.example.cafe.repository.InventoryRepository;
import org.example.cafe.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.example.cafe.service.NotificationService;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryCheckerService {
    private NotificationService service;
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    public InventoryCheckerService(NotificationService notificationService){
        this.service = notificationService;
    }
    // Проверка низкого уровня запасов каждую минуту
    @Scheduled(fixedRate = 60000) // Интервал в миллисекундах
    public void checking(){
    service.checkLowProduct();}
    @Scheduled(fixedRate = 86400000) // Каждые 24 часа
    public void scheduledExpiryCheck() {
        service.checkExpiryDates();
    }

}
