package com.dev101.coa.global.security;

import com.dev101.coa.global.security.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
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
                            config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // 허용할 Origin
                            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // 허용할 HTTP 메소드
                            config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type")); // 허용할 헤더
//                            config.setAllowedHeaders(List.of("*")); // 허용할 헤더
                            config.setAllowCredentials(true); // 인증 정보 허용 설정
                            config.setMaxAge(3600L); // pre-flight 요청의 캐시 지속 시간
                            return config;
                            }))
                // CSRF 설정 변경

                .csrf(csrf -> csrf.ignoringRequestMatchers(
//                        new AntPathRequestMatcher("/login/oauth2/code/*")
                        new AntPathRequestMatcher("/**") // 필요한지 모르겠으
//                        new AntPathRequestMatcher("/api/auth/*") 이건 일반 로그인 같은게 있을 때 필요한 듯?
                        ).
                        csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())) // 쿠키에 담을 때 JS에서 뜯을 수 있도록 설정하는 것이 False

                // 세션 관리 전략 설정
                .sessionManagement(session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) //
//                                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // TODO 선택적으로 해야하나
                )


                // 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
//                                .anyRequest().permitAll()
//                                .requestMatchers("/login/oauth2/code/*").permitAll()
                                .requestMatchers("/**").permitAll()
                                .anyRequest().authenticated()
                )

                // OAuth2 로그인 설정 // oauth2Login 사용자가 로그인 안되어 있으면 일로 보낸다는데? http://localhost:8080/oauth2/authorization/google
                //Spring Security는 애플리케이션의 /login/oauth2/code/* 경로를 리다이렉트 URI로 사용하여 OAuth 2.0 프로바이더로부터 인증 코드를 받습니다.
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                );



        // JWT 인증 필터 추가
        // TODO 이게 무슨 의미?
//        http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(new JwtAuthenticationCookieFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class); // 커스텀 필터 추가
//        http.addFilterBefore(new TokenExceptionFilter(), tokenAuthenticationFilter.getClass()) // 토큰 예외 핸들링
        return http.build();
    }
}

