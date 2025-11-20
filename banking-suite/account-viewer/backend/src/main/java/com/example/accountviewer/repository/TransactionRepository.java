package com.example.accountviewer.repository;

import com.example.accountviewer.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountIdOrderByOccurredAtDesc(Long accountId);
}
