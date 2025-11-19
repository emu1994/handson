package com.example.receivables.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_code", nullable = false, unique = true, length = 32)
    private String customerCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 30)
    private String segment;

    @Column(nullable = false, length = 5)
    private String rating;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "total_exposure", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalExposure;

    public Customer() {
    }

    public Customer(String customerCode, String name, String segment, String rating,
                    Integer riskScore, BigDecimal totalExposure) {
        this.customerCode = customerCode;
        this.name = name;
        this.segment = segment;
        this.rating = rating;
        this.riskScore = riskScore;
        this.totalExposure = totalExposure;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public String getName() {
        return name;
    }

    public String getSegment() {
        return segment;
    }

    public String getRating() {
        return rating;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public BigDecimal getTotalExposure() {
        return totalExposure;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSegment(String segment) {
        this.segment = segment;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public void setTotalExposure(BigDecimal totalExposure) {
        this.totalExposure = totalExposure;
    }
}
