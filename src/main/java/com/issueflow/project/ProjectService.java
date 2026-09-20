package com.issueflow.project;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final List<Project> projects = new ArrayList<>();

    public ProjectService() {
        projects.add(
            new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
            )
        );

        projects.add(
            new Project(
                2L,
                "Internal Dashboard",
                "Dashboard for internal operations"
            )
        );
    }

    public List<Project> getProjects() {
        return projects;
    }

    public Project createProject(Project project) {
        project.setId((long) projects.size() + 1);
        projects.add(project);

        return project;
    }
}