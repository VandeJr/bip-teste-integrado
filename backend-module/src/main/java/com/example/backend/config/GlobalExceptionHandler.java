package com.example.backend.config;

import com.example.backend.dto.ApiErrorResponse;
import jakarta.ejb.EJBException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiErrorResponse apiError = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed. Check 'fieldErrors' for details.",
                errors);
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneralExceptions(Exception ex) {

        String errorMessage = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (ex instanceof EJBException && ex.getCause() != null) {
            Throwable cause = ex.getCause();
            errorMessage = cause.getMessage();

            if (cause instanceof IllegalArgumentException) {
                status = HttpStatus.BAD_REQUEST;
            } else if (cause instanceof EntityNotFoundException) {
                status = HttpStatus.NOT_FOUND;
            }
        }

        ApiErrorResponse apiError = new ApiErrorResponse(status, errorMessage);
        return new ResponseEntity<>(apiError, status);
    }
}
