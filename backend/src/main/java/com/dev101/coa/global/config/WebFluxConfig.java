//package com.dev101.coa.global.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.reactive.config.CorsRegistry;
//import org.springframework.web.reactive.config.EnableWebFlux;
//import org.springframework.web.reactive.config.WebFluxConfigurer;
//import org.springframework.web.server.WebFilter;
//
//import java.time.Duration;
//
//@Configuration
//@EnableWebFlux
//public class WebFluxConfig implements WebFluxConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("*")
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
//    }
//
//    @Bean
//    public WebFilter globalTimeoutFilter() {
//        return (exchange, chain) -> chain.filter(exchange).timeout(Duration.ofSeconds(10))
//                .onErrorResume(throwable -> {
//                    exchange.getResponse().setStatusCode(HttpStatus.REQUEST_TIMEOUT);
//                    return exchange.getResponse().setComplete();
//                });
//    }
//}
