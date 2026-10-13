package com.issueflow.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthUserResponse> register(
      @Valid @RequestBody RegisterRequest request) {
    return authService.register(request)
        .map(response -> ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response))
        .orElseGet(() -> ResponseEntity
            .status(HttpStatus.CONFLICT)
            .build());
  }
}