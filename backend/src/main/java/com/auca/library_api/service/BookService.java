package com.auca.library_api.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auca.library_api.model.Book;
import com.auca.library_api.model.Category;
import com.auca.library_api.repository.BookRepository;
import com.auca.library_api.repository.CategoryRepository;
import com.auca.library_api.repository.LoanRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private LoanRepository loanRepo;

    // GET all, or search by title
    public List<Book> displayAllBooks(String search) {
        if (search == null || search.isBlank())
            return bookRepo.findAll();
        return bookRepo.findByTitleContainingIgnoreCase(search.trim());
    }

    // GET by isbn
    public Optional<Book> displayBookByIsbn(UUID isbn) {
        return bookRepo.findById(isbn);
    }

    // BR-07: required fields. Returns a message, or null if all is fine.
    private String checkRequiredFields(Book book) {
        if (book.getTitle() == null || book.getTitle().isBlank())
            return "Title is required";
        if (book.getAuthor() == null || book.getAuthor().isBlank())
            return "Author is required";
        if (book.getCategory() == null || book.getCategory().getId() == null)
            return "Category is required";
        return null;
    }

    // POST
    @Transactional
    public String addBook(Book book) {
        String error = checkRequiredFields(book);
        if (error != null)
            return error;

        // BR-04: the client sends only the category id, so load the real one
        Optional<Category> category = categoryRepo.findById(book.getCategory().getId());
        if (category.isEmpty())
            return "Category does not exist";

        book.setIsbn(null);                       // let the database make the id
        book.setTitle(book.getTitle().trim());
        book.setAuthor(book.getAuthor().trim());
        book.setCategory(category.get());
        bookRepo.save(book);
        return "Book saved successfully";
    }

    // PUT
    @Transactional
    public String updateBook(UUID isbn, Book newData) {
        Optional<Book> found = bookRepo.findById(isbn);
        if (found.isEmpty())
            return "Book does not exist";         // BR-09

        String error = checkRequiredFields(newData);
        if (error != null)
            return error;

        Optional<Category> category = categoryRepo.findById(newData.getCategory().getId());
        if (category.isEmpty())
            return "Category does not exist";     // BR-04

        Book book = found.get();
        book.setTitle(newData.getTitle().trim());
        book.setAuthor(newData.getAuthor().trim());
        book.setCategory(category.get());
        bookRepo.save(book);
        return "Book updated successfully";
    }

    // DELETE
    @Transactional
    public String deleteBook(UUID isbn) {
        if (!bookRepo.existsById(isbn))
            return "Book does not exist";         // BR-09
        if (loanRepo.existsByBookIsbn(isbn))
            return "Book has loans, cannot delete";   // BR-08
        bookRepo.deleteById(isbn);
        return "Book deleted successfully";
    }
}