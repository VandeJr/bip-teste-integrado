package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors) {
    public ApiErrorResponse(HttpStatus status, String message) {
        this(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, null);
    }

    public ApiErrorResponse(HttpStatus status, String message, Map<String, String> fieldErrors) {
        this(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, fieldErrors);
    }
}
