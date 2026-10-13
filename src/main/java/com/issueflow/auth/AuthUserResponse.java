package com.issueflow.auth;

public class AuthUserResponse {

    private final Long id;
    private final String email;

    public AuthUserResponse(
            Long id,
            String email
    ) {
        this.id = id;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
}