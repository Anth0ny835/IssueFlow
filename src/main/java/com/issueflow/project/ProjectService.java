package com.issueflow.project;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    public List<Project> getProjects() {
        return List.of(
            new Project(
                1L,
                "Customer Portal",
                "Web portal for customers"
            ),
            new Project(
                2L,
                "Internal Dashboard",
                "Dashboard for internal operations"
            )
        );
    }
}