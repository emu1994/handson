package com.example.cashflowdashboard.repository;

import com.example.cashflowdashboard.entity.Cashflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CashflowRepository extends JpaRepository<Cashflow, Long> {
    List<Cashflow> findByDateBetweenOrderByDateAsc(LocalDate from, LocalDate to);
}
