package com.auca.library_api.model;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate borrowDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    //Many to one with member
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    //Many to one with book
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    public Loan() { }
    public Loan(Member member, Book book,
                LocalDate borrowDate, LocalDate dueDate) {
        this.member = member;
        this.book = book;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
    }

    // ---------- getters and setters ----------
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Member getMember() { return member; }
    public void setMember(Member member) {
        this.member = member;
    }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }
    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }
    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }
    
}
