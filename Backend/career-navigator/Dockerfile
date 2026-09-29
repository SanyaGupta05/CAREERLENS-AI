FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN ./mvnw.cmd clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/career-navigator-0.0.1-SNAPSHOT.jar"]