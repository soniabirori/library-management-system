package com.auca.library_api.repository;


import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auca.library_api.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {
    List<Book> findByCategoryId(UUID categoryId); // Find books by category ID
    boolean existsByCategoryId(UUID categoryId);  // Check if any books exist for a given category ID
    List<Book> findByTitleContainingIgnoreCase(String text);   // ?search
}
