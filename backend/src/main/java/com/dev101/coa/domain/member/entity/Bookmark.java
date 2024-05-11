package com.dev101.coa.domain.member.entity;


import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookmark")
public class Bookmark extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long bookmarkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookmark_member_id", nullable = false)
    private Member bookmarkMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookmark_target_member_id", nullable = false)
    private Member bookmarkTargetMember;
}