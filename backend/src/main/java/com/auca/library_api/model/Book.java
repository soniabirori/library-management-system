package com.auca.library_api.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity 
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID isbn;

    @Column(nullable=false)
   private String title;

   private String author;

   //relationships
   //Many to one with category
   @ManyToOne
   @JoinColumn(name = "category_id")
   private Category category;

    //One to many with loans
    @JsonIgnore 
    @OneToMany(mappedBy = "book")
    private List<Loan> loans = new ArrayList<>();

    //CONSTRUCTORS
    public Book() {

    }

    public Book(String author, Category category, UUID isbn, String title) {
        this.author = author;
        this.category = category;
        this.isbn = isbn;
        this.title = title;
    }

    public UUID getIsbn() {
        return isbn;
    }

    public void setIsbn(UUID isbn) {
        this.isbn = isbn;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Loan> getLoans() {
        return loans;
    }

    public void setLoans(List<Loan> loans) {
        this.loans = loans;
    }
   
}
