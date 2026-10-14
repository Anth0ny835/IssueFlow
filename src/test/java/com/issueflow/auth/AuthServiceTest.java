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

	@Test
	void login_whenCredentialsAreCorrect_shouldReturnUser() {
		LoginRequest request = new LoginRequest();
		request.setEmail("  Anthony@Example.COM  ");
		request.setPassword("password123");

		User user = new User(
				1L,
				"anthony@example.com",
				"hashed-password");

		when(
				userRepository.findByEmail(
						"anthony@example.com"))
				.thenReturn(java.util.Optional.of(user));

		when(
				passwordHasher.matches(
						"password123",
						"hashed-password"))
				.thenReturn(true);

		var result = authService.login(request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().getId());
		assertEquals(
				"anthony@example.com",
				result.get().getEmail());

		verify(userRepository)
				.findByEmail("anthony@example.com");

		verify(passwordHasher)
				.matches(
						"password123",
						"hashed-password");
	}

	@Test
	void login_whenEmailDoesNotExist_shouldReturnEmpty() {
		LoginRequest request = new LoginRequest();
		request.setEmail("missing@example.com");
		request.setPassword("password123");

		when(
				userRepository.findByEmail(
						"missing@example.com"))
				.thenReturn(java.util.Optional.empty());

		var result = authService.login(request);

		assertTrue(result.isEmpty());

		verify(userRepository)
				.findByEmail("missing@example.com");

		verify(passwordHasher, never())
				.matches(
						any(String.class),
						any(String.class));
	}

	@Test
	void login_whenPasswordIsIncorrect_shouldReturnEmpty() {
		LoginRequest request = new LoginRequest();
		request.setEmail("anthony@example.com");
		request.setPassword("wrongpassword");

		User user = new User(
				1L,
				"anthony@example.com",
				"hashed-password");

		when(
				userRepository.findByEmail(
						"anthony@example.com"))
				.thenReturn(java.util.Optional.of(user));

		when(
				passwordHasher.matches(
						"wrongpassword",
						"hashed-password"))
				.thenReturn(false);

		var result = authService.login(request);

		assertTrue(result.isEmpty());

		verify(userRepository)
				.findByEmail("anthony@example.com");

		verify(passwordHasher)
				.matches(
						"wrongpassword",
						"hashed-password");
	}

	@Test
	void getUserById_whenUserExists_shouldReturnUser() {
		Long userId = 1L;

		User user = new User(
				userId,
				"anthony@example.com",
				"hashed-password");

		when(userRepository.findById(userId))
				.thenReturn(java.util.Optional.of(user));

		var result = authService.getUserById(userId);

		assertTrue(result.isPresent());
		assertEquals(userId, result.get().getId());
		assertEquals(
				"anthony@example.com",
				result.get().getEmail());

		verify(userRepository).findById(userId);
	}

	@Test
	void getUserById_whenUserDoesNotExist_shouldReturnEmpty() {
		Long userId = 999L;

		when(userRepository.findById(userId))
				.thenReturn(java.util.Optional.empty());

		var result = authService.getUserById(userId);

		assertTrue(result.isEmpty());

		verify(userRepository).findById(userId);
	}
}