package com.example.ejb.service;

import com.example.ejb.dto.BeneficioPage;
import com.example.ejb.entity.Beneficio;
import jakarta.ejb.EJB;
import jakarta.ejb.EJBException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit5.ArquillianExtension;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import jakarta.inject.Inject;
import jakarta.transaction.UserTransaction;

@ExtendWith(ArquillianExtension.class)
class BeneficioEjbServiceTest {

    @Deployment
    public static JavaArchive createDeployment() {
        return ShrinkWrap.create(JavaArchive.class, "test.jar")
                .addClass(Beneficio.class)
                .addClass(BeneficioPage.class)
                .addClass(BeneficioEjbService.class)
                .addAsManifestResource("META-INF/persistence.xml", "persistence.xml")
                .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    @EJB
    private BeneficioEjbService beneficioService;

    @PersistenceContext
    private EntityManager em;

    @Inject
    private UserTransaction utx;

    private Long fromId;
    private Long toId;

    @BeforeEach
    void setUp() throws Exception {
        try {
            utx.begin();

            em.createQuery("DELETE FROM Beneficio").executeUpdate();

            Beneficio fromAcc = new Beneficio();
            fromAcc.setName("Conta Origem");
            fromAcc.setValue(new BigDecimal("100.00"));
            fromAcc.setActive(true);
            em.persist(fromAcc);

            Beneficio toAcc = new Beneficio();
            toAcc.setName("Conta Destino");
            toAcc.setValue(new BigDecimal("50.00"));
            toAcc.setActive(true);
            em.persist(toAcc);

            em.flush();

            fromId = fromAcc.getId();
            toId = toAcc.getId();

            utx.commit();

        } catch (Exception e) {
            try {
                utx.rollback();
            } catch (Exception rollbackEx) {
                System.err.println("Rollback falhou: " + rollbackEx.getMessage());
            }
            throw new RuntimeException("Falha no setUp: " + e.getMessage(), e);
        }
    }

    @Test
    @DisplayName("Should transfer successfully when funds are sufficient")
    void testSuccessfulTransfer() {
        beneficioService.transfer(fromId, toId, new BigDecimal("25.00"));

        Beneficio fromUpdated = beneficioService.findById(fromId)
                .orElseThrow(() -> new AssertionError("Conta 'from' não encontrada."));
        Beneficio toUpdated = beneficioService.findById(toId)
                .orElseThrow(() -> new AssertionError("Conta 'to' não encontrada."));

        assertEquals(0, new BigDecimal("75.00").compareTo(fromUpdated.getValue()), "Saldo 'from' incorreto.");
        assertEquals(0, new BigDecimal("75.00").compareTo(toUpdated.getValue()), "Saldo 'to' incorreto.");
    }

    @Test
    @DisplayName("Should throw exception and rollback when transaction don't meet requeriments")
    void testInvalidTransfer() {
        assertThrows(Exception.class, () -> {
            // No funds available
            beneficioService.transfer(fromId, toId, new BigDecimal("200.00"));
        });
        assertThrows(Exception.class, () -> {
            // Invalid value
            beneficioService.transfer(fromId, toId, null);
        });
        assertThrows(Exception.class, () -> {
            // Invalid value
            beneficioService.transfer(fromId, toId, new BigDecimal("-20.00"));
        });
        assertThrows(Exception.class, () -> {
            // Invalid account
            beneficioService.transfer(null, toId, new BigDecimal("100.00"));
        });
        assertThrows(Exception.class, () -> {
            // Invalid account
            beneficioService.transfer(fromId, null, new BigDecimal("100.00"));
        });
        assertThrows(Exception.class, () -> {
            // Account not found
            beneficioService.transfer(fromId + toId, toId, new BigDecimal("100.00"));
        });
        assertThrows(Exception.class, () -> {
            // Account not found
            beneficioService.transfer(fromId, toId + toId, new BigDecimal("100.00"));
        });

        Beneficio fromUnchanged = beneficioService.findById(fromId).get();
        Beneficio toUnchanged = beneficioService.findById(toId).get();

        assertEquals(0, new BigDecimal("100.00").compareTo(fromUnchanged.getValue()),
                "Saldo 'from' foi alterado (Rollback falhou).");
        assertEquals(0, new BigDecimal("50.00").compareTo(toUnchanged.getValue()),
                "Saldo 'to' foi alterado (Rollback falhou).");
    }
}
