package com.example.loanworkflow.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "loan_applications")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "applicant_name", nullable = false, length = 100)
    private String applicantName;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "annual_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal annualIncome;

    @Column(name = "requested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;

    @Column(name = "term_months", nullable = false)
    private Integer termMonths;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoanStatus status;

    @Column
    private Integer score;

    @Column(length = 255)
    private String remark;

    public LoanApplication() {
    }

    public LoanApplication(String applicantName, LocalDate birthDate, BigDecimal annualIncome,
                           BigDecimal requestedAmount, Integer termMonths, LoanStatus status,
                           Integer score, String remark) {
        this.applicantName = applicantName;
        this.birthDate = birthDate;
        this.annualIncome = annualIncome;
        this.requestedAmount = requestedAmount;
        this.termMonths = termMonths;
        this.status = status;
        this.score = score;
        this.remark = remark;
    }

    public Long getId() {
        return id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public Integer getTermMonths() {
        return termMonths;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public Integer getScore() {
        return score;
    }

    public String getRemark() {
        return remark;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public void setTermMonths(Integer termMonths) {
        this.termMonths = termMonths;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
