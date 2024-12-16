package org.example.cafe.service;

import org.example.cafe.model.*;
import org.example.cafe.repository.InventoryRepository;
import org.example.cafe.repository.ProductRepository;
import org.example.cafe.repository.SupplierRepository;
import org.example.cafe.repository.SupplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupplyService {

    @Autowired
    private SupplyRepository supplyRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Supply createSupply(Long productId, Long supplierId, int quantity, LocalDateTime deliveryDate, LocalDate expirationDate) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Продукт не найден"));
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Поставщик не найден"));

        // Рассчитываем общую стоимость поставки
        double totalPrice = product.getPrice() * quantity;

        Supply supply = new Supply();
        supply.setProduct(product);
        supply.setSupplier(supplier);
        supply.setQuantity(quantity);
        supply.setCreationDate(LocalDateTime.from(LocalDateTime.now()));
        supply.setDeliveryDate(LocalDateTime.from(deliveryDate));
        supply.setTotalPrice(totalPrice);
        supply.setExpirationDate(LocalDate.from(expirationDate));
        supply.setStatus(SupplyStatus.PENDING);

        return supplyRepository.save(supply);

    }
    @Scheduled(fixedRate = 60000)
    public void updateSupplyStatus() {
        List<Supply> supplies = supplyRepository.findAll();
        for (Supply supply : supplies) {
            if (supply.getDeliveryDate().isBefore(LocalDateTime.now()) && supply.getStatus() == SupplyStatus.PENDING) {
                // Обновляем статус на DELIVERED
                supply.setStatus(SupplyStatus.DELIVERED);
                Inventory stockItem = new Inventory(
                        supply.getProduct(),
                        supply.getSupplier(),
                        supply.getTotalPrice(),
                        supply.getQuantity(),
                        supply.getExpirationDate()
                );
                inventoryRepository.save(stockItem);
                // Обновляем количество продукта на складе
                Product product = supply.getProduct();
                product.setAmount(product.getAmount() + supply.getQuantity());
                productRepository.save(product);

                supplyRepository.save(supply);
            }
        }
    }

    public List<Supply> getAllSupplies() {
        return supplyRepository.findAll();
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    public boolean cancelSupply(Long orderId) {
        Supply supply = supplyRepository.findById(orderId).orElse(null);
        if (supply != null && supply.getStatus() == SupplyStatus.PENDING) {
            supply.setStatus(SupplyStatus.CANCELED);
            supplyRepository.save(supply);
            return true;
        }
        return false; // Заказ не найден или уже отменен/другой статус
    }
}

