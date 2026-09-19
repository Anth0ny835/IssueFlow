package com.issueflow.project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}