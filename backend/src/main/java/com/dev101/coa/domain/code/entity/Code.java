package com.dev101.coa.domain.code.entity;

import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "code")
public class Code extends BaseEntity {

    @Id
    @Column(name = "code_id")
    private Long codeId;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private Type type;

    @Column(name = "code_name", length = 20, nullable = false)
    private String codeName;

    // 생성자, getter, setter 생략
}