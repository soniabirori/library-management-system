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
import org.springframework.web.bind.annotation.RestController;

import com.auca.library_api.model.Book;
import com.auca.library_api.model.Category;
import com.auca.library_api.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.displayAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable UUID id) {
        Optional<Category> category = categoryService.displayCategoryById(id);
        if (category.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category does not exist");
        return ResponseEntity.ok(category.get());
    }

    @GetMapping("/{id}/books")
    public ResponseEntity<?> getBooksOfCategory(@PathVariable UUID id) {
        if (categoryService.displayCategoryById(id).isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category does not exist");
        List<Book> books = categoryService.displayBooksOfCategory(id);
        return ResponseEntity.ok(books);
    }

    @PostMapping
    public ResponseEntity<String> saveCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.addCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable UUID id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}