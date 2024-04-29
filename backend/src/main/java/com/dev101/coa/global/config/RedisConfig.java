package com.dev101.coa.global.config;

import com.dev101.coa.domain.repo.dto.AnalysisResultDto;
import com.fasterxml.jackson.databind.ser.std.NumberSerializers;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {
    private final RedisProperties redisProperties;

    // RedisProperties로 yaml에 저장한 host, post를 연결
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(redisProperties.getHost(), redisProperties.getPort());
    }

    // String-String(key-value) 형식으로 저장할 redis 템플릿 설정 for test
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());

        return template;
    }


    // hset으로 레포 분석에 필요한 데이터를 저장하기 위한 템플릿
    @Bean
    public RedisTemplate<String, AnalysisResultDto> redisTemplateRepo(RedisConnectionFactory factory) {
        RedisTemplate<String, AnalysisResultDto> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new GenericToStringSerializer<>(Long.class));
        template.setValueSerializer(new StringRedisSerializer());

        // 키는 문자열 형태로 직렬화
        template.setKeySerializer(new StringRedisSerializer());

        // 값은 다양한 형태를 지원할 수 있도록 JSON 직렬화 사용
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        // 해시 값 직렬화 역시 JSON을 사용
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());


        return template;
    }


}