package org.example.cafe.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplies")
public class Supply  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @Column
    private int quantity;

    private LocalDateTime creationDate;
    private LocalDateTime deliveryDate;
    private LocalDate expirationDate;

    @Column
    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private SupplyStatus status; // Статус поставки

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Long getId() {
        return id;
    }


    public Supplier getSupplier() {
        return supplier;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setStatus(SupplyStatus status) {
        this.status = status;
    }

    public SupplyStatus getStatus() {
        return status;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setDeliveryDate(LocalDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public LocalDateTime getDeliveryDate() {
        return deliveryDate;
    }
}