package com.auca.library_api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auca.library_api.model.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    
    public List<Member> findByFullName(String fullName);
    public List<Member> findByEmailAndFullName(String email, String fullName);
    @Override
    public boolean existsById(UUID id);
    public boolean existsByEmailIgnoreCase(String email);
    public List<Member> findByEmailIgnoreCase(String email);

}
