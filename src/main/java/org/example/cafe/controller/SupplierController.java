package org.example.cafe.controller;

import jakarta.transaction.Transactional;
import org.example.cafe.model.Supplier;
import org.example.cafe.repository.InventoryRepository;
import org.example.cafe.repository.SupplierRepository;
import org.example.cafe.repository.SupplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private SupplyRepository supplyRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Long id) {
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setName(updatedSupplier.getName());
        supplier.setContactInfo(updatedSupplier.getContactInfo());
        return supplierRepository.save(supplier);
    }
    @Transactional
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierRepository.deleteById(id);
        supplyRepository.deleteBySupplierId(id);
        inventoryRepository.deleteBySupplierId(id);
    }
}
