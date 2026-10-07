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

    public List<Issue> getIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> updateIssueStatus(
            Long id,
            UpdateIssueStatusRequest request) {

        return issueRepository.findById(id)
                .map(issue -> {
                    issue.setStatus(request.getStatus());

                    return issueRepository.save(issue);
                });
    }

    public Optional<Issue> createIssue(Long projectId, Issue issue) {
        return projectRepository.findById(projectId)
                .map(project -> {
                    issue.setProject(project);

                    if (issue.getStatus() == null) {
                        issue.setStatus(IssueStatus.OPEN);
                    }

                    return issueRepository.save(issue);
                });
    }
}