package com.example.fundportfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "funds")
public class Fund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "asset_class", nullable = false, length = 40)
    private String assetClass;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel;

    @Column(nullable = false, length = 10)
    private String currency;

    public Fund() {
    }

    public Fund(String code, String name, String assetClass, String riskLevel, String currency) {
        this.code = code;
        this.name = name;
        this.assetClass = assetClass;
        this.riskLevel = riskLevel;
        this.currency = currency;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getAssetClass() {
        return assetClass;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getCurrency() {
        return currency;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAssetClass(String assetClass) {
        this.assetClass = assetClass;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
