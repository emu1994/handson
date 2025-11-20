package com.example.transferscheduler.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transfer_orders")
public class TransferOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "beneficiary_id")
    private Beneficiary beneficiary;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransferStatus status;

    @Column(length = 255)
    private String description;

    public TransferOrder() {
    }

    public TransferOrder(Beneficiary beneficiary, BigDecimal amount, LocalDate scheduledDate, TransferStatus status, String description) {
        this.beneficiary = beneficiary;
        this.amount = amount;
        this.scheduledDate = scheduledDate;
        this.status = status;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Beneficiary getBeneficiary() {
        return beneficiary;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public TransferStatus getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBeneficiary(Beneficiary beneficiary) {
        this.beneficiary = beneficiary;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public void setStatus(TransferStatus status) {
        this.status = status;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
