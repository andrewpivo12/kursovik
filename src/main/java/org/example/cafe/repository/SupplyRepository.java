package org.example.cafe.repository;

import org.example.cafe.model.Supply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplyRepository extends JpaRepository<Supply, Long> {
    void deleteByProductId(Long id);

    void deleteBySupplierId(Long id);
}
