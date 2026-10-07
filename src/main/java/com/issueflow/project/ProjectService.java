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

    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Optional<Project> updateProject(Long id, Project projectDetails) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setName(projectDetails.getName());
                    existingProject.setDescription(projectDetails.getDescription());

                    return projectRepository.save(existingProject);
                });
    }

    public Project createProject(CreateProjectRequest request) {
        Project project = new Project(
                null,
                request.getName(),
                request.getDescription()
        );

        return projectRepository.save(project);
    }
}