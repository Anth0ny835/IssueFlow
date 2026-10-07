package com.issueflow.issue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.issueflow.project.Project;
import com.issueflow.project.ProjectRepository;

@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private IssueService issueService;

    @Test
    void createIssue_whenProjectExists_shouldCreateIssueWithOpenStatus() {
        Long projectId = 1L;

        Project project = new Project(
                projectId,
                "Customer Portal",
                "Web portal for customers"
        );

        CreateIssueRequest request = new CreateIssueRequest();
        request.setTitle("Login button not working");
        request.setDescription("Clicking login does nothing");

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.of(project));

        when(issueRepository.save(any(Issue.class)))
                .thenAnswer(invocation -> {
                    Issue issue = invocation.getArgument(0);
                    issue.setId(1L);
                    return issue;
                });

        var result = issueService.createIssue(projectId, request);

        assertTrue(result.isPresent());

        assertEquals(1L, result.get().getId());
        assertEquals(
                "Login button not working",
                result.get().getTitle()
        );
        assertEquals(
                "Clicking login does nothing",
                result.get().getDescription()
        );
        assertEquals(
                IssueStatus.OPEN,
                result.get().getStatus()
        );
        assertEquals(
                projectId,
                result.get().getProjectId()
        );
        assertEquals(
                "Customer Portal",
                result.get().getProjectName()
        );

        verify(projectRepository).findById(projectId);
        verify(issueRepository).save(any(Issue.class));
    }

    @Test
    void createIssue_whenProjectDoesNotExist_shouldReturnEmpty() {
        Long projectId = 999L;

        CreateIssueRequest request = new CreateIssueRequest();
        request.setTitle("Login button not working");
        request.setDescription("Clicking login does nothing");

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.empty());

        var result = issueService.createIssue(projectId, request);

        assertTrue(result.isEmpty());

        verify(projectRepository).findById(projectId);
        verify(issueRepository, never()).save(any(Issue.class));
    }

    @Test
    void updateIssueStatus_whenIssueExists_shouldUpdateStatusAndReturnResponse() {
        Long issueId = 1L;

        Project project = new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
        );

        Issue existingIssue = new Issue(
                issueId,
                "Login button not working",
                "Clicking login does nothing",
                IssueStatus.OPEN,
                project
        );

        UpdateIssueStatusRequest request = new UpdateIssueStatusRequest();
        request.setStatus(IssueStatus.IN_PROGRESS);

        when(issueRepository.findById(issueId))
                .thenReturn(java.util.Optional.of(existingIssue));

        when(issueRepository.save(existingIssue))
                .thenReturn(existingIssue);

        var result = issueService.updateIssueStatus(issueId, request);

        assertTrue(result.isPresent());
        assertEquals(issueId, result.get().getId());
        assertEquals(IssueStatus.IN_PROGRESS, result.get().getStatus());
        assertEquals(1L, result.get().getProjectId());
        assertEquals("Customer Portal", result.get().getProjectName());

        verify(issueRepository).findById(issueId);
        verify(issueRepository).save(existingIssue);
    }

    @Test
    void updateIssueStatus_whenIssueDoesNotExist_shouldReturnEmpty() {
        Long issueId = 999L;

        UpdateIssueStatusRequest request = new UpdateIssueStatusRequest();
        request.setStatus(IssueStatus.RESOLVED);

        when(issueRepository.findById(issueId))
                .thenReturn(java.util.Optional.empty());

        var result = issueService.updateIssueStatus(issueId, request);

        assertTrue(result.isEmpty());

        verify(issueRepository).findById(issueId);
        verify(issueRepository, never()).save(any(Issue.class));
    }

    @Test
    void getIssueById_whenIssueExists_shouldReturnIssueResponse() {
        Long issueId = 1L;

        Project project = new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
        );

        Issue issue = new Issue(
                issueId,
                "Login button not working",
                "Clicking login does nothing",
                IssueStatus.OPEN,
                project
        );

        when(issueRepository.findById(issueId))
                .thenReturn(java.util.Optional.of(issue));

        var result = issueService.getIssueById(issueId);

        assertTrue(result.isPresent());
        assertEquals(issueId, result.get().getId());
        assertEquals("Login button not working", result.get().getTitle());
        assertEquals(IssueStatus.OPEN, result.get().getStatus());
        assertEquals(1L, result.get().getProjectId());
        assertEquals("Customer Portal", result.get().getProjectName());

        verify(issueRepository).findById(issueId);
    }

    @Test
    void getIssueById_whenIssueDoesNotExist_shouldReturnEmpty() {
        Long issueId = 999L;

        when(issueRepository.findById(issueId))
                .thenReturn(java.util.Optional.empty());

        var result = issueService.getIssueById(issueId);

        assertTrue(result.isEmpty());

        verify(issueRepository).findById(issueId);
    }

    @Test
    void getIssues_shouldReturnIssueResponses() {
        Project project = new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
        );

        Issue issue1 = new Issue(
                1L,
                "Login bug",
                "Login does not work",
                IssueStatus.OPEN,
                project
        );

        Issue issue2 = new Issue(
                2L,
                "Dashboard bug",
                "Dashboard loads slowly",
                IssueStatus.IN_PROGRESS,
                project
        );

        when(issueRepository.findAll())
                .thenReturn(java.util.List.of(issue1, issue2));

        var result = issueService.getIssues();

        assertEquals(2, result.size());

        assertEquals(1L, result.get(0).getId());
        assertEquals("Login bug", result.get(0).getTitle());
        assertEquals(IssueStatus.OPEN, result.get(0).getStatus());

        assertEquals(2L, result.get(1).getId());
        assertEquals("Dashboard bug", result.get(1).getTitle());
        assertEquals(IssueStatus.IN_PROGRESS, result.get(1).getStatus());

        verify(issueRepository).findAll();
    }

    @Test
    void getIssuesByProjectId_whenProjectHasIssues_shouldReturnIssueResponses() {
        Long projectId = 1L;

        Project project = new Project(
                projectId,
                "Customer Portal",
                "Web portal for customers"
        );

        Issue issue1 = new Issue(
                1L,
                "Login bug",
                "Login does not work",
                IssueStatus.OPEN,
                project
        );

        Issue issue2 = new Issue(
                2L,
                "Dashboard bug",
                "Dashboard loads slowly",
                IssueStatus.IN_PROGRESS,
                project
        );

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.of(project));

        when(issueRepository.findByProject_Id(projectId))
                .thenReturn(java.util.List.of(issue1, issue2));

        var result = issueService.getIssuesByProjectId(projectId);

        assertTrue(result.isPresent());
        assertEquals(2, result.get().size());

        assertEquals(projectId, result.get().get(0).getProjectId());
        assertEquals(projectId, result.get().get(1).getProjectId());

        verify(projectRepository).findById(projectId);
        verify(issueRepository).findByProject_Id(projectId);
    }

    @Test
    void getIssuesByProjectId_whenProjectHasNoIssues_shouldReturnEmptyList() {
        Long projectId = 1L;

        Project project = new Project(
                projectId,
                "Customer Portal",
                "Web portal for customers"
        );

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.of(project));

        when(issueRepository.findByProject_Id(projectId))
                .thenReturn(java.util.List.of());

        var result = issueService.getIssuesByProjectId(projectId);

        assertTrue(result.isPresent());
        assertTrue(result.get().isEmpty());

        verify(projectRepository).findById(projectId);
        verify(issueRepository).findByProject_Id(projectId);
    }

    @Test
    void getIssuesByProjectId_whenProjectDoesNotExist_shouldReturnEmpty() {
        Long projectId = 999L;

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.empty());

        var result = issueService.getIssuesByProjectId(projectId);

        assertTrue(result.isEmpty());

        verify(projectRepository).findById(projectId);
        verify(issueRepository, never()).findByProject_Id(projectId);
    }
}