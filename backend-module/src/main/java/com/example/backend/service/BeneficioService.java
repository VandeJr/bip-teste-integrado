package com.example.backend.service;

import com.example.ejb.entity.Beneficio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.math.BigDecimal;

public interface BeneficioService {
    void transfer(Long fromId, Long toId, BigDecimal amount);

    Page<Beneficio> findAll(Pageable pageable);

    Optional<Beneficio> findById(Long id);

    Beneficio create(Beneficio beneficio);

    Beneficio update(Beneficio beneficio, Long id);

    void delete(Long id);
}
