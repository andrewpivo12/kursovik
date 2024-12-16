package org.example.cafe.service;

import org.example.cafe.model.Inventory;
import org.example.cafe.model.Product;
import org.example.cafe.repository.InventoryRepository;
import org.example.cafe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Inventory> getFullInventory() {
        List<Inventory> inventories = inventoryRepository.findAll();
        List<Product> allProducts = productRepository.findAll();

        // Проверяем, у всех ли продуктов есть запись в Inventory
        for (Product product : allProducts) {
            if (!inventoryRepository.existsByProductId(product.getId())) {
                // Если продукта нет в запасах, добавляем его с количеством 0
                Inventory inventory = new Inventory();
                inventory.setProduct(product);
                inventory.setQuantity(0);
                //inventory.setMinLevel(0); // Можно настроить минимальный уровень
                inventoryRepository.save(inventory);
            }
        }

        return inventoryRepository.findAll();
    }

}
