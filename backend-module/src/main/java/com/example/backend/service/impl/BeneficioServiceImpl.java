package com.example.backend.service.impl;

import com.example.backend.service.BeneficioService;

import com.example.ejb.dto.BeneficioPage;
import com.example.ejb.entity.Beneficio;
import com.example.ejb.service.BeneficioEjbService;

import jakarta.ejb.EJB;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@Service
public class BeneficioServiceImpl implements BeneficioService {

    @EJB(lookup = "java:global/ejb-module/BeneficioEjbService!com.example.ejb.service.BeneficioEjbService")
    private BeneficioEjbService ejb;

    public BeneficioServiceImpl(BeneficioEjbService ejb) {
        this.ejb = ejb;
    }

    @Override
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        this.ejb.transfer(fromId, toId, amount);
    }

    @Override
    public Page<Beneficio> findAll(Pageable pageable) {
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();

        BeneficioPage results = this.ejb.findAll(page, size);

        return new PageImpl<>(results.content(),
                pageable,
                results.totalElements());
    }

    @Override
    public Optional<Beneficio> findById(Long id) {
        return this.ejb.findById(id);
    }

    @Override
    public Beneficio create(Beneficio beneficio) {
        return this.ejb.create(beneficio);
    }

    @Override
    public Beneficio update(Beneficio beneficio, Long id) {
        return this.ejb.update(id, beneficio);
    }

    @Override
    public void delete(Long id) {
        this.ejb.delete(id);
    }
}
