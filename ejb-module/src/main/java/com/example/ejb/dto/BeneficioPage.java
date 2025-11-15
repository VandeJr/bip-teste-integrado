package com.example.ejb.dto;

import com.example.ejb.entity.Beneficio;
import java.io.Serializable;
import java.util.List;

public class BeneficioPage implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Beneficio> content;
    private long totalElements;

    public BeneficioPage() {
    }

    public BeneficioPage(List<Beneficio> content, long totalElements) {
        this.content = content;
        this.totalElements = totalElements;
    }

    public List<Beneficio> getContent() {
        return content;
    }

    public void setContent(List<Beneficio> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
}
