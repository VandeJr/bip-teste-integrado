#!/bin/sh


remote.connection.default.port=8080

exec java \
     --enable-preview \
     -Dremote.connection.default.host=${EJB_HOST} \
     -Dremote.connection.default.port=${EJB_PORT} \
     -Dremote.connection.default.username=${EJB_USER} \
     -Dremote.connection.default.password=${EJB_PASS} \
     -Dremote.connection.default.connect.options.org.xnio.Options.SASL_POLICY_NOANONYMOUS=false \
     -jar /app.jar
