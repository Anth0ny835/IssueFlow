package com.issueflow.auth;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PasswordHasherTest {

  private final PasswordHasher passwordHasher = new PasswordHasher();

  @Test
  void hash_shouldNotReturnRawPassword() {
    String password = "password123";

    String passwordHash = passwordHasher.hash(password);

    assertNotEquals(password, passwordHash);
  }

  @Test
  void matches_whenPasswordIsCorrect_shouldReturnTrue() {
    String password = "password123";

    String passwordHash = passwordHasher.hash(password);

    boolean matches = passwordHasher.matches(
        password,
        passwordHash);

    assertTrue(matches);
  }

  @Test
  void matches_whenPasswordIsWrong_shouldReturnFalse() {
    String password = "password123";

    String passwordHash = passwordHasher.hash(password);

    boolean matches = passwordHasher.matches(
        "wrongpassword",
        passwordHash);

    assertFalse(matches);
  }
}