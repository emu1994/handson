package com.example.fundportfolio.repository;

import com.example.fundportfolio.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
}
