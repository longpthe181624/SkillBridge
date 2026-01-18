FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Clear Maven cache to avoid corrupted artifacts
RUN rm -rf /root/.m2/repository/org/aspectj

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Copy Maven settings if exists (create directory first)
RUN mkdir -p /root/.m2
COPY .mvn/settings.xml /root/.m2/settings.xml

# Download dependencies (with retry mechanism)
# Retry up to 5 times if download fails with longer wait time
RUN for i in 1 2 3 4 5; do \
        mvn dependency:go-offline -B -U && break || \
        (echo "Attempt $i failed, retrying..." && sleep 10 && \
         rm -rf /root/.m2/repository/org/jboss/logging && \
         rm -rf /root/.m2/repository/org/aspectj); \
    done || (echo "Failed to download dependencies after 5 attempts" && exit 1)

# Copy source code
COPY src src

# Build application (single attempt, no retry)
RUN echo "=== Building application ===" && \
    mvn -B -DskipTests package > /tmp/build.log 2>&1; \
    MVN_EXIT_CODE=$$?; \
    cat /tmp/build.log; \
    if [ $$MVN_EXIT_CODE -ne 0 ]; then \
        echo "=== Build failed with exit code $$MVN_EXIT_CODE ===" && \
        echo "=== Showing compilation errors ===" && \
        grep -i "error\|fail\|cannot find symbol\|BUILD FAILURE" /tmp/build.log | tail -50 || tail -100 /tmp/build.log; \
        exit 1; \
    fi && \
    echo "=== Maven build completed successfully ===" && \
    echo "=== Verifying JAR file was created ===" && \
    if find /app/target -maxdepth 1 -name "*.jar" -type f 2>/dev/null | grep -q .; then \
        echo "=== Build successful - JAR file found ===" && \
        find /app/target -maxdepth 1 -name "*.jar" -type f -exec ls -lh {} \; && \
        echo "=== Build verification complete ==="; \
    else \
        echo "=== ERROR: Maven build succeeded but no JAR file found ===" && \
        echo "Listing contents of /app/target:" && \
        ls -la /app/target/ || echo "Target directory does not exist"; \
        exit 1; \
    fi

# Final verification: JAR file should already be verified in build step above
RUN echo "=== Final JAR file verification ===" && \
    find /app/target -maxdepth 1 -name "*.jar" -type f -exec ls -lh {} \; && \
    echo "JAR file ready for deployment"

FROM eclipse-temurin:17-jre
WORKDIR /app
# Use wildcard to find the JAR file (Spring Boot creates executable JAR)
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

