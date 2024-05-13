package com.dev101.coa.domain.code.entity;

import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "code")
public class Code extends BaseEntity {

    @Id
    @Column(name = "code_id")
    private Long codeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private Type type;

    @Column(name = "code_name", length = 20, nullable = false)
    private String codeName;

    public CodeDto convertToDto(){
        return CodeDto.builder()
                .codeId(this.codeId)
                .codeName(this.codeName)
                .build();
    }

    // equals 메서드 오버라이드
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Code code = (Code) o;
        return codeId != null && codeId.equals(code.codeId);
    }

    // hashCode 메서드 오버라이드
    @Override
    public int hashCode() {
        return 31 * (codeId != null ? codeId.hashCode() : 0);
    }
}
