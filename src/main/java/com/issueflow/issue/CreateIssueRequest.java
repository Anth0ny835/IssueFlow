package com.issueflow.issue;

import jakarta.validation.constraints.NotBlank;

public class CreateIssueRequest {

    @NotBlank(message = "Issue title is required")
    private String title;

    private String description;

    public CreateIssueRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}