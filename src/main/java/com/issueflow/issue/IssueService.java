package com.issueflow.issue;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.issueflow.project.Project;
import com.issueflow.project.ProjectRepository;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;

    public IssueService(
            IssueRepository issueRepository,
            ProjectRepository projectRepository) {
        this.issueRepository = issueRepository;
        this.projectRepository = projectRepository;
    }

    public List<IssueResponse> getIssues() {
        return issueRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<List<IssueResponse>> getIssuesByProjectId(Long projectId) {
        return projectRepository.findById(projectId)
                .map(project ->
                        issueRepository.findByProject_Id(projectId)
                                .stream()
                                .map(this::toResponse)
                                .toList()
                );
    }

    public Optional<IssueResponse> updateIssueStatus(
            Long id,
            UpdateIssueStatusRequest request) {

        return issueRepository.findById(id)
                .map(issue -> {
                    issue.setStatus(request.getStatus());

                    Issue savedIssue = issueRepository.save(issue);

                    return toResponse(savedIssue);
                });
    }

    public Optional<IssueResponse> createIssue(
            Long projectId,
            CreateIssueRequest request) {

        return projectRepository.findById(projectId)
                .map(project -> {
                    Issue issue = new Issue(
                            null,
                            request.getTitle(),
                            request.getDescription(),
                            IssueStatus.OPEN,
                            project
                    );

                    Issue savedIssue = issueRepository.save(issue);

                    return toResponse(savedIssue);
                });
    }
    
    private IssueResponse toResponse(Issue issue) {
        return new IssueResponse(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus(),
                issue.getProject().getId(),
                issue.getProject().getName()
        );
    }
}