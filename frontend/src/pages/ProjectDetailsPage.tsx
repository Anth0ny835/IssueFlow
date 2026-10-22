import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectById, type Project } from "../api/projects";
import {
  createIssue,
  getIssuesByProjectId,
  updateIssueStatus,
} from "../api/issues";
import type { Issue, IssueStatus } from "../types/issue";
import "./ProjectDetailsPage.css";

const issueStatuses: IssueStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
];

function ProjectDetailsPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [issueFormError, setIssueFormError] = useState("");

  const [updatingIssueId, setUpdatingIssueId] = useState<number | null>(
    null,
  );
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    async function loadProjectDetails() {
      const numericProjectId = Number(projectId);

      if (!projectId || Number.isNaN(numericProjectId)) {
        setError("Invalid project");
        setIsLoading(false);
        return;
      }

      try {
        const [projectData, issueData] = await Promise.all([
          getProjectById(numericProjectId),
          getIssuesByProjectId(numericProjectId),
        ]);

        setProject(projectData);
        setIssues(issueData);
      } catch {
        setError("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjectDetails();
  }, [projectId]);

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateIssueModal();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isCreateModalOpen, isCreatingIssue]);

  function openCreateIssueModal() {
    setIssueFormError("");
    setIsCreateModalOpen(true);
  }

  function closeCreateIssueModal() {
    if (isCreatingIssue) {
      return;
    }

    setIsCreateModalOpen(false);
    setIssueTitle("");
    setIssueDescription("");
    setIssueFormError("");
  }

  async function handleCreateIssue(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!project) {
      return;
    }

    const trimmedTitle = issueTitle.trim();
    const trimmedDescription = issueDescription.trim();

    if (!trimmedTitle) {
      setIssueFormError("Issue title is required");
      return;
    }

    try {
      setIsCreatingIssue(true);
      setIssueFormError("");

      const createdIssue = await createIssue(project.id, {
        title: trimmedTitle,
        description: trimmedDescription,
      });

      setIssues((currentIssues) => [
        createdIssue,
        ...currentIssues,
      ]);

      setIssueTitle("");
      setIssueDescription("");
      setIsCreateModalOpen(false);
    } catch {
      setIssueFormError("Failed to create issue");
    } finally {
      setIsCreatingIssue(false);
    }
  }

  async function handleStatusChange(
    issueId: number,
    status: IssueStatus,
  ) {
    try {
      setUpdatingIssueId(issueId);
      setStatusError("");

      const updatedIssue = await updateIssueStatus(issueId, {
        status,
      });

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId ? updatedIssue : issue,
        ),
      );
    } catch {
      setStatusError("Failed to update issue status");
    } finally {
      setUpdatingIssueId(null);
    }
  }

  function formatStatus(status: IssueStatus) {
    return status
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase(),
      )
      .join(" ");
  }

  if (isLoading) {
    return (
      <main className="project-details-page">
        <div className="project-details-message">
          Loading project...
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-details-page">
        <div className="project-details-message project-details-error">
          {error || "Project not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="project-details-page">
      <Link className="project-back-link" to="/projects">
        ← Back to Projects
      </Link>

      <section className="project-overview-card">
        <p className="project-overview-id">
          Project #{project.id}
        </p>

        <h1>{project.name}</h1>

        <p className="project-overview-description">
          {project.description || "No project description provided."}
        </p>
      </section>

      <section className="project-issues-section">
        <div className="project-issues-header">
          <div>
            <h2>Issues</h2>

            <p>
              {issues.length}{" "}
              {issues.length === 1 ? "issue" : "issues"} in this
              project
            </p>
          </div>

          <button
            className="project-primary-button"
            type="button"
            onClick={openCreateIssueModal}
          >
            <span aria-hidden="true">+</span>
            New Issue
          </button>
        </div>

        {statusError && (
          <div className="project-status-error">
            {statusError}
          </div>
        )}

        {issues.length === 0 ? (
          <div className="project-issues-empty">
            <div
              className="project-issues-empty-icon"
              aria-hidden="true"
            >
              IF
            </div>

            <h3>No issues yet</h3>

            <p>
              Create the first issue for this project to start
              tracking work.
            </p>

            <button
              className="project-primary-button"
              type="button"
              onClick={openCreateIssueModal}
            >
              Create Issue
            </button>
          </div>
        ) : (
          <div className="project-issues-list">
            {issues.map((issue) => (
              <article
                className="project-issue-card"
                key={issue.id}
              >
                <div className="project-issue-main">
                  <p className="project-issue-id">
                    Issue #{issue.id}
                  </p>

                  <h3>{issue.title}</h3>

                  <p className="project-issue-description">
                    {issue.description ||
                      "No issue description provided."}
                  </p>
                </div>

                <div className="project-issue-status">
                  <label
                    className="project-status-label"
                    htmlFor={`issue-status-${issue.id}`}
                  >
                    Status
                  </label>

                  <select
                    id={`issue-status-${issue.id}`}
                    className={`project-status-select project-status-${issue.status.toLowerCase()}`}
                    value={issue.status}
                    disabled={updatingIssueId === issue.id}
                    onChange={(event) =>
                      handleStatusChange(
                        issue.id,
                        event.target.value as IssueStatus,
                      )
                    }
                  >
                    {issueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <div
          className="issue-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateIssueModal();
            }
          }}
        >
          <section
            className="issue-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-issue-title"
          >
            <div className="issue-modal-header">
              <div>
                <p className="issue-modal-eyebrow">
                  NEW ISSUE
                </p>

                <h2 id="create-issue-title">
                  Create Issue
                </h2>

                <p>
                  Add an issue to {project.name}.
                </p>
              </div>

              <button
                className="issue-modal-close"
                type="button"
                aria-label="Close create issue dialog"
                onClick={closeCreateIssueModal}
                disabled={isCreatingIssue}
              >
                ×
              </button>
            </div>

            <form
              className="issue-form"
              onSubmit={handleCreateIssue}
            >
              <div className="issue-form-field">
                <label htmlFor="issue-title">
                  Issue Title
                </label>

                <input
                  id="issue-title"
                  placeholder="e.g. Login button not working"
                  value={issueTitle}
                  onChange={(event) =>
                    setIssueTitle(event.target.value)
                  }
                  autoFocus
                />
              </div>

              <div className="issue-form-field">
                <label htmlFor="issue-description">
                  Description
                </label>

                <textarea
                  id="issue-description"
                  rows={5}
                  placeholder="Describe the issue"
                  value={issueDescription}
                  onChange={(event) =>
                    setIssueDescription(event.target.value)
                  }
                />
              </div>

              {issueFormError && (
                <p className="issue-form-error">
                  {issueFormError}
                </p>
              )}

              <div className="issue-modal-actions">
                <button
                  className="project-secondary-button"
                  type="button"
                  onClick={closeCreateIssueModal}
                  disabled={isCreatingIssue}
                >
                  Cancel
                </button>

                <button
                  className="project-primary-button"
                  type="submit"
                  disabled={isCreatingIssue}
                >
                  {isCreatingIssue
                    ? "Creating..."
                    : "Create Issue"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default ProjectDetailsPage;