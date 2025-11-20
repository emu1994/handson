package com.example.transferscheduler.controller;

import com.example.transferscheduler.entity.Beneficiary;
import com.example.transferscheduler.entity.TransferOrder;
import com.example.transferscheduler.entity.TransferStatus;
import com.example.transferscheduler.repository.BeneficiaryRepository;
import com.example.transferscheduler.repository.TransferOrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferController {

    private final TransferOrderRepository orderRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    public TransferController(TransferOrderRepository orderRepository,
                              BeneficiaryRepository beneficiaryRepository) {
        this.orderRepository = orderRepository;
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @GetMapping("/beneficiaries")
    public List<Beneficiary> getBeneficiaries() {
        return beneficiaryRepository.findAll();
    }

    @GetMapping("/transfers")
    public List<TransferOrder> getTransfers(@RequestParam(name = "status", required = false) TransferStatus status) {
        if (status != null) {
            return orderRepository.findByStatusOrderByScheduledDateAsc(status);
        }
        return orderRepository.findAllByOrderByScheduledDateAsc();
    }

    @PostMapping("/transfers")
    public ResponseEntity<TransferOrder> createTransfer(@RequestBody TransferCreateRequest request) {
        Beneficiary beneficiary = beneficiaryRepository.findById(request.beneficiaryId())
                .orElse(null);
        if (beneficiary == null) {
            return ResponseEntity.badRequest().build();
        }
        TransferOrder order = new TransferOrder(
                beneficiary,
                request.amount(),
                request.scheduledDate(),
                TransferStatus.PENDING,
                request.description()
        );
        TransferOrder saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/transfers/{id}/status")
    public ResponseEntity<TransferOrder> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(request.status());
                    TransferOrder updated = orderRepository.save(order);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public record TransferCreateRequest(Long beneficiaryId, BigDecimal amount, LocalDate scheduledDate, String description) {
    }

    public record StatusUpdateRequest(TransferStatus status) {
    }
}
