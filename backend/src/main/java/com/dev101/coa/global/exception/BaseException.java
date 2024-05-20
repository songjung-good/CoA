package com.dev101.coa.global.exception;


import com.dev101.coa.global.common.StatusCode;
import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {
    private final StatusCode statusCode;

    public BaseException(StatusCode statusCode) {
        super(statusCode.getMessage());
        this.statusCode = statusCode;
    }
}
