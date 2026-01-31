# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Dependencies cachen
COPY pom.xml .
RUN mvn dependency:go-offline

# Build applicatie
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Kopieer jar
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot poort
EXPOSE 8080

# Optionele JVM opties
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75"

# Start Spring Boot met CMD
CMD ["java", "-jar", "app.jar"]