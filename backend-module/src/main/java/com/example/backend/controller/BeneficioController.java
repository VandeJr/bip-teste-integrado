package com.example.backend.controller;

import com.example.ejb.entity.Beneficio;
import com.example.backend.service.BeneficioService;
import com.example.backend.dto.TransferRequest;

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
    public Beneficio create(@RequestBody Beneficio beneficio) {
        return service.create(beneficio);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Beneficio> findById(@PathVariable("id") Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Beneficio update(@PathVariable("id") Long id, @RequestBody Beneficio beneficio) {
        return service.update(beneficio, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            service.transfer(request.fromId(), request.toId(), request.amount());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Throwable cause = e.getCause();
            if (cause != null) {
                return ResponseEntity.badRequest().body(cause.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
