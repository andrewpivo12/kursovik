package org.example.cafe.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message; // Сообщение уведомления
    private String level; // Уровень уведомления: "info", "warning", "critical"
    private String type; // Тип уведомления: "запасы", "качество"
    private LocalDateTime createdAt; // Время создания

    private boolean isResolved; // Сонлено ли уведомление (по умолчанию false)
    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public String getLevel() {
        return level;
    }
    public void setLevel(String level) {
        this.level = level;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isResolved() {
        return isResolved;
    }
    public void setResolved(boolean resolved) {
        isResolved = resolved;
    }
}
