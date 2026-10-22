import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  createProject,
  getProjects,
  updateProject,
  type Project,
} from "../api/projects";
import "./ProjectsPage.css";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [editingProjectId, setEditingProjectId] = useState<number | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch {
        setError("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateModal();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isCreateModalOpen]);

  function openCreateModal() {
    setFormError("");
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isSubmitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setName("");
    setDescription("");
    setFormError("");
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setFormError("Project name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const createdProject = await createProject({
        name: trimmedName,
        description: trimmedDescription,
      });

      setProjects((currentProjects) => [
        ...currentProjects,
        createdProject,
      ]);

      setName("");
      setDescription("");
      setIsCreateModalOpen(false);
    } catch {
      setFormError("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(project: Project) {
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditDescription(project.description);
    setEditError("");
  }

  function cancelEditing() {
    setEditingProjectId(null);
    setEditName("");
    setEditDescription("");
    setEditError("");
  }

  async function handleUpdateProject(
    event: FormEvent<HTMLFormElement>,
    projectId: number,
  ) {
    event.preventDefault();

    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();

    if (!trimmedName) {
      setEditError("Project name is required");
      return;
    }

    try {
      setIsUpdating(true);
      setEditError("");

      const updatedProject = await updateProject(projectId, {
        name: trimmedName,
        description: trimmedDescription,
      });

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId ? updatedProject : project,
        ),
      );

      cancelEditing();
    } catch {
      setEditError("Failed to update project");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <main className="projects-page">
      <div className="projects-header">
        <div>
          <p className="projects-eyebrow">ISSUEFLOW</p>
          <h1>Projects</h1>
          <p>Manage software projects and their associated issues.</p>
        </div>

        <button
          className="primary-button projects-new-button"
          type="button"
          onClick={openCreateModal}
        >
          <span aria-hidden="true">+</span>
          New Project
        </button>
      </div>

      {isLoading && (
        <div className="projects-message">
          <p>Loading projects...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="projects-message projects-error">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <section className="projects-empty-state">
          <div className="projects-empty-icon" aria-hidden="true">
            IF
          </div>

          <h2>No projects yet</h2>

          <p>
            Create your first project to start tracking software issues in
            IssueFlow.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={openCreateModal}
          >
            Create Project
          </button>
        </section>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <section className="projects-content">
          <div className="projects-section-heading">
            <div>
              <h2>All Projects</h2>

              <p>
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}
              </p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                {editingProjectId === project.id ? (
                  <form
                    className="project-edit-form"
                    onSubmit={(event) =>
                      handleUpdateProject(event, project.id)
                    }
                  >
                    <div className="form-field">
                      <label htmlFor={`project-name-${project.id}`}>
                        Project Name
                      </label>

                      <input
                        id={`project-name-${project.id}`}
                        value={editName}
                        onChange={(event) =>
                          setEditName(event.target.value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label
                        htmlFor={`project-description-${project.id}`}
                      >
                        Description
                      </label>

                      <textarea
                        id={`project-description-${project.id}`}
                        rows={4}
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                      />
                    </div>

                    {editError && (
                      <p className="form-error">{editError}</p>
                    )}

                    <div className="project-card-actions">
                      <button
                        className="primary-button"
                        type="submit"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={cancelEditing}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="project-card-header">
                      <div>
                        <p className="project-card-id">
                          Project #{project.id}
                        </p>

                        <h3>{project.name}</h3>
                      </div>
                    </div>

                    <p className="project-card-description">
                      {project.description ||
                        "No project description provided."}
                    </p>

                    <div className="project-card-footer">
                      <Link
                        className="primary-button project-link"
                        to={`/projects/${project.id}`}
                      >
                        View Project
                      </Link>

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => startEditing(project)}
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {isCreateModalOpen && (
        <div
          className="project-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateModal();
            }
          }}
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
          >
            <div className="project-modal-header">
              <div>
                <p className="project-modal-eyebrow">NEW PROJECT</p>
                <h2 id="create-project-title">Create Project</h2>
                <p>Add a new software project to IssueFlow.</p>
              </div>

              <button
                className="project-modal-close"
                type="button"
                aria-label="Close create project dialog"
                onClick={closeCreateModal}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form
              className="project-form"
              onSubmit={handleCreateProject}
            >
              <div className="form-field">
                <label htmlFor="project-name">Project Name</label>

                <input
                  id="project-name"
                  placeholder="e.g. Customer Portal"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label htmlFor="project-description">
                  Description
                </label>

                <textarea
                  id="project-description"
                  rows={5}
                  placeholder="Describe the project"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                />
              </div>

              {formError && (
                <p className="form-error">{formError}</p>
              )}

              <div className="project-modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default ProjectsPage;