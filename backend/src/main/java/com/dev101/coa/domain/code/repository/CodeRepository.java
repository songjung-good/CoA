package com.dev101.coa.domain.code.repository;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {
    Optional<Code> findByCodeId(Long codeId);

    Optional<Code> findByCodeName(String name);

    List<Code> findByType(Type type);

}
