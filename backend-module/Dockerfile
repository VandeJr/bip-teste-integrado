FROM eclipse-temurin:21-jre-alpine

ARG JAR_FILE=target/backend-module-*.jar

COPY ${JAR_FILE} app.jar

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8090

CMD ["java", "--enable-preview", "-jar", "/app.jar"]
