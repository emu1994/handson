package com.example.fundportfolio.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "holdings")
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id")
    private Fund fund;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal units;

    @Column(name = "average_price", nullable = false, precision = 15, scale = 4)
    private BigDecimal averagePrice;

    @Column(name = "latest_nav", nullable = false, precision = 15, scale = 4)
    private BigDecimal latestNav;

    @Column(name = "valuation_date", nullable = false)
    private LocalDate valuationDate;

    public Holding() {
    }

    public Holding(Fund fund, BigDecimal units, BigDecimal averagePrice, BigDecimal latestNav, LocalDate valuationDate) {
        this.fund = fund;
        this.units = units;
        this.averagePrice = averagePrice;
        this.latestNav = latestNav;
        this.valuationDate = valuationDate;
    }

    public Long getId() {
        return id;
    }

    public Fund getFund() {
        return fund;
    }

    public BigDecimal getUnits() {
        return units;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public BigDecimal getLatestNav() {
        return latestNav;
    }

    public LocalDate getValuationDate() {
        return valuationDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFund(Fund fund) {
        this.fund = fund;
    }

    public void setUnits(BigDecimal units) {
        this.units = units;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }

    public void setLatestNav(BigDecimal latestNav) {
        this.latestNav = latestNav;
    }

    public void setValuationDate(LocalDate valuationDate) {
        this.valuationDate = valuationDate;
    }
}
