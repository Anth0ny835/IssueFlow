package com.issueflow.issue;

public class IssueResponse {

    private Long id;
    private String title;
    private String description;
    private IssueStatus status;
    private Long projectId;
    private String projectName;

    public IssueResponse(
            Long id,
            String title,
            String description,
            IssueStatus status,
            Long projectId,
            String projectName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.projectId = projectId;
        this.projectName = projectName;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }
}