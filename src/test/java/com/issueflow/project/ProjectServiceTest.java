package com.issueflow.project;

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

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void createProject_shouldSaveAndReturnProjectResponse() {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("Customer Portal");
        request.setDescription("Web portal for customers");

        Project savedProject = new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
        );

        when(projectRepository.save(any(Project.class)))
                .thenReturn(savedProject);

        ProjectResponse response = projectService.createProject(request);

        assertEquals(1L, response.getId());
        assertEquals("Customer Portal", response.getName());
        assertEquals(
                "Web portal for customers",
                response.getDescription()
        );

        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void getProjectById_whenProjectDoesNotExist_shouldReturnEmpty() {
        Long projectId = 999L;

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.empty());

        var result = projectService.getProjectById(projectId);

        assertTrue(result.isEmpty());

        verify(projectRepository).findById(projectId);
    }
    
    @Test
    void getProjectById_whenProjectExists_shouldReturnProjectResponse() {
        Long projectId = 1L;

        Project project = new Project(
                projectId,
                "Customer Portal",
                "Web portal for customers"
        );

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.of(project));

        var result = projectService.getProjectById(projectId);

        assertTrue(result.isPresent());
        assertEquals(projectId, result.get().getId());
        assertEquals("Customer Portal", result.get().getName());
        assertEquals(
                "Web portal for customers",
                result.get().getDescription()
        );

        verify(projectRepository).findById(projectId);
    }

    @Test
    void updateProject_whenProjectExists_shouldUpdateAndReturnProjectResponse() {
        Long projectId = 1L;

        Project existingProject = new Project(
                projectId,
                "Old Project Name",
                "Old description"
        );

        UpdateProjectRequest request = new UpdateProjectRequest();
        request.setName("Updated Project Name");
        request.setDescription("Updated description");

        Project savedProject = new Project(
                projectId,
                "Updated Project Name",
                "Updated description"
        );

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.of(existingProject));

        when(projectRepository.save(existingProject))
                .thenReturn(savedProject);

        var result = projectService.updateProject(projectId, request);

        assertTrue(result.isPresent());
        assertEquals(projectId, result.get().getId());
        assertEquals("Updated Project Name", result.get().getName());
        assertEquals(
                "Updated description",
                result.get().getDescription()
        );

        verify(projectRepository).findById(projectId);
        verify(projectRepository).save(existingProject);
    }

    @Test
    void updateProject_whenProjectDoesNotExist_shouldReturnEmpty() {
        Long projectId = 999L;

        UpdateProjectRequest request = new UpdateProjectRequest();
        request.setName("Updated Project Name");
        request.setDescription("Updated description");

        when(projectRepository.findById(projectId))
                .thenReturn(java.util.Optional.empty());

        var result = projectService.updateProject(projectId, request);

        assertTrue(result.isEmpty());

        verify(projectRepository).findById(projectId);
        verify(projectRepository, never()).save(any(Project.class));
    }
    
    @Test
    void getProjects_shouldReturnProjectResponses() {
        Project project1 = new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
        );

        Project project2 = new Project(
                2L,
                "Internal Dashboard",
                "Dashboard for internal operations"
        );

        when(projectRepository.findAll())
                .thenReturn(java.util.List.of(project1, project2));

        var result = projectService.getProjects();

        assertEquals(2, result.size());

        assertEquals(1L, result.get(0).getId());
        assertEquals("Customer Portal", result.get(0).getName());

        assertEquals(2L, result.get(1).getId());
        assertEquals("Internal Dashboard", result.get(1).getName());

        verify(projectRepository).findAll();
    }
}