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

    private final JwtTokenProvider tokenProvider;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                            CorsConfiguration config = new CorsConfiguration();
                            config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // 허용할 Origin
                            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // 허용할 HTTP 메소드
                            config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type")); // 허용할 헤더
                            config.setAllowCredentials(true); // 인증 정보 허용 설정
                            config.setMaxAge(3600L); // pre-flight 요청의 캐시 지속 시간
                            return config;
                            }))
                // CSRF 설정 변경

                .csrf(csrf -> csrf.ignoringRequestMatchers(
                        new AntPathRequestMatcher("/login/oauth2/code/*")
                        ).
                        csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                // 쿠키에 담을 때 JS에서 뜯을 수 있도록 설정하는 것이 False

                // 세션 관리 전략 설정
                .sessionManagement(session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 항상 생성
                )


                // 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
                                .anyRequest().permitAll()
//                        .requestMatchers("/login/oauth2/code/*").permitAll()
//                        .anyRequest().authenticated()
                )

//                .formLogin(lg -> lg
//                        .loginPage("/login") // 커스텀 로그인 페이지를 사용하려면 로그인 페이지의 URL을 지정
//                        .permitAll()) // 기본 로그인 페이지 사용

                // OAuth2 로그인 설정 // oauth2Login 사용자가 로그인 안되어 있으면 일로 보낸다는데?
                //Spring Security는 애플리케이션의 /login/oauth2/code/* 경로를 리다이렉트 URI로 사용하여 OAuth 2.0 프로바이더로부터 인증 코드를 받습니다.
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                );

        // JWT 인증 필터 추가
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(tokenProvider); // TODO 이게 무슨 의미?
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//                .addFilterBefore(new TokenExceptionFilter(), tokenAuthenticationFilter.getClass()) // 토큰 예외 핸들링
        ;
        return http.build();
    }


//    // CORS 설정을 위한 Bean 정의
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));  // 허용할 Origin
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));  // 허용할 HTTP 메소드
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));  // 허용할 헤더
//        configuration.setAllowCredentials(true);  // 인증 정보 허용 설정
//        configuration.setMaxAge(3600L);  // pre-flight 요청의 캐시 지속 시간
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
}

