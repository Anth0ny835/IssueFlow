package com.issueflow.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.issueflow.exception.GlobalExceptionHandler;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

  @Mock
  private AuthService authService;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    AuthController authController = new AuthController(authService);

    mockMvc = MockMvcBuilders
        .standaloneSetup(authController)
        .setControllerAdvice(
            new GlobalExceptionHandler())
        .build();
  }

  @Test
  void register_whenRequestIsValid_shouldReturn201AndUser()
      throws Exception {

    AuthUserResponse response = new AuthUserResponse(
        1L,
        "anthony@example.com");

    when(
        authService.register(
            any(RegisterRequest.class)))
        .thenReturn(Optional.of(response));

    mockMvc.perform(
        post("/api/auth/register")
            .contentType(
                MediaType.APPLICATION_JSON)
            .content("""
                {
                  "email": "anthony@example.com",
                  "password": "password123"
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(
            jsonPath("$.email")
                .value(
                    "anthony@example.com"));

    verify(authService)
        .register(
            any(RegisterRequest.class));
  }

  @Test
  void register_whenEmailAlreadyExists_shouldReturn409()
      throws Exception {

    when(
        authService.register(
            any(RegisterRequest.class)))
        .thenReturn(Optional.empty());

    mockMvc.perform(
        post("/api/auth/register")
            .contentType(
                MediaType.APPLICATION_JSON)
            .content("""
                {
                  "email": "anthony@example.com",
                  "password": "password123"
                }
                """))
        .andExpect(status().isConflict());

    verify(authService)
        .register(
            any(RegisterRequest.class));
  }

  @Test
  void register_whenEmailIsInvalid_shouldReturn400ValidationError()
      throws Exception {

    mockMvc.perform(
        post("/api/auth/register")
            .contentType(
                MediaType.APPLICATION_JSON)
            .content("""
                {
                  "email": "not-an-email",
                  "password": "password123"
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(
            jsonPath("$.error")
                .value("Validation failed"))
        .andExpect(
            jsonPath("$.fieldErrors.email")
                .value("Email must be valid"));

    verify(authService, never())
        .register(
            any(RegisterRequest.class));
  }

  @Test
  void register_whenPasswordIsTooShort_shouldReturn400ValidationError()
      throws Exception {

    mockMvc.perform(
        post("/api/auth/register")
            .contentType(
                MediaType.APPLICATION_JSON)
            .content("""
                {
                  "email": "anthony@example.com",
                  "password": "123"
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(
            jsonPath("$.error")
                .value("Validation failed"))
        .andExpect(
            jsonPath("$.fieldErrors.password")
                .value(
                    "Password must be at least 8 characters"));

    verify(authService, never())
        .register(
            any(RegisterRequest.class));
  }
}