FROM openjdk:11-jre-slim
EXPOSE 8080
RUN mkdir /app
COPY ./build/libs/*.jar /app/demo-webapp.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/demo-webapp.jar"]
