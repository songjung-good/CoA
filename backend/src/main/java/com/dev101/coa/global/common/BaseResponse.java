package com.dev101.coa.global.common;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"isSuccess", "message", "code", "result"})
public class BaseResponse<T> {

    @JsonProperty("isSuccess")
    private final Boolean isSuccess;
    private final String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int code;

    @JsonInclude(JsonInclude.Include.NON_NULL)  // null인 데이터는 안나오도록 함(요청 실패한 경우)
    private T result;

    // 요청 성공한 경우
    public BaseResponse(T result) {
        this.isSuccess = true;
        this.message = "요청에 성공하였습니다.";
        this.code = 100;
        this.result = result;
    }

    // 요청 실패한 경우
    public BaseResponse(StatusCode error) {
        this.isSuccess = error.isSuccess();
        this.message = error.getMessage();
        this.code = error.getCode();
        this.result = null;
    }
}
