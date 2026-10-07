package com.issueflow.project;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<ProjectResponse> getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::toResponse);
    }

    public Optional<ProjectResponse> updateProject(
            Long id,
            UpdateProjectRequest request) {

        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setName(request.getName());
                    existingProject.setDescription(request.getDescription());

                    Project savedProject =
                            projectRepository.save(existingProject);

                    return toResponse(savedProject);
                });
    }

    public ProjectResponse createProject(CreateProjectRequest request) {
        Project project = new Project(
                null,
                request.getName(),
                request.getDescription()
        );

        Project savedProject = projectRepository.save(project);

        return toResponse(savedProject);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription()
        );
    }
}