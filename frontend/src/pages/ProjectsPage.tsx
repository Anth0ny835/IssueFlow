import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import {
  createProject,
  getProjects,
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
              <h2>{project.name}</h2>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default ProjectsPage