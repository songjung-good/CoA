package com.dev101.coa.global.security.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.oauth2user.CustomOAuth2User;
import com.dev101.coa.global.security.oauth2user.platOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthenticationService authenticationService;
    private final CodeRepository codeRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest); // userRequest를 넣으면 OAuth2User을 반환하는
        String registrationId = userRequest.getClientRegistration().getRegistrationId();


        // github이랑 gitlab은 바로 반환 멤버 업데이트 X
        switch (registrationId) {
            case "github", "gitlab" -> {
                Optional<Code> code = codeRepository.findByCodeName(registrationId);
                Code platcode = code.orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));

//                Authentication authentication = new UsernamePasswordAuthenticationToken(oAuth2User, null, null);
//                SecurityContextHolder.getContext().setAuthentication(authentication);

                return new platOAuth2User(oAuth2User, platcode); // 플랫폼코드 값을 담아줌
            }
            default -> {
                // 로그인 처리 => 멤버 업데이트
                Member newMember = authenticationService.authenticateOAuth2(oAuth2User, registrationId);
                return new CustomOAuth2User(oAuth2User, newMember);
            }
        }

    }
}


