package com.issueflow.project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @GetMapping("/sample")
    public Project getSampleProject() {
        return new Project(
            1L,
            "Customer Portal",
            "Web portal for customers"
        );
    }
    @GetMapping
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
