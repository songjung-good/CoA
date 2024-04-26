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

    // String-String(key-value) 형식으로 저장할 redis 템플릿 설정
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());

        return template;
    }


    // codeId-AnanlysisDto 형식의 key-value로 redis에 저장하기 위한 템플릿 설정
    @Bean
    public RedisTemplate<Long, AnalysisResultDto> redisTemplateJson(RedisConnectionFactory factory) {
        RedisTemplate<Long, AnalysisResultDto> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new GenericToStringSerializer<>(Long.class));
        template.setValueSerializer(new StringRedisSerializer());

        // redis에 json 저장을 위한 serializer
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(AnalysisResultDto.class));

        return template;
    }
}