package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.member.entity.Alarm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    Page<Alarm> findByAlarmTargetIdOrderByCreatedAtDesc(Long targetId, Pageable pageable);

    Long countAllByAlarmTargetIdAndCreatedAtGreaterThan(Long targetMemberId, LocalDateTime checkedTime);
}
