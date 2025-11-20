package com.example.cashflowdashboard.controller;

import com.example.cashflowdashboard.entity.Account;
import com.example.cashflowdashboard.entity.Cashflow;
import com.example.cashflowdashboard.repository.AccountRepository;
import com.example.cashflowdashboard.repository.CashflowRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5174")
public class CashflowController {

    private final AccountRepository accountRepository;
    private final CashflowRepository cashflowRepository;

    public CashflowController(AccountRepository accountRepository, CashflowRepository cashflowRepository) {
        this.accountRepository = accountRepository;
        this.cashflowRepository = cashflowRepository;
    }

    @GetMapping("/accounts")
    public List<Account> getAccounts() {
        return accountRepository.findAll();
    }

    @GetMapping("/cashflow")
    public List<Cashflow> getCashflow(
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate start = from != null ? from : LocalDate.now().minusDays(30);
        LocalDate end = to != null ? to : LocalDate.now();
        return cashflowRepository.findByDateBetweenOrderByDateAsc(start, end);
    }
}
