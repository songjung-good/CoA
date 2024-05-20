package com.dev101.coa.domain.code.repository;


import com.dev101.coa.domain.code.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeRepository extends JpaRepository<Type, String> {
}
