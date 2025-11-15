package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record TransferRequest(

        @NotNull(message = "Origin ID (fromId) is mandatory") Long fromId,

        @NotNull(message = "Destination ID (toId) is mandatory") Long toId,

        @NotNull(message = "Amount is mandatory") @DecimalMin(value = "0.1", inclusive = false, message = "Amount must be greater than 0.1") BigDecimal amount) {
}
