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
    REPO_PLAT_NOT_EXIST(false, 402, "해당하는 저장소 플랫폼이 존재하지 않습니다."),

    // AI Server : 500
    AI_SERVER_ERROR(false, 500, "AI 서버로부터 응답을 받지 못했습니다."),

    // Member : 600
    COOKIE_NOT_FOUND(false, 600, "쿠키가 존재하지 않습니다."),
    MEMBER_NOT_EXIST(false, 601, "사용자가 존재하지 않습니다."),
    // api : 800
    DATA_NOT_EXIST(false, 800, "api 응답이 존재하지 않습니다."),
    CANNOT_GET_CONTRIBUTOR(false, 801, "contributor 수를 가져오는데 실패했습니다.");


//    //게임 : 500
//    GAME_NOT_FOUND(false, 500,"게임을 찾을 수 없습니다." ),
//    GAME_SAVE(true, 501, "정상적으로 저장 되었습니다."),
//    GAME_STATISTICS_NOT_FOUND(false, 502, "통계 데이터가 없습니다."),
//
//    //좋아요 : 600
//    PREFER_CANNOT_SAVE(false,600,"좋아요를 등록할 수 없습니다."),
//    PREFER_NOT_FOUND(false,601,"등록된 좋아요 정보가 없습니다."),
//
//    // 태그 : 700
//    CODE_NOT_EXIST(false, 700, "해당 코드가 존재하지 않습니다."),
//    TAG_NOT_EXIST(false, 701, "해당 태그가 존재하지 않습니다."),
//
//    // 크롤링: 800
//    CRAWLING_FAILED(false, 800, "크롤링이 실패하였습니다."),
//    CRAWLING_NOT_FOUND(false, 801, "검색 결과가 없습니다."),
//
//    //로그: 900
//    JSON_TRANS_FAIL(false, 900, "행동에 대해 JSON 변환에 실패했습니다.")
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
