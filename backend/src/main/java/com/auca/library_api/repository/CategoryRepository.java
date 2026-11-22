package com.auca.library_api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auca.library_api.model.Category;

@Repository 
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    public List<Category> findByNameIgnoreCase(String name);
    public List<Category> findByNameContaining(String letter);
    public boolean existsByNameIgnoreCase(String name);
}