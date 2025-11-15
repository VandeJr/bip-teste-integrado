package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record BeneficioRequest(

        @NotBlank(message = "Name is mandatory") @Size(max = 100, message = "Name must be 100 characters or less") String name,

        @Size(max = 255, message = "Description must be 255 characters or less") String description,

        @NotNull(message = "Value is mandatory") @DecimalMin(value = "0.0", inclusive = false, message = "Value must be positive") BigDecimal value,

        @NotNull(message = "Active status is mandatory") Boolean active) {
}
