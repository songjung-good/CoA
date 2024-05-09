package com.dev101.coa.global.security;

import com.dev101.coa.global.security.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtTokenProvider jwtTokenProvider;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                            CorsConfiguration config = new CorsConfiguration();
                            config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://k10e101.p.ssafy.io", "https://commitanalyze.com")); // 허용할 Origin -> "https://k10e101.p.ssafy.io/" 배포는 오리진이 같아서 괜찮은 듯.
                            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // 허용할 HTTP 메소드
                            config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "Access-Token", "X-CSRF-TOKEN", "Referer")); // 허용할 헤더
//                            config.setAllowedHeaders(List.of("*")); // 허용할 헤더
                            config.setAllowCredentials(true); // 인증 정보 허용 설정
                            config.setMaxAge(3600L); // pre-flight 요청의 캐시 지속 시간
                            return config;
                            }))
                // CSRF 설정 변경 +  스프링 시큐리티는 기본적으로 CSRF 보호를 활성화하여 POST, PUT, DELETE 같은 변경을 초래하는 HTTP 메소드에 대해 CSRF 토큰 검증을 요구합니다.
//                .csrf(csrf -> csrf.ignoringRequestMatchers(
//                        new AntPathRequestMatcher("/**") //
//                        ).
//                        csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                // false로 설정함으로써 JavaScript를 통해서도 쿠키에 접근할 수 있게 합니다.
                // TODO CSRF 토큰을 읽어서 요청의 헤더에 포함시킬 필요가 있을 때 사용합니다.
                .csrf(AbstractHttpConfigurer::disable)

                // 요청 권한 설정 TODO 서버의(JWT) 인증 부분
                .authorizeHttpRequests(auth -> auth
//                                .anyRequest().permitAll()
                                .requestMatchers("/api/swagger-ui/**", "/api/auth/**").permitAll()
                                .anyRequest().authenticated()
                )

                .addFilterBefore(new JwtAuthenticationCookieFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class) // 커스텀 필터 추가

                // 세션 관리 전략 설정
                .sessionManagement(session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) //
//                                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // TODO 선택적으로 해야하나
                )

                // OAuth2 로그인 설정 // oauth2Login 사용자가 로그인 안되어 있으면 일로 보낸다는데? http://localhost:8080/oauth2/authorization/google
                //Spring Security는 애플리케이션의 /login/oauth2/code/* 경로를 리다이렉트 URI로 사용하여 OAuth 2.0 프로바이더로부터 인증 코드를 받습니다.
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                );

        return http.build();
    }
}

