package com.dev101.coa.global.common;
import lombok.Getter;

@Getter
public enum StatusCode {
    // Success
    SUCCESS(true, 100, "요청에 성공하였습니다."),

    // REPO : 300
    REPO_VIEW_NOT_FOUND(false, 300, "레포지토리 뷰가 존재하지 않습니다."),
    REPO_REQ_MEMBER_NOT_MATCH(false, 301, "레포지토리 분석을 요청한 사용자가 아닙니다."),

    // COOD : 400
    CODE_NOT_FOUND(false, 400, "코드를 찾을 수 없습니다."),
    NOT_FOUND_PLAT(false, 401, "플랫폼을 찾을 수 없습니다."),

    // AI Server : 500
    AI_SERVER_ERROR(false, 500, "AI 서버로부터 응답을 받지 못했습니다."),

    // Member : 600
    COOKIE_NOT_FOUND(false, 600, "쿠키가 존재하지 않습니다."),
    ;
//
// COMMON
//    FORBIDDEN_REQUEST(false, 202, "접근 권한이 없습니다."),
//
//    //회원 : 300
//    LOGIN_FAIL(false, 300, "로그인에 실패했습니다."),
//    USER_NOT_FOUND(false,301,"유저를 찾을 수 없습니다."),
//
    //회원-태그: 400
//    USER_TAG_NOT_FOUND(false, 400, "회원에게서 태그를 찾을 수 없습니다."),


    private final boolean isSuccess;
    private final int code;
    private final String message;

    StatusCode(boolean isSuccess, int code, String message) {
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
    }
}
