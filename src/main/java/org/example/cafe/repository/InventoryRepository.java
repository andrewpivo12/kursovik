package org.example.cafe.repository;

import org.example.cafe.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Inventory findByProductId(Long productId);

    boolean existsByProductId(Long id);

    void deleteByProductId(Long id);

    void deleteBySupplierId(Long id);
}
