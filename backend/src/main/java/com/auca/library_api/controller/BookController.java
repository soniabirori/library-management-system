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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auca.library_api.model.Book;
import com.auca.library_api.service.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    // GET /api/books  or  GET /api/books?search=java
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(bookService.displayAllBooks(search));
    }

    @GetMapping("/{isbn}")
    public ResponseEntity<?> getBookByIsbn(@PathVariable UUID isbn) {
        Optional<Book> book = bookService.displayBookByIsbn(isbn);
        if (book.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book does not exist");
        return ResponseEntity.ok(book.get());
    }

    @PostMapping
    public ResponseEntity<String> saveBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    @PutMapping("/{isbn}")
    public ResponseEntity<String> updateBook(@PathVariable UUID isbn, @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(isbn, book));
    }

    @DeleteMapping("/{isbn}")
    public ResponseEntity<String> deleteBook(@PathVariable UUID isbn) {
        return ResponseEntity.ok(bookService.deleteBook(isbn));
    }
}