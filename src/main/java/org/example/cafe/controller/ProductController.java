package org.example.cafe.controller;

import jakarta.transaction.Transactional;
import org.example.cafe.model.Product;
import org.example.cafe.repository.ProductRepository;
import org.example.cafe.repository.SupplyRepository;
import org.example.cafe.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.validation.BindValidationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private SupplyRepository supplyRepository;
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @Transactional
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setAmount(updatedProduct.getAmount());
        return productRepository.save(product);
    }
    @Transactional
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        inventoryRepository.deleteByProductId(id);
        supplyRepository.deleteByProductId(id);
        productRepository.deleteById(id);

    }
}
