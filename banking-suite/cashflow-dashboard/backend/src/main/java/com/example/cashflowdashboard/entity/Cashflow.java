package com.example.cashflowdashboard.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cashflow")
public class Cashflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal inflow;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal outflow;

    @Column(length = 255)
    private String description;

    public Cashflow() {
    }

    public Cashflow(Account account, LocalDate date, BigDecimal inflow, BigDecimal outflow, String description) {
        this.account = account;
        this.date = date;
        this.inflow = inflow;
        this.outflow = outflow;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Account getAccount() {
        return account;
    }

    public LocalDate getDate() {
        return date;
    }

    public BigDecimal getInflow() {
        return inflow;
    }

    public BigDecimal getOutflow() {
        return outflow;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setInflow(BigDecimal inflow) {
        this.inflow = inflow;
    }

    public void setOutflow(BigDecimal outflow) {
        this.outflow = outflow;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
