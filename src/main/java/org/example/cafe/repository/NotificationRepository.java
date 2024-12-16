package org.example.cafe.repository;

import org.example.cafe.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Получить последние 10 уведомлений (по убыванию даты создания)
    List<Notification> findTop10ByOrderByCreatedAtDesc();
    List<Notification> findByIsResolvedFalseOrderByCreatedAtDesc();
    // Удаление уведомлений старше определённой даты
    void deleteByCreatedAtBefore(LocalDateTime dateTime);
    Optional<Notification> findFirstByMessageAndTypeAndLevelAndIsResolvedFalse(
            String message, String type, String level);

    // Установить уведомления как решённые по типу и уровню
    void deleteByIsResolvedTrue();
}
