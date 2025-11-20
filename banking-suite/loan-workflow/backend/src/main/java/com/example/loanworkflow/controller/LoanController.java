package com.example.loanworkflow.controller;

import com.example.loanworkflow.entity.LoanApplication;
import com.example.loanworkflow.entity.LoanStatus;
import com.example.loanworkflow.repository.LoanApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {

    private final LoanApplicationRepository repository;

    public LoanController(LoanApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/loans")
    public List<LoanApplication> getLoans(@RequestParam(name = "status", required = false) LoanStatus status) {
        if (status != null) {
            return repository.findByStatusOrderByIdAsc(status);
        }
        return repository.findAllByOrderByIdAsc();
    }

    @GetMapping("/loans/{id}")
    public ResponseEntity<LoanApplication> getLoan(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/loans/{id}/status")
    public ResponseEntity<LoanApplication> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return repository.findById(id)
                .map(loan -> {
                    loan.setStatus(request.status());
                    if (request.remark() != null) {
                        loan.setRemark(request.remark());
                    }
                    if (request.score() != null) {
                        loan.setScore(request.score());
                    }
                    LoanApplication saved = repository.save(loan);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public record StatusUpdateRequest(LoanStatus status, Integer score, String remark) {
    }
}
