package com.example.loanworkflow.repository;

import com.example.loanworkflow.entity.LoanApplication;
import com.example.loanworkflow.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByStatusOrderByIdAsc(LoanStatus status);
    List<LoanApplication> findAllByOrderByIdAsc();
}
