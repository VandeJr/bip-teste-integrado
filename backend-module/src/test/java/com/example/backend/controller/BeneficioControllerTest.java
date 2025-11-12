package com.example.backend.controller;

import com.example.backend.service.BeneficioService;
import com.example.backend.dto.TransferRequest;
import com.example.ejb.entity.Beneficio;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BeneficioController.class)
class BeneficioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BeneficioService service;

    @Test
    @DisplayName("GET /api/v1/beneficios - Deve retornar uma página de benefícios")
    void testListar() throws Exception {
        Beneficio b1 = new Beneficio();
        b1.setId(1L);
        b1.setName("Benefício A");

        Page<Beneficio> paginaMock = new PageImpl<>(List.of(b1));

        when(service.findAll(any(Pageable.class))).thenReturn(paginaMock);

        mockMvc.perform(get("/api/v1/beneficios")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Benefício A"));
    }

    @Test
    @DisplayName("GET /api/v1/beneficios/{id} - Deve retornar 200 OK quando encontrar")
    void testFindById_Encontrado() throws Exception {
        Beneficio b1 = new Beneficio();
        b1.setId(1L);
        b1.setName("Benefício A");
        b1.setValue(BigDecimal.TEN);

        when(service.findById(1L)).thenReturn(Optional.of(b1));

        mockMvc.perform(get("/api/v1/beneficios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Benefício A"));
    }

    @Test
    @DisplayName("GET /api/v1/beneficios/{id} - Deve retornar 404 Not Found quando não encontrar")
    void testFindById_NaoEncontrado() throws Exception {
        when(service.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/beneficios/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/beneficios/transfer - Deve retornar 200 OK em sucesso")
    void testTransferencia() throws Exception {
        TransferRequest request = new TransferRequest(1L, 2L,
                new BigDecimal("100.00"));

        doNothing().when(service).transfer(any(Long.class), any(Long.class), any(BigDecimal.class));

        mockMvc.perform(post("/api/v1/beneficios/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/v1/beneficios/transfer - Deve retornar 400 Bad Request em falha")
    void testTransferencia_Falha() throws Exception {
        TransferRequest request = new TransferRequest(1L, 2L,
                new BigDecimal("-100.00"));

        doThrow(new IllegalArgumentException("Invalid amount: Must not be null and must be greater than zero."))
                .when(service).transfer(any(), any(), any());

        mockMvc
                .perform(post("/api/v1/beneficios/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid amount: Must not be null and must be greater than zero."));
    }
}
