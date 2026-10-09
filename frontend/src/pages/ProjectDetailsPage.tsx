import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProjectById } from '../api/projects'
import type { Project } from '../types/project'

import './ProjectDetailsPage.css'

function ProjectDetailsPage() {
  const { projectId } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProject() {
      const id = Number(projectId)

      if (!projectId || Number.isNaN(id)) {
        setError('Invalid project ID')
        setIsLoading(false)
        return
      }

      try {
        const data = await getProjectById(id)

        setProject(data)
      } catch {
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  if (isLoading) {
    return (
      <main className="project-details-page">
        <p className="details-message">
          Loading project...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="project-details-page">
        <p className="details-message details-error">
          {error}
        </p>

        <Link
          className="back-link"
          to="/projects"
        >
          Back to Projects
        </Link>
      </main>
    )
  }

  if (!project) {
    return null
  }

  return (
    <main className="project-details-page">
      <Link
        className="back-link"
        to="/projects"
      >
        ← Back to Projects
      </Link>

      <header className="project-details-header">
        <p className="project-id">
          Project #{project.id}
        </p>

        <h1>{project.name}</h1>

        <p>{project.description}</p>
      </header>

      <section className="project-details-section">
        <h2>Issues</h2>

        <p className="section-placeholder">
          Issue management will be added next.
        </p>
      </section>
    </main>
  )
}

export default ProjectDetailsPage