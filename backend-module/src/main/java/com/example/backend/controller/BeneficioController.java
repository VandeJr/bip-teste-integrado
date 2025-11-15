package com.example.backend.controller;

import com.example.ejb.entity.Beneficio;
import com.example.backend.service.BeneficioService;
import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.TransferRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/beneficios")
public class BeneficioController {

    private BeneficioService service;

    @Autowired
    public BeneficioController(BeneficioService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Beneficio> list(Pageable pageable) {
        return service.findAll(pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Beneficio create(@Valid @RequestBody BeneficioRequest requestDTO) {
        Beneficio beneficio = new Beneficio();
        beneficio.setName(requestDTO.name());
        beneficio.setDescription(requestDTO.description());
        beneficio.setValue(requestDTO.value());
        beneficio.setActive(requestDTO.active());
        return service.create(beneficio);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Beneficio> findById(@PathVariable("id") Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Beneficio update(@PathVariable("id") Long id, @Valid @RequestBody BeneficioRequest requestDTO) {
        Beneficio beneficio = new Beneficio();
        beneficio.setName(requestDTO.name());
        beneficio.setDescription(requestDTO.description());
        beneficio.setValue(requestDTO.value());
        beneficio.setActive(requestDTO.active());

        return service.update(beneficio, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@Valid @RequestBody TransferRequest request) {
        service.transfer(request.fromId(), request.toId(), request.amount());
        return ResponseEntity.ok().build();

    }
}
