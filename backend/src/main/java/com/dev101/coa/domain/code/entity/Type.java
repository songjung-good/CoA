package com.dev101.coa.domain.code.entity;

import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "type")
public class Type extends BaseEntity {

    @Id
    @Column(name = "type_id", nullable = false)
    private Short typeId;

    @Column(name = "type_name", length = 20, nullable = false)
    private String typeName;

    // 생성자, getter, setter 생략
}