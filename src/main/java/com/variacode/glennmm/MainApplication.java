package com.variacode.glennmm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Optional;


/**
 * Generic Liquidity Engine main application.
 * <p>
 * In a wreck? Need a check? Get Glen!
 * https://www.youtube.com/watch?v=ZZJ-L3gVbdA
 */
@SpringBootApplication
@Configuration
@EnableConfigurationProperties
@EnableTransactionManagement
public class MainApplication {

  private static final Logger LOG = LoggerFactory.getLogger(MainApplication.class);

  private final BuildProperties buildProperties;
  private final ApplicationContext applicationContext;

  @Autowired
  public MainApplication(ApplicationContext applicationContext, BuildProperties buildProperties) {
    this.applicationContext = applicationContext;
    this.buildProperties = buildProperties;
  }

  public static void main(String[] args) {
    SpringApplication.run(MainApplication.class, args);
  }

  public String getApplicationVersion() {
    return Optional.ofNullable(buildProperties.getVersion())
        .orElse("0.0.0-noversion");
  }

  public void shutdown() {
    StringWriter sw = new StringWriter();
    new Throwable("").printStackTrace(new PrintWriter(sw));
    String stackTrace = sw.toString();
    LOG.error("Application Shut down requested: " + stackTrace);
    ((ConfigurableApplicationContext) applicationContext).close();
  }

  @EventListener
  public void handleAppStart(ApplicationReadyEvent event) {
    LOG.info("Glen is now working!");
  }

  @EventListener
  @Order(Ordered.LOWEST_PRECEDENCE)
  public void handleAppDie(ContextClosedEvent event) {
    LOG.error("Stopping Glen :(");
  }

}
