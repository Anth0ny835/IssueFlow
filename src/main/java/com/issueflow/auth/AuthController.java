package com.issueflow.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private static final String SESSION_USER_ID = "userId";

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

	@PostMapping("/login")
	public ResponseEntity<AuthUserResponse> login(
			@Valid @RequestBody LoginRequest request,
			HttpSession session) {
		return authService.login(request)
				.map(response -> {
					session.setAttribute(
							SESSION_USER_ID,
							response.getId());

					return ResponseEntity.ok(response);
				})
				.orElseGet(() -> ResponseEntity
						.status(HttpStatus.UNAUTHORIZED)
						.build());
	}

	@GetMapping("/me")
	public ResponseEntity<AuthUserResponse> getCurrentUser(
			HttpServletRequest request) {
		HttpSession session = request.getSession(false);

		if (session == null) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.build();
		}

		Object userIdAttribute = session.getAttribute(SESSION_USER_ID);

		if (!(userIdAttribute instanceof Long userId)) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.build();
		}

		return authService
				.getUserById(userId)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity
						.status(HttpStatus.UNAUTHORIZED)
						.build());
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(
			HttpServletRequest request) {
		HttpSession session = request.getSession(false);

		if (session != null) {
			session.invalidate();
		}

		return ResponseEntity.noContent().build();
	}
}