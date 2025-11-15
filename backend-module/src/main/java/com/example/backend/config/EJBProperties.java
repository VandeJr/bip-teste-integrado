package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class EJBProperties {
    @Value("${EJB_HOST}")
    private String host;
    @Value("${EJB_PORT}")
    private String port;
    @Value("${EJB_USER}")
    private String username;
    @Value("${EJB_PASS}")
    private String password;

    public EJBProperties() {
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
