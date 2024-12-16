package org.example.cafe.controller;
import org.example.cafe.model.Supplier;
import org.example.cafe.model.SupplyRequest;
import org.example.cafe.service.SupplyService;
import org.example.cafe.model.Supply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/supplies")
public class SupplyController {

    @Autowired
    private SupplyService supplyService;

    @PostMapping
    public ResponseEntity<Supply> createSupply(@RequestBody SupplyRequest request) {
        LocalDateTime parsedDate = LocalDateTime.parse(request.getDeliveryDate());
        LocalDate parsedExp = LocalDate.parse(request.getExpirationDate());
        Supply createdSupply = supplyService.createSupply(request.getProductId(), request.getSupplierId(), request.getQuantity(), parsedDate, parsedExp);
        return ResponseEntity.ok(createdSupply);
    }
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        boolean result = supplyService.cancelSupply(orderId);
        if (result) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Supply>> getAllSupplies() {
        return ResponseEntity.ok(supplyService.getAllSupplies());
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplyService.getAllSuppliers());
    }
}

