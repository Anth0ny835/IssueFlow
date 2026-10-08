package com.issueflow.issue;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;

import com.issueflow.exception.GlobalExceptionHandler;

@ExtendWith(MockitoExtension.class)
class IssueControllerTest {

    @Mock
    private IssueService issueService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        IssueController issueController = new IssueController(issueService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(issueController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getIssueById_whenIssueExists_shouldReturn200AndIssue()
            throws Exception {

        Long issueId = 1L;

        IssueResponse response = new IssueResponse(
                issueId,
                "Login bug",
                "Login does not work",
                IssueStatus.OPEN,
                10L,
                "Customer Portal");

        when(issueService.getIssueById(issueId))
                .thenReturn(Optional.of(response));

        mockMvc.perform(get("/api/issues/{id}", issueId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Login bug"))
                .andExpect(
                        jsonPath("$.description")
                                .value("Login does not work"))
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(
                        jsonPath("$.projectName")
                                .value("Customer Portal"));

        verify(issueService).getIssueById(issueId);
    }

    @Test
    void getIssueById_whenIssueDoesNotExist_shouldReturn404()
            throws Exception {

        Long issueId = 999L;

        when(issueService.getIssueById(issueId))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/issues/{id}", issueId))
                .andExpect(status().isNotFound());

        verify(issueService).getIssueById(issueId);
    }

    @Test
    void getIssues_shouldReturn200AndIssueList()
            throws Exception {

        IssueResponse issue1 = new IssueResponse(
                1L,
                "Login bug",
                "Login does not work",
                IssueStatus.OPEN,
                10L,
                "Customer Portal");

        IssueResponse issue2 = new IssueResponse(
                2L,
                "Dashboard bug",
                "Dashboard loads slowly",
                IssueStatus.IN_PROGRESS,
                10L,
                "Customer Portal");

        when(issueService.getIssues())
                .thenReturn(List.of(issue1, issue2));

        mockMvc.perform(get("/api/issues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Login bug"))
                .andExpect(jsonPath("$[0].status").value("OPEN"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].title").value("Dashboard bug"))
                .andExpect(jsonPath("$[1].status").value("IN_PROGRESS"));

        verify(issueService).getIssues();
    }

    @Test
    void getIssuesByProjectId_whenProjectHasIssues_shouldReturn200AndIssueList()
            throws Exception {

        Long projectId = 10L;

        IssueResponse issue1 = new IssueResponse(
                1L,
                "Login bug",
                "Login does not work",
                IssueStatus.OPEN,
                projectId,
                "Customer Portal");

        IssueResponse issue2 = new IssueResponse(
                2L,
                "Dashboard bug",
                "Dashboard loads slowly",
                IssueStatus.IN_PROGRESS,
                projectId,
                "Customer Portal");

        when(issueService.getIssuesByProjectId(projectId))
                .thenReturn(Optional.of(List.of(issue1, issue2)));

        mockMvc.perform(
                get("/api/projects/{projectId}/issues", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Login bug"))
                .andExpect(jsonPath("$[0].projectId").value(10))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].title").value("Dashboard bug"))
                .andExpect(jsonPath("$[1].projectId").value(10));

        verify(issueService).getIssuesByProjectId(projectId);
    }

    @Test
    void getIssuesByProjectId_whenProjectHasNoIssues_shouldReturn200AndEmptyList()
            throws Exception {

        Long projectId = 10L;

        when(issueService.getIssuesByProjectId(projectId))
                .thenReturn(Optional.of(List.of()));

        mockMvc.perform(
                get("/api/projects/{projectId}/issues", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(issueService).getIssuesByProjectId(projectId);
    }

    @Test
    void getIssuesByProjectId_whenProjectDoesNotExist_shouldReturn404()
            throws Exception {

        Long projectId = 999L;

        when(issueService.getIssuesByProjectId(projectId))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                get("/api/projects/{projectId}/issues", projectId))
                .andExpect(status().isNotFound());

        verify(issueService).getIssuesByProjectId(projectId);
    }

    @Test
    void createIssue_whenProjectExistsAndRequestIsValid_shouldReturn201AndIssue()
            throws Exception {

        Long projectId = 10L;

        IssueResponse response = new IssueResponse(
                1L,
                "Login bug",
                "Login does not work",
                IssueStatus.OPEN,
                projectId,
                "Customer Portal");

        when(issueService.createIssue(
                eq(projectId),
                any(CreateIssueRequest.class)))
                .thenReturn(Optional.of(response));

        mockMvc.perform(
                post("/api/projects/{projectId}/issues", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Login bug",
                                  "description": "Login does not work"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Login bug"))
                .andExpect(
                        jsonPath("$.description")
                                .value("Login does not work"))
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(
                        jsonPath("$.projectName")
                                .value("Customer Portal"));

        verify(issueService).createIssue(
                eq(projectId),
                any(CreateIssueRequest.class));
    }

    @Test
    void createIssue_whenProjectDoesNotExist_shouldReturn404()
            throws Exception {

        Long projectId = 999L;

        when(issueService.createIssue(
                eq(projectId),
                any(CreateIssueRequest.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                post("/api/projects/{projectId}/issues", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Login bug",
                                  "description": "Login does not work"
                                }
                                """))
                .andExpect(status().isNotFound());

        verify(issueService).createIssue(
                eq(projectId),
                any(CreateIssueRequest.class));
    }

    @Test
    void createIssue_withBlankTitle_shouldReturn400ValidationError()
            throws Exception {

        Long projectId = 10L;

        mockMvc.perform(
                post("/api/projects/{projectId}/issues", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "",
                                  "description": "Invalid issue"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(
                        jsonPath("$.error")
                                .value("Validation failed"))
                .andExpect(
                        jsonPath("$.fieldErrors.title")
                                .value("Issue title is required"));

        verify(issueService, never()).createIssue(
                eq(projectId),
                any(CreateIssueRequest.class));
    }

    @Test
    void updateIssueStatus_whenIssueExists_shouldReturn200AndUpdatedIssue()
            throws Exception {

        Long issueId = 1L;

        IssueResponse response = new IssueResponse(
                issueId,
                "Login bug",
                "Login does not work",
                IssueStatus.IN_PROGRESS,
                10L,
                "Customer Portal");

        when(issueService.updateIssueStatus(
                eq(issueId),
                any(UpdateIssueStatusRequest.class)))
                .thenReturn(Optional.of(response));

        mockMvc.perform(
                put("/api/issues/{id}/status", issueId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "status": "IN_PROGRESS"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Login bug"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(
                        jsonPath("$.projectName")
                                .value("Customer Portal"));

        verify(issueService).updateIssueStatus(
                eq(issueId),
                any(UpdateIssueStatusRequest.class));
    }

    @Test
    void updateIssueStatus_whenIssueDoesNotExist_shouldReturn404()
            throws Exception {

        Long issueId = 999L;

        when(issueService.updateIssueStatus(
                eq(issueId),
                any(UpdateIssueStatusRequest.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                put("/api/issues/{id}/status", issueId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "status": "RESOLVED"
                                }
                                """))
                .andExpect(status().isNotFound());

        verify(issueService).updateIssueStatus(
                eq(issueId),
                any(UpdateIssueStatusRequest.class));
    }

    @Test
    void updateIssueStatus_withMissingStatus_shouldReturn400ValidationError()
            throws Exception {

        Long issueId = 1L;

        mockMvc.perform(
                put("/api/issues/{id}/status", issueId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(
                        jsonPath("$.error")
                                .value("Validation failed"))
                .andExpect(
                        jsonPath("$.fieldErrors.status")
                                .value("Issue status is required"));

        verify(issueService, never()).updateIssueStatus(
                eq(issueId),
                any(UpdateIssueStatusRequest.class));
    }
}