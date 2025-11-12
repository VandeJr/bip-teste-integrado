package com.example.ejb.service;

import com.example.ejb.entity.Beneficio;
import com.example.ejb.dto.BeneficioPage;
import jakarta.ejb.EJB;
import jakarta.ejb.EJBException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
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
class BeneficioServiceTest {

    @Deployment
    public static JavaArchive createDeployment() {
        return ShrinkWrap.create(JavaArchive.class, "test.jar")
                .addClass(Beneficio.class)
                .addClass(BeneficioEjbService.class)
                .addClass(BeneficioPage.class)
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
    private Long nonExistentId = 9999L;

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
    @DisplayName("Should CREATE a new Beneficio")
    void testCreateBeneficio() {
        Beneficio novo = new Beneficio();
        novo.setName("Novo Benefício");
        novo.setValue(new BigDecimal("10.00"));
        novo.setActive(true);

        Beneficio criado = beneficioService.create(novo);

        assertNotNull(criado.getId());
        assertEquals("Novo Benefício", criado.getName());

        Beneficio encontrado = em.find(Beneficio.class, criado.getId());
        assertEquals("Novo Benefício", encontrado.getName());
    }

    @Test
    @DisplayName("Should fail to CREATE with invalid data (Null Name)")
    void testCreateBeneficio_InvalidName() {
        Beneficio novo = new Beneficio();
        novo.setValue(new BigDecimal("10.00"));

        Exception e = assertThrows(EJBException.class, () -> {
            beneficioService.create(novo);
        });

        Throwable cause = e.getCause();
        assertInstanceOf(IllegalArgumentException.class, cause);
        assertTrue(cause.getMessage().contains("name is mandatory"));
    }

    @Test
    @DisplayName("Should FIND a Beneficio by ID")
    void testFindById_Success() {
        Optional<Beneficio> resultado = beneficioService.findById(fromId);

        assertTrue(resultado.isPresent());
        assertEquals("Conta Origem", resultado.get().getName());
    }

    @Test
    @DisplayName("Should return empty Optional when FINDING non-existent ID")
    void testFindById_NotFound() {
        Optional<Beneficio> resultado = beneficioService.findById(nonExistentId);

        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Should FIND ALL Beneficios (Paginated)")
    void testFindAll_Paginated() {
        BeneficioPage page1 = beneficioService.findAll(0, 1);

        assertEquals(1, page1.content().size());
        assertEquals(2, page1.totalElements());

        BeneficioPage page2 = beneficioService.findAll(1, 1);
        assertEquals(1, page2.content().size());
        assertEquals(2, page2.totalElements());

        BeneficioPage pageCompleta = beneficioService.findAll(0, 5);
        assertEquals(2, pageCompleta.content().size());
        assertEquals(2, pageCompleta.totalElements());
    }

    @Test
    @DisplayName("Should UPDATE an existing Beneficio")
    void testUpdateBeneficio() {
        Beneficio paraAtualizar = beneficioService.findById(toId).get();
        Long versaoAntiga = paraAtualizar.getVersion();

        paraAtualizar.setName("Nome Atualizado");
        paraAtualizar.setValue(new BigDecimal("99.99"));

        Beneficio atualizado = beneficioService.update(toId, paraAtualizar);

        assertEquals("Nome Atualizado", atualizado.getName());
        assertEquals(0, new BigDecimal("99.99").compareTo(atualizado.getValue()));

        assertEquals(versaoAntiga + 1, atualizado.getVersion());
    }

    @Test
    @DisplayName("Should fail to UPDATE non-existent Beneficio")
    void testUpdateBeneficio_NotFound() {
        Beneficio fantasma = new Beneficio();
        fantasma.setName("Fantasma");
        fantasma.setValue(BigDecimal.ONE);

        Exception e = assertThrows(EJBException.class, () -> {
            beneficioService.update(nonExistentId, fantasma);
        });

        Throwable cause = e.getCause();
        assertInstanceOf(EntityNotFoundException.class, cause);
    }

    @Test
    @DisplayName("Should DELETE an existing Beneficio")
    void testDeleteBeneficio() {
        assertNotNull(em.find(Beneficio.class, fromId));

        beneficioService.delete(fromId);

        assertNull(em.find(Beneficio.class, fromId));
    }
}
