package com.domain.todo;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class testController {
    @GetMapping("/test")
    public String test(){
        return "test";
    }

    @Operation(summary = "테스트 API")  // Swagger 문서화
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Swagger 동작함!");
    }
}
