package com.dev101.coa.api;

import com.dev101.coa.domain.code.dto.CommonCodeResDto;
import com.dev101.coa.domain.code.service.CodeService;
import com.dev101.coa.global.common.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CodeController {

    private final CodeService codeService;

    @Autowired
    public CodeController(CodeService codeService) {
        this.codeService = codeService;
    }

    @GetMapping("/common/code")
    public ResponseEntity<Object> getCommonCodes() {
        CommonCodeResDto commonCodeResDto = codeService.getAllCommonCodes();
        System.out.println(commonCodeResDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(commonCodeResDto));
    }
}
