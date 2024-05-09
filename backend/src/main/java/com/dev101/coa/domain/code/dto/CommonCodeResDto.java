package com.dev101.coa.domain.code.dto;

import com.dev101.coa.domain.code.entity.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommonCodeResDto {
    private List<TypeCodeDto> commonCodeList;

    public CommonCodeResDto(Map<Short, Map<Long, String>> groupedCodes, Map<Short, Type> types) {
        this.commonCodeList = groupedCodes.entrySet().stream()
                .map(entry -> new TypeCodeDto(entry.getKey(), types.get(entry.getKey()).getTypeName(), entry.getValue()))
                .collect(Collectors.toList());
        commonCodeList.add(0, new TypeCodeDto());
    }

//    types:
//    {
//        "1": Type("1", "platform"),
//        "2": Type("2", "job")
//    }
//    Stream of entries: // groupedCodes
//            - Entry("1", {1001: "Google", 1002: "Github"})
//            - Entry("2", {2001: "FE", 2002: "BE"})
//
//    Mapping to TypeCodeDto:
//            - TypeCodeDto("1", "platform", {1001: "Google", 1002: "Github"})
//            - TypeCodeDto("2", "job", {2001: "FE", 2002: "BE"})
//
//    Collected List:
//            - [TypeCodeDto("1", "platform", {1001: "Google", 1002: "Github"}),
//               TypeCodeDto("2", "job", {2001: "FE", 2002: "BE"})]

}

