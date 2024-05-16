package com.dev101.coa.global.exception;

import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<?> globalException(final BaseException exception) {
        log.error("Error occurs {}", exception.toString());
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(exception.getStatusCode()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> applicationHandler(Exception e) {
        System.out.println("e = " + e);
        log.error("Error occurs {}", e.toString());
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(StatusCode.INTERNAL_SERVER_ERROR));
    }

    @ExceptionHandler(AsyncRequestNotUsableException.class)
    public ResponseEntity<?> handleAsyncRequestNotUsableException(AsyncRequestNotUsableException e) {
        log.error("Async request error occurs", e);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(StatusCode.SERVICE_UNAVAILABLE));
    }
}
