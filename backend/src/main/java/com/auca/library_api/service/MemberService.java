package com.auca.library_api.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auca.library_api.model.Loan;
import com.auca.library_api.model.Member;
import com.auca.library_api.repository.LoanRepository;
import com.auca.library_api.repository.MemberRepository;

@Service
public class MemberService {

    @Autowired
    public MemberRepository memberRepo;

    @Autowired
    private LoanRepository loanRepo;

    // display all members
    public List<Member> displayAllMembers() {
        return memberRepo.findAll();
    }

    // display member by id
    public Optional<Member> displayMemberById(UUID id) {
        return memberRepo.findById(id);
    }

    // display the loans of one member (newest first)
    public List<Loan> displayLoansOfMember(UUID id) {
        return loanRepo.findByMemberIdOrderByBorrowDateDesc(id);
    }

    // BR-07: required fields. Returns a message, or null if all is fine.
    private String checkRequiredFields(Member member) {
        if (member.getFullName() == null || member.getFullName().isBlank())
            return "Full name is required";
        if (member.getEmail() == null || member.getEmail().isBlank())
            return "Email is required";
        if (member.getRole() == null)
            return "Role is required";
        return null;
    }

    // SAVE MEMBER
    @Transactional
    public String addMember(Member member) {
        String error = checkRequiredFields(member);
        if (error != null)
            return error;                                        // BR-07

        if (memberRepo.existsByEmailIgnoreCase(member.getEmail().trim()))
            return "Email already registered";                   // BR-06

        member.setId(null);                                      // let the database make the id
        member.setFullName(member.getFullName().trim());
        member.setEmail(member.getEmail().trim());
        memberRepo.save(member);
        return "Member saved successfully";
    }

    // UPDATE
    @Transactional
    public String updateMember(UUID id, Member newData) {
        Optional<Member> found = memberRepo.findById(id);
        if (found.isEmpty())
            return "Member does not exist";                      // BR-09

        String error = checkRequiredFields(newData);
        if (error != null)
            return error;                                        // BR-07

        String email = newData.getEmail().trim();
        boolean takenByAnother = memberRepo.findByEmailIgnoreCase(email)
                .stream().anyMatch(m -> !m.getId().equals(id));
        if (takenByAnother)
            return "Email already registered";                   // BR-06

        Member member = found.get();
        member.setFullName(newData.getFullName().trim());
        member.setEmail(email);
        member.setRole(newData.getRole());
        memberRepo.save(member);
        return "Member updated successfully";
    }

    // DELETE
    @Transactional
    public String deleteMember(UUID id) {
        if (!memberRepo.existsById(id))
            return "Member does not exist";                      // BR-09
        if (loanRepo.existsByMemberId(id))
            return "Member has loans, cannot delete";            // BR-08
        memberRepo.deleteById(id);
        return "Member deleted successfully";
    }
}