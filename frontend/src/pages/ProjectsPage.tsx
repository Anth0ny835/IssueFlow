import { useEffect, useState } from 'react'

import { getProjects } from '../api/projects'
import type { Project } from '../types/project'

import './ProjectsPage.css'

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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