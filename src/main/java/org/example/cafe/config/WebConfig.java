package org.example.cafe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Указываем, какие пути разрешить
                .allowedOrigins("http://127.0.0.1:5500", "http://127.0.0.1:5501") // Разрешенные источники
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Разрешенные методы
                .allowCredentials(true); // Если нужно использовать куки
    }
}
