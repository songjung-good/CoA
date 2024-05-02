package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.repo.entity.LineOfCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LineOfCodeRepository extends JpaRepository<LineOfCode, Long> {
}
