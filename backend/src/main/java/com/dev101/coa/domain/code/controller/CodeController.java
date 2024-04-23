package com.dev101.coa.api;

import com.dev101.coa.domain.code.dto.CommonCodeResponse;
import com.dev101.coa.domain.code.service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping(path = "/common/code")
    public CommonCodeResponse getCommonCodes() {
        return codeService.getAllCommonCodes();
    }
}
