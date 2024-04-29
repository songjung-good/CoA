package com.dev101.coa.domain.code.controller;

import com.dev101.coa.domain.code.dto.CommonCodeResDto;
import com.dev101.coa.domain.code.service.CodeService;
import com.dev101.coa.global.common.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Code Controller", description = "Code 관련 API")
public class CodeController {

    private final CodeService codeService;

    @Operation(description = "공통 코드 전체 반환")
    @GetMapping("/common/code")
    public ResponseEntity<BaseResponse<CommonCodeResDto>> getCommonCodes() {
        CommonCodeResDto commonCodeResDto = codeService.getAllCommonCodes();
        System.out.println(commonCodeResDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(commonCodeResDto));
    }
}
