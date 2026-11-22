package com.auca.library_api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auca.library_api.model.Loan;
@Repository 
public interface LoanRepository extends JpaRepository<Loan, UUID> {
     boolean existsByBookIsbn(UUID isbn);                              // book has loan history?
    boolean existsByMemberId(UUID memberId);                          // member has loan history?
    long countByMemberIdAndReturnDateIsNull(UUID memberId);           // books still out
    boolean existsByBookIsbnAndReturnDateIsNull(UUID isbn);           // is the book out?
    List<Loan> findByMemberIdOrderByBorrowDateDesc(UUID memberId);    // loans of a member
    
}
