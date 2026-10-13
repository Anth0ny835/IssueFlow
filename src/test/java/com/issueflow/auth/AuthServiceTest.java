package com.issueflow.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.issueflow.user.User;
import com.issueflow.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordHasher passwordHasher;

  @InjectMocks
  private AuthService authService;

  @Test
  void register_whenEmailIsAvailable_shouldCreateUser() {
    RegisterRequest request = new RegisterRequest();
    request.setEmail("  Anthony@Example.COM  ");
    request.setPassword("password123");

    when(
        userRepository.existsByEmail(
            "anthony@example.com"))
        .thenReturn(false);

    when(passwordHasher.hash("password123"))
        .thenReturn("hashed-password");

    User savedUser = new User(
        1L,
        "anthony@example.com",
        "hashed-password");

    when(userRepository.save(any(User.class)))
        .thenReturn(savedUser);

    var result = authService.register(request);

    assertTrue(result.isPresent());
    assertEquals(1L, result.get().getId());
    assertEquals(
        "anthony@example.com",
        result.get().getEmail());

    verify(userRepository)
        .existsByEmail("anthony@example.com");

    verify(passwordHasher)
        .hash("password123");

    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

    verify(userRepository).save(userCaptor.capture());

    User capturedUser = userCaptor.getValue();

    assertEquals(
        "anthony@example.com",
        capturedUser.getEmail());

    assertEquals(
        "hashed-password",
        capturedUser.getPasswordHash());
  }

  @Test
  void register_whenEmailAlreadyExists_shouldReturnEmpty() {
    RegisterRequest request = new RegisterRequest();
    request.setEmail("Anthony@Example.COM");
    request.setPassword("password123");

    when(
        userRepository.existsByEmail(
            "anthony@example.com"))
        .thenReturn(true);

    var result = authService.register(request);

    assertTrue(result.isEmpty());

    verify(userRepository)
        .existsByEmail("anthony@example.com");

    verify(passwordHasher, never())
        .hash(any(String.class));

    verify(userRepository, never())
        .save(any(User.class));
  }
}