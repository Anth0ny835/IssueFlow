package com.issueflow.auth;

import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.issueflow.user.User;
import com.issueflow.user.UserRepository;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordHasher passwordHasher;

	public AuthService(
			UserRepository userRepository,
			PasswordHasher passwordHasher) {
		this.userRepository = userRepository;
		this.passwordHasher = passwordHasher;
	}

	public Optional<AuthUserResponse> register(
			RegisterRequest request) {
		String normalizedEmail = request
				.getEmail()
				.trim()
				.toLowerCase(Locale.ROOT);

		if (userRepository.existsByEmail(normalizedEmail)) {
			return Optional.empty();
		}

		String passwordHash = passwordHasher.hash(request.getPassword());

		User user = new User(
				null,
				normalizedEmail,
				passwordHash);

		User savedUser = userRepository.save(user);

		return Optional.of(toResponse(savedUser));
	}

	public Optional<AuthUserResponse> login(
			LoginRequest request) {
		String normalizedEmail = request
				.getEmail()
				.trim()
				.toLowerCase(Locale.ROOT);

		Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);

		if (userOptional.isEmpty()) {
			return Optional.empty();
		}

		User user = userOptional.get();

		boolean passwordMatches = passwordHasher.matches(
				request.getPassword(),
				user.getPasswordHash());

		if (!passwordMatches) {
			return Optional.empty();
		}

		return Optional.of(toResponse(user));
	}

	public Optional<AuthUserResponse> getUserById(
			Long userId) {
		return userRepository
				.findById(userId)
				.map(this::toResponse);
	}

	private AuthUserResponse toResponse(User user) {
		return new AuthUserResponse(
				user.getId(),
				user.getEmail());
	}
}