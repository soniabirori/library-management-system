package com.auca.library_api.model;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fullName;
    
    private String email;

    @Enumerated(EnumType.STRING)
    private ERole role;

    //One to many
    @JsonIgnore 
    @OneToMany(mappedBy = "member")
    
    private List<Loan> loans=new ArrayList<>();

     public Member() { }

    public Member(String fullName, String email,ERole role) {
        this.fullName = fullName;
        this.email = email;
        this.role=role;
    }

    // ---------- getters and setters ----------
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        this.email = email;
    }

    public ERole getRole(){
        return role;
    }
    public void setRole(ERole role){
        this.role=role;
    }

    public List<Loan> getLoans() { return loans; }
    public void setLoans(List<Loan> loans) {
        this.loans = loans;
    }
}
