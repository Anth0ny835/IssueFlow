package com.issueflow.project;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import com.issueflow.exception.GlobalExceptionHandler;

import org.springframework.http.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        ProjectController projectController = new ProjectController(projectService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(projectController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getProjectById_whenProjectExists_shouldReturn200AndProject()
            throws Exception {

        Long projectId = 1L;

        ProjectResponse response = new ProjectResponse(
                projectId,
                "Customer Portal",
                "Web portal for customers");

        when(projectService.getProjectById(projectId))
                .thenReturn(Optional.of(response));

        mockMvc.perform(get("/api/projects/{id}", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Customer Portal"))
                .andExpect(
                        jsonPath("$.description")
                                .value("Web portal for customers"));

        verify(projectService).getProjectById(projectId);
    }

    @Test
    void getProjectById_whenProjectDoesNotExist_shouldReturn404()
            throws Exception {

        Long projectId = 999L;

        when(projectService.getProjectById(projectId))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/projects/{id}", projectId))
                .andExpect(status().isNotFound());

        verify(projectService).getProjectById(projectId);
    }

    @Test
    void createProject_withValidRequest_shouldReturn201AndProject()
            throws Exception {

        ProjectResponse response = new ProjectResponse(
                1L,
                "Customer Portal",
                "Web portal for customers");

        when(projectService.createProject(any(CreateProjectRequest.class)))
                .thenReturn(response);

        mockMvc.perform(
                post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Customer Portal",
                                  "description": "Web portal for customers"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Customer Portal"))
                .andExpect(
                        jsonPath("$.description")
                                .value("Web portal for customers"));

        verify(projectService)
                .createProject(any(CreateProjectRequest.class));
    }

    @Test
    void createProject_withBlankName_shouldReturn400ValidationError()
            throws Exception {

        mockMvc.perform(
                post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "description": "Invalid project"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(
                        jsonPath("$.error")
                                .value("Validation failed"))
                .andExpect(
                        jsonPath("$.fieldErrors.name")
                                .value("Project name is required"));

        verify(projectService, never())
                .createProject(any(CreateProjectRequest.class));
    }

    @Test
    void updateProject_whenProjectExists_shouldReturn200AndUpdatedProject()
            throws Exception {

        Long projectId = 1L;

        ProjectResponse response = new ProjectResponse(
                projectId,
                "Updated Customer Portal",
                "Updated project description");

        when(projectService.updateProject(
                org.mockito.ArgumentMatchers.eq(projectId),
                any(UpdateProjectRequest.class)))
                .thenReturn(Optional.of(response));

        mockMvc.perform(
                put("/api/projects/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Updated Customer Portal",
                                  "description": "Updated project description"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(
                        jsonPath("$.name")
                                .value("Updated Customer Portal"))
                .andExpect(
                        jsonPath("$.description")
                                .value("Updated project description"));

        verify(projectService).updateProject(
                org.mockito.ArgumentMatchers.eq(projectId),
                any(UpdateProjectRequest.class));
    }

    @Test
    void updateProject_whenProjectDoesNotExist_shouldReturn404()
            throws Exception {

        Long projectId = 999L;

        when(projectService.updateProject(
                org.mockito.ArgumentMatchers.eq(projectId),
                any(UpdateProjectRequest.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                put("/api/projects/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Updated Customer Portal",
                                  "description": "Updated project description"
                                }
                                """))
                .andExpect(status().isNotFound());

        verify(projectService).updateProject(
                org.mockito.ArgumentMatchers.eq(projectId),
                any(UpdateProjectRequest.class));
    }

    @Test
    void updateProject_withBlankName_shouldReturn400ValidationError()
            throws Exception {

        Long projectId = 1L;

        mockMvc.perform(
                put("/api/projects/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "description": "Updated project description"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(
                        jsonPath("$.error")
                                .value("Validation failed"))
                .andExpect(
                        jsonPath("$.fieldErrors.name")
                                .value("Project name is required"));

        verify(projectService, never()).updateProject(
                org.mockito.ArgumentMatchers.eq(projectId),
                any(UpdateProjectRequest.class));
    }
}