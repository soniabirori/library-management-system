package com.auca.library_api.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auca.library_api.model.Loan;
import com.auca.library_api.service.LoanService;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.displayAllLoans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLoanById(@PathVariable UUID id) {
        Optional<Loan> loan = loanService.displayLoanById(id);
        if (loan.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Loan does not exist");
        return ResponseEntity.ok(loan.get());
    }

    // POST /api/loans?memberId=...&bookId=...
    @PostMapping
    public ResponseEntity<String> borrow(@RequestParam UUID memberId, @RequestParam UUID bookId) {
        return ResponseEntity.ok(loanService.borrowBook(memberId, bookId));
    }

    // PUT /api/loans/{id}/return
    @PutMapping("/{id}/return")
    public ResponseEntity<String> returnBook(@PathVariable UUID id) {
        return ResponseEntity.ok(loanService.returnBook(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLoan(@PathVariable UUID id) {
        return ResponseEntity.ok(loanService.deleteLoan(id));
    }
}