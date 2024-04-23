package com.dev101.coa.domain.code.service;

import com.dev101.coa.domain.code.dto.CommonCodeResponse;
import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.entity.Type;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.code.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CodeService {

    private final CodeRepository codeRepository;
    private final TypeRepository typeRepository;

    @Autowired
    public CodeService(CodeRepository codeRepository, TypeRepository typeRepository) {
        this.codeRepository = codeRepository;
        this.typeRepository = typeRepository;
    }

    public CommonCodeResponse getAllCommonCodes() {
        List<Code> codes = codeRepository.findAll();
        Map<String, Type> types = typeRepository.findAll().stream()
                .collect(Collectors.toMap(Type::getTypeId, type -> type));

        Map<String, Map<Long, String>> groupedCodes = codes.stream()
                .collect(Collectors.groupingBy(
                        code -> code.getType().getTypeId(),
                        Collectors.toMap(
                                Code::getCodeId,
                                Code::getCodeName
                        )
                ));

        return new CommonCodeResponse(groupedCodes, types);
    }
}
