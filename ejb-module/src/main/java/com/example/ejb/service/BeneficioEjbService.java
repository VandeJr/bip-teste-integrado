package com.example.ejb.service;

import com.example.ejb.entity.Beneficio;

import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.annotation.Resource;
import jakarta.ejb.SessionContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Stateless
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    @Resource
    private SessionContext sessionContext;

    private static final int MAX_RETRIES = 3;
    private static final Logger logger = LoggerFactory.getLogger(BeneficioEjbService.class);

    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        validateParameters(fromId, toId, amount);

        BeneficioEjbService self = sessionContext.getBusinessObject(BeneficioEjbService.class);

        for (int i = 0; i < MAX_RETRIES; i++) {
            try {
                logger.info(STR."Transfer attempt \{i + 1}/\{MAX_RETRIES}...");
                self.doTransfer(fromId, toId, amount);
                logger.info(STR."Transfer \{fromId} -> \{toId} completed successfully.");
                return;
            } catch (OptimisticLockException ole) {
                if (i == MAX_RETRIES - 1) {
                    logger.error(STR."Maximum retries (\{MAX_RETRIES}) exhausted for transfer \{fromId} -> \{toId}.", ole);
                    throw new RuntimeException(STR."Failed to transfer after \{MAX_RETRIES} attempts due to a concurrency conflict.", ole);
                } else {
                    logger.warn(STR."OptimisticLockException on attempt \{i + 1}/\{MAX_RETRIES}. Retrying...", ole);
                }
            }
        }
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void doTransfer(Long fromId, Long toId, BigDecimal amount) {
        Beneficio from = this.findById(fromId)
                .orElseThrow(() -> new EntityNotFoundException(STR."Origin account not found (ID: \{fromId})"));
        Beneficio to = this.findById(toId)
                .orElseThrow(() -> new EntityNotFoundException(STR."Destination account not found (ID: \{toId})"));

        BigDecimal fromValor = from.getValue();
        if (fromValor.compareTo(amount) < 0) {
            throw new IllegalArgumentException(STR."Insufficient funds. Available: \{fromValor}, Requested: \{amount}");
        }

        from.setValue(fromValor.subtract(amount));
        to.setValue(to.getValue().add(amount));

        em.flush();
    }

    private void validateParameters(Long fromId, Long toId, BigDecimal amount) {
        if (fromId == null || toId == null || fromId.equals(toId))
            throw new IllegalArgumentException(
                    "Invalid account IDs: 'fromId' and 'toId' must not be null and cannot be equal.");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Invalid amount: Must not be null and must be greater than zero.");
    }

    public Beneficio create(Beneficio beneficio) {
        if (beneficio == null)
            throw new IllegalArgumentException("Beneficio cannot be null.");
        if (beneficio.getName() == null || beneficio.getName().isBlank())
            throw new IllegalArgumentException("Beneficio name is mandatory.");
        if (beneficio.getValue() == null || beneficio.getValue().compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Beneficio value must not be null or negative.");

        em.persist(beneficio);
        em.flush();
        return beneficio;
    }

    public Optional<Beneficio> findById(Long id) {
        return Optional.ofNullable(em.find(Beneficio.class, id));
    }

    public List<Beneficio> findAll() {
        return em.createQuery("SELECT b FROM Beneficio b", Beneficio.class).getResultList();
    }

    public Beneficio update(Long id, Beneficio updated) {
        Beneficio existing = this.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(STR."Beneficio with ID \{id} not found"));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setValue(updated.getValue());
        existing.setActive(updated.getActive());

        return em.merge(existing);
    }

    public void delete(Long id) {
        Beneficio existing = this.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(STR."Beneficio with ID \{id} not found"));
        em.remove(existing);
    }
}
