package org.example.cafe.controller;

import org.example.cafe.model.Inventory;
import org.example.cafe.model.Product;
import org.example.cafe.repository.InventoryRepository;
import org.example.cafe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    // Получить все запасы
    @GetMapping
    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    // Добавить или обновить запас для продукта
    @PostMapping("/{productId}")
    public Inventory updateInventory(@PathVariable Long productId, @RequestParam int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory == null) {
            inventory = new Inventory();
            inventory.setProduct(product);
        }
        inventory.setQuantity(quantity);

        return inventoryRepository.save(inventory);
    }

    // Получить остаток для конкретного продукта
    @GetMapping("/{productId}")
    public Inventory getInventoryByProductId(@PathVariable Long productId) {
        return inventoryRepository.findByProductId(productId);
    }

    // Уменьшить или увеличить запас
    @PutMapping("/{productId}")
    public Inventory adjustInventory(@PathVariable Long productId, @RequestParam int adjustment) {
        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory == null) {
            throw new RuntimeException("Inventory for this product does not exist");
        }

        inventory.setQuantity(inventory.getQuantity() + adjustment);
        return inventoryRepository.save(inventory);
    }
    // Проверить статус запасов для всех продуктов
    @GetMapping("/low-inventory")
    public List<Inventory> checkLowInventory(@RequestParam int threshold) {
        return inventoryRepository.findAll().stream()
                .filter(inventory -> inventory.getQuantity() < threshold)
                .toList();
    }

}
