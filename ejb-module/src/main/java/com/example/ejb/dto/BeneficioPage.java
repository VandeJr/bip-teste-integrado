package com.example.ejb.dto;

import com.example.ejb.entity.Beneficio;
import java.io.Serializable;
import java.util.List;

public record BeneficioPage(List<Beneficio> content, Long totalElements) {
}
