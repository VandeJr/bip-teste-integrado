FROM quay.io/wildfly/wildfly:latest

ENV JAVA_OPTS="--enable-preview"

ARG EJB_USER=spring-user
ARG EJB_PASS=p@ssw0rd

COPY docker/postgresql-42.7.7.jar /opt/jboss/wildfly/standalone/deployments/
COPY target/ejb-module-1.0-SNAPSHOT.jar /opt/jboss/wildfly/standalone/deployments/
COPY docker/postgres-ds.xml /opt/jboss/wildfly/standalone/deployments/


RUN /opt/jboss/wildfly/bin/add-user.sh -a -u ${EJB_USER} -p ${EJB_PASS} -g "" --silent

