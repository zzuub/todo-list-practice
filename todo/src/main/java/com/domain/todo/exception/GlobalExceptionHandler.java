package com.domain.todo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApiException(ApiException e) {
        ExceptionCode code = e.getExceptionCode();
        if (Objects.isNull(code)) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }

        return ResponseEntity
                .status(code.getStatus())
                .body(Map.of(
                        "success", false,
                        "code", code.getCode(),
                        "message", code.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body(Map.of(
                        "success", false,
                        "code", "ERROR999",
                        "message", "서버 내부 오류가 발생했습니다."
                ));
    }
}