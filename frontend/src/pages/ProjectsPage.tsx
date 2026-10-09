import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { FormEvent } from 'react'

import {
  createProject,
  getProjects,
  updateProject,
} from '../api/projects'

import type { Project } from '../types/project'

import './ProjectsPage.css'

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [editingProjectId, setEditingProjectId] =
    useState<number | null>(null)

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects()

        setProjects(data)
      } catch (err) {
        setError('Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setFormError(null)

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setFormError('Project name is required')
      return
    }

    try {
      setIsSubmitting(true)

      const newProject = await createProject({
        name: trimmedName,
        description: trimmedDescription,
      })

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ])

      setName('')
      setDescription('')
    } catch {
      setFormError('Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEditing(project: Project) {
    setEditingProjectId(project.id)
    setEditName(project.name)
    setEditDescription(project.description)
    setEditError(null)
  }

  function cancelEditing() {
    setEditingProjectId(null)
    setEditName('')
    setEditDescription('')
    setEditError(null)
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
    projectId: number,
  ) {
    event.preventDefault()

    setEditError(null)

    const trimmedName = editName.trim()
    const trimmedDescription = editDescription.trim()

    if (!trimmedName) {
      setEditError('Project name is required')
      return
    }

    try {
      setIsUpdating(true)

      const updatedProject = await updateProject(
        projectId,
        {
          name: trimmedName,
          description: trimmedDescription,
        },
      )

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === updatedProject.id
            ? updatedProject
            : project,
        ),
      )

      cancelEditing()
    } catch {
      setEditError('Failed to update project')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <main className="projects-page">
        <p className="projects-message">
          Loading projects...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="projects-page">
        <p className="projects-message projects-error">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="projects-page">
      <header className="projects-header">
        <h1>Projects</h1>
        <p>
          Manage software projects and their associated issues.
        </p>
      </header>

      <section className="project-form-section">
        <div className="project-form-header">
          <h2>Create Project</h2>
          <p>
            Add a new software project to IssueFlow.
          </p>
        </div>

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="project-name">
              Project Name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Customer Portal"
            />
          </div>

          <div className="form-field">
            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the project"
              rows={4}
            />
          </div>

          {formError && (
            <p className="form-error">
              {formError}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Creating...'
              : 'Create Project'}
          </button>
        </form>
      </section>

      {projects.length === 0 ? (
        <p className="projects-message">
          No projects found.
        </p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <article
              className="project-card"
              key={project.id}
            >
              {editingProjectId === project.id ? (
                <form
                  className="project-edit-form"
                  onSubmit={(event) =>
                    handleUpdate(event, project.id)
                  }
                >
                  <div className="form-field">
                    <label htmlFor={`edit-name-${project.id}`}>
                      Project Name
                    </label>

                    <input
                      id={`edit-name-${project.id}`}
                      type="text"
                      value={editName}
                      onChange={(event) =>
                        setEditName(event.target.value)
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label
                      htmlFor={`edit-description-${project.id}`}
                    >
                      Description
                    </label>

                    <textarea
                      id={`edit-description-${project.id}`}
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(event.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  {editError && (
                    <p className="form-error">
                      {editError}
                    </p>
                  )}

                  <div className="project-card-actions">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={isUpdating}
                    >
                      {isUpdating
                        ? 'Saving...'
                        : 'Save Changes'}
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
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>

                  <div className="project-card-actions">
                    <Link
                      className="primary-link"
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
      )}
    </main>
  )
}

export default ProjectsPage