package com.issueflow.issue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByProject_Id(Long projectId);
}