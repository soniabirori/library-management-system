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

import com.auca.library_api.model.Loan;
import com.auca.library_api.model.Member;
import com.auca.library_api.service.MemberService;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // display all members
    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.displayAllMembers());
    }

    // display one member
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable UUID id) {
        Optional<Member> member = memberService.displayMemberById(id);
        if (member.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member does not exist");
        return ResponseEntity.ok(member.get());
    }

    // display the loans of a member
    @GetMapping("/{id}/loans")
    public ResponseEntity<?> getLoansOfMember(@PathVariable UUID id) {
        if (memberService.displayMemberById(id).isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member does not exist");
        List<Loan> loans = memberService.displayLoansOfMember(id);
        return ResponseEntity.ok(loans);
    }

    // save a member
    @PostMapping
    public ResponseEntity<String> saveMember(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.addMember(member));
    }

    // update a member
    @PutMapping("/{id}")
    public ResponseEntity<String> updateMember(@PathVariable UUID id, @RequestBody Member member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }

    // delete a member
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable UUID id) {
        return ResponseEntity.ok(memberService.deleteMember(id));
    }
}