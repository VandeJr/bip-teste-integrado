package com.example.ejb.service;

import jakarta.ejb.Remote;
import com.example.ejb.dto.BeneficioPage;
import com.example.ejb.entity.Beneficio;
import java.math.BigDecimal;

@Remote
public interface BeneficioServiceRemote {
    void transfer(Long fromId, Long toId, BigDecimal amount);

    BeneficioPage findAll(int page, int size);

    Beneficio findById(Long id);

    Beneficio create(Beneficio beneficio);

    Beneficio update(Long id, Beneficio updated);

    void delete(Long id);
}
