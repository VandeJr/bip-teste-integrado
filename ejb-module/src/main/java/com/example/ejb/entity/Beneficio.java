package com.example.ejb.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import jakarta.persistence.*;

import static java.lang.StringTemplate.STR;

@Entity
@Table(name = "BENEFICIO")
public class Beneficio implements Serializable {

    private static final long serialVersionUID = 1l;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false, updatable = false)
    private Long id;

    @Column(name = "NOME", length = 100, nullable = false)
    private String name;

    @Column(name = "DESCRICAO", length = 255)
    private String description;

    @Column(name = "VALOR", precision = 15, scale = 2, nullable = false)
    private BigDecimal value;

    @Column(name = "ATIVO", nullable = false)
    private Boolean active = true;

    @Version
    @Column(name = "VERSION", nullable = false)
    private Long version = 0L;

    public Beneficio() {
    }

    public Beneficio(Long id, String name, String description, BigDecimal value, Boolean active, Long version) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.value = value;
        this.active = active;
        this.version = version;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Beneficio beneficio = (Beneficio) o;
        return id != null ? id.equals(beneficio.id) : super.equals(o);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : super.hashCode();
    }

    @Override
    public String toString() {
        String descFormatted = (description == null)
                ? "null"
                : STR."\{description.substring(0, Math.min(description.length(), 20))}... [\{description.length()}]";

        return STR."""
            Beneficio{id=\{id}, \
            name='\{name}', \
            description='\{descFormatted}', \
            value=\{value}, \
            active=\{active}, \
            version=\{version}}""";
    }
}
