package com.example.fundportfolio.controller;

import com.example.fundportfolio.entity.Fund;
import com.example.fundportfolio.entity.Holding;
import com.example.fundportfolio.repository.FundRepository;
import com.example.fundportfolio.repository.HoldingRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5175")
public class PortfolioController {

    private final FundRepository fundRepository;
    private final HoldingRepository holdingRepository;

    public PortfolioController(FundRepository fundRepository, HoldingRepository holdingRepository) {
        this.fundRepository = fundRepository;
        this.holdingRepository = holdingRepository;
    }

    @GetMapping("/funds")
    public List<Fund> getFunds() {
        return fundRepository.findAll();
    }

    @GetMapping("/holdings")
    public List<Holding> getHoldings() {
        return holdingRepository.findAll();
    }
}
