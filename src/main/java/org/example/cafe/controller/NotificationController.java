package org.example.cafe.controller;

import org.example.cafe.model.Notification;
import org.example.cafe.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Получить последние уведомления
    @GetMapping
    public List<Notification> getActiveNotifications() {
        return notificationRepository.findByIsResolvedFalseOrderByCreatedAtDesc();
    }


    // Удалить уведомления старше 7 дней (по запросу)
    @DeleteMapping("/cleanup")
    public String cleanupOldNotifications() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        notificationRepository.deleteByCreatedAtBefore(sevenDaysAgo);
        return "Старые уведомления удалены.";
    }
    // Закрыть уведомление (пометить как решённое)
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<String> resolveNotification(@PathVariable Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification existingNotification = notification.get();
            existingNotification.setResolved(true); // Помечаем как решённое
            notificationRepository.save(existingNotification);
            return ResponseEntity.ok("Уведомление успешно закрыто.");
        } else {
            return ResponseEntity.status(404).body("Уведомление не найдено.");
        }
    }
}
