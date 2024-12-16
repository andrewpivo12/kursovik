package org.example.cafe.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
    private double priceall;
    private int quantity;
    private LocalDate expirationDate;

    public Inventory() {}

    public Inventory(Product product, Supplier supplier, double priceall, int quantity, LocalDate expirationDate) {
        this.product = product;
        this.supplier = supplier;
        this.priceall = priceall;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
    }
    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public double getPriceall() {
        return priceall;
    }

    public void setPriceall(double priceall) {
        this.priceall = priceall;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    // Конструкторы, геттеры и сеттеры

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
