package com.example.backend.service.impl;

import com.example.backend.service.BeneficioService;

import com.example.ejb.dto.BeneficioPage;
import com.example.ejb.entity.Beneficio;
import com.example.ejb.service.BeneficioServiceRemote;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.math.BigDecimal;
import java.util.Properties;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

@Service
public class BeneficioServiceImpl implements BeneficioService {

    private BeneficioServiceRemote ejb;

    public BeneficioServiceImpl() {
        try {
            final Properties jndiProperties = new Properties();
            jndiProperties.put(Context.INITIAL_CONTEXT_FACTORY,
                    "org.wildfly.naming.client.WildFlyInitialContextFactory");

            final Context context = new InitialContext(jndiProperties);
            String jndiName = "ejb:/ejb-module-1.0-SNAPSHOT/BeneficioEjbService!"
                    + BeneficioServiceRemote.class.getName();
            this.ejb = (BeneficioServiceRemote) context.lookup(jndiName);
        } catch (NamingException e) {
            throw new RuntimeException(
                    "Falha CRÍTICA ao iniciar o BeneficioSpringService: Não foi possível encontrar o EJB. Verifique se o WildFly está rodando e o EJB implantado.",
                    e);
        }
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

        return new PageImpl<>(results.getContent(),
                pageable,
                results.getTotalElements());
    }

    @Override
    public Optional<Beneficio> findById(Long id) {
        return Optional.ofNullable(this.ejb.findById(id));
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
