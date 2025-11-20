package com.example.fundportfolio.repository;

import com.example.fundportfolio.entity.Fund;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FundRepository extends JpaRepository<Fund, Long> {
}
