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

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private BookRepository bookRepo;

    // GET all
    public List<Category> displayAllCategories() {
        return categoryRepo.findAll();
    }

    // GET by id
    public Optional<Category> displayCategoryById(UUID id) {
        return categoryRepo.findById(id);
    }

    // GET books of a category
    public List<Book> displayBooksOfCategory(UUID id) {
        return bookRepo.findByCategoryId(id);
    }

    // POST
    @Transactional
    public String addCategory(Category category) {
        if (category.getName() == null || category.getName().isBlank())
            return "Category name is required";                  // BR-07
        if (categoryRepo.existsByNameIgnoreCase(category.getName().trim()))
            return "Category already exists";                    // BR-06
        category.setId(null);                                    // let the database make the id
        category.setName(category.getName().trim());
        categoryRepo.save(category);
        return "Category saved successfully";
    }

    // PUT
    @Transactional
    public String updateCategory(UUID id, Category newData) {
        Optional<Category> found = categoryRepo.findById(id);
        if (found.isEmpty())
            return "Category does not exist";                    // BR-09
        if (newData.getName() == null || newData.getName().isBlank())
            return "Category name is required";                  // BR-07

        String name = newData.getName().trim();
        boolean takenByAnother = categoryRepo.findByNameIgnoreCase(name)
                .stream().anyMatch(c -> !c.getId().equals(id));
        if (takenByAnother)
            return "Category already exists";                    // BR-06

        Category category = found.get();
        category.setName(name);
        categoryRepo.save(category);
        return "Category updated successfully";
    }

    // DELETE
    @Transactional
    public String deleteCategory(UUID id) {
        if (!categoryRepo.existsById(id))
            return "Category does not exist";                    // BR-09
        if (bookRepo.existsByCategoryId(id))
            return "Category has books, cannot delete";          // BR-08
        categoryRepo.deleteById(id);
        return "Category deleted successfully";
    }
}