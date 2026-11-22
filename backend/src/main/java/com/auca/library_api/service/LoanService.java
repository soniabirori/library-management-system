package com.auca.library_api.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auca.library_api.model.Book;
import com.auca.library_api.model.Loan;
import com.auca.library_api.model.Member;
import com.auca.library_api.repository.BookRepository;
import com.auca.library_api.repository.LoanRepository;
import com.auca.library_api.repository.MemberRepository;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;

    // GET all
    public List<Loan> displayAllLoans() {
        return loanRepo.findAll();
    }

    // GET by id
    public Optional<Loan> displayLoanById(UUID id) {
        return loanRepo.findById(id);
    }

    // BORROW  (POST /api/loans?memberId=&bookId=)
    @Transactional
    public String borrowBook(UUID memberId, UUID bookId) {
        // BR-09: both must exist
        Optional<Member> member = memberRepo.findById(memberId);
        if (member.isEmpty())
            return "Member does not exist";
        Optional<Book> book = bookRepo.findById(bookId);
        if (book.isEmpty())
            return "Book does not exist";

        // BR-01: at most 3 books out
        if (loanRepo.countByMemberIdAndReturnDateIsNull(memberId) >= 3)
            return "Member already has 3 books out";

        // BR-02: a book that is out cannot be borrowed
        if (loanRepo.existsByBookIsbnAndReturnDateIsNull(bookId))
            return "Book is already borrowed";

        // BR-03: the service sets the dates, never the client
        LocalDate today = LocalDate.now();
        Loan loan = new Loan(member.get(), book.get(), today, today.plusDays(14));
        loanRepo.save(loan);
        return "Book borrowed successfully";
    }

    // RETURN  (PUT /api/loans/{id}/return)
    @Transactional
    public String returnBook(UUID id) {
        Optional<Loan> found = loanRepo.findById(id);
        if (found.isEmpty())
            return "Loan does not exist";                 // BR-09

        Loan loan = found.get();
        if (loan.getReturnDate() != null)
            return "Book already returned";               // BR-05

        loan.setReturnDate(LocalDate.now());              // BR-05
        loanRepo.save(loan);
        return "Book returned successfully";
    }

    // DELETE
    @Transactional
    public String deleteLoan(UUID id) {
        if (!loanRepo.existsById(id))
            return "Loan does not exist";                 // BR-09
        loanRepo.deleteById(id);
        return "Loan deleted successfully";
    }
}