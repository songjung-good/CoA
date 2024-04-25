package com.dev101.coa.global.security;

import com.dev101.coa.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPrincipal implements UserDetails {

    private Member member;
    private Collection<? extends GrantedAuthority> authorities;

    // 비밀번호 관련 메소드 추가
    @Override
    public String getPassword() {
        // 소셜 로그인 사용 시 비밀번호는 사용하지 않거나, 더미 비밀번호를 반환할 수 있습니다.
        return null; // 또는 암호화된 더미 비밀번호
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return member.getMemberNickname();
    }


    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠김 여부
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명 만료 여부
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화 여부
    }
}
