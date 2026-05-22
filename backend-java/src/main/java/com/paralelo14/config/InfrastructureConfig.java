package com.paralelo14.config;

import java.net.URI;

import javax.sql.DataSource;

import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

@Configuration
public class InfrastructureConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment environment) {
        String legacyDatabaseUrl = clean(environment.getProperty("DATABASE_URL"));
        if (StringUtils.hasText(legacyDatabaseUrl)) {
            URI uri = URI.create(legacyDatabaseUrl);
            String[] credentials = credentials(uri.getUserInfo(),
                environment.getProperty("DB_USER", "postgres"),
                environment.getProperty("DB_PASSWORD", "neuro123"));
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port(uri.getPort(), 5432) + uri.getPath();
            if (StringUtils.hasText(uri.getQuery())) {
                jdbcUrl += "?" + uri.getQuery();
            }

            return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(jdbcUrl)
                .username(credentials[0])
                .password(credentials[1])
                .build();
        }

        return DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url(environment.getProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/paralelo14"))
            .username(environment.getProperty("spring.datasource.username", "postgres"))
            .password(environment.getProperty("spring.datasource.password", "neuro123"))
            .build();
    }

    @Bean
    @Primary
    public ConnectionFactory rabbitConnectionFactory(Environment environment) {
        String legacyRabbitUrl = clean(environment.getProperty("RABBITMQ_URL"));
        if (StringUtils.hasText(legacyRabbitUrl)) {
            URI uri = URI.create(legacyRabbitUrl);
            String[] credentials = credentials(uri.getUserInfo(),
                environment.getProperty("RABBITMQ_USER", "admin"),
                environment.getProperty("RABBITMQ_PASSWORD", "admin"));

            CachingConnectionFactory factory = new CachingConnectionFactory(uri.getHost(), port(uri.getPort(), 5672));
            factory.setUsername(credentials[0]);
            factory.setPassword(credentials[1]);

            String virtualHost = clean(uri.getPath());
            if (StringUtils.hasText(virtualHost) && !"/".equals(virtualHost)) {
                factory.setVirtualHost(virtualHost.startsWith("/") ? virtualHost.substring(1) : virtualHost);
            }
            return factory;
        }

        CachingConnectionFactory factory = new CachingConnectionFactory(
            environment.getProperty("spring.rabbitmq.host", "localhost"),
            Integer.parseInt(environment.getProperty("spring.rabbitmq.port", "5672"))
        );
        factory.setUsername(environment.getProperty("spring.rabbitmq.username", "admin"));
        factory.setPassword(environment.getProperty("spring.rabbitmq.password", "admin"));
        return factory;
    }

    private String clean(String value) {
        if (!StringUtils.hasText(value)) {
            return value;
        }
        String trimmed = value.trim();
        if (trimmed.length() >= 2 && trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            return trimmed.substring(1, trimmed.length() - 1);
        }
        return trimmed;
    }

    private int port(int value, int fallback) {
        return value > 0 ? value : fallback;
    }

    private String[] credentials(String userInfo, String defaultUser, String defaultPassword) {
        if (!StringUtils.hasText(userInfo)) {
            return new String[]{defaultUser, defaultPassword};
        }
        String[] split = userInfo.split(":", 2);
        if (split.length == 1) {
            return new String[]{split[0], defaultPassword};
        }
        return split;
    }
}
