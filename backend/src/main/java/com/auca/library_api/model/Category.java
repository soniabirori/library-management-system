package com.auca.library_api.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    //One to Many with Book
    @JsonIgnore
    @OneToMany(mappedBy = "category") 
    private List<Book> books = new ArrayList<>();

    public Category(){}
    
     public Category(String name) {
        this.name = name;
    }

    // ---------- getters and setters ----------
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Book> getBooks() { return books; }
    public void setBooks(List<Book> books) {
        this.books = books;
    }

}
