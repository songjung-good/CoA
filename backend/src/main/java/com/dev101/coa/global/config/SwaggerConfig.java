package com.dev101.coa.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

// 스웨거 추가
// swagger-ui/index.html로 접속가능
@OpenAPIDefinition(info = @Info(title = "CoA-swagger",
        description = "커밋 분석 사이트",
        version= "v1"))
@Configuration
public class SwaggerConfig {
}
