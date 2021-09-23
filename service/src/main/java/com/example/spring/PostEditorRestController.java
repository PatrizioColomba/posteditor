package com.example.spring;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PostEditorRestController {
    @GetMapping("/")
    public String index() {
        return "Hello! I'm spring";
    }
}
