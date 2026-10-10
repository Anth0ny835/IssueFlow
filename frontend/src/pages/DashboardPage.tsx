import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getIssues } from '../api/issues'
import { getProjects } from '../api/projects'

import type { Issue } from '../types/issue'
import type { Project } from '../types/project'

import './DashboardPage.css'

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [issues, setIssues] = useState<Issue[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      setError(null)

      try {
        const [projectData, issueData] = await Promise.all([
          getProjects(),
          getIssues(),
        ])

        setProjects(projectData)
        setIssues(issueData)
      } catch {
        setError(
          'Unable to load dashboard data. Please try again.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [reloadKey])

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-state-card">
          <div className="loading-indicator" />

          <h1>Loading dashboard</h1>

          <p>
            Fetching the latest project and issue data...
          </p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-state-card">
          <h1>Unable to load dashboard</h1>

          <p>{error}</p>

          <button
            className="dashboard-retry-button"
            type="button"
            onClick={() =>
              setReloadKey((current) => current + 1)
            }
          >
            Try Again
          </button>
        </section>
      </main>
    )
  }

  const openIssues = issues.filter(
    (issue) => issue.status === 'OPEN',
  ).length

  const inProgressIssues = issues.filter(
    (issue) => issue.status === 'IN_PROGRESS',
  ).length

  const resolvedIssues = issues.filter(
    (issue) => issue.status === 'RESOLVED',
  ).length

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            IssueFlow
          </p>

          <h1>Dashboard</h1>

          <p>
            Overview of projects and issue status across
            the system.
          </p>
        </div>

        <Link
          className="dashboard-link"
          to="/projects"
        >
          View Projects
        </Link>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <p>Total Projects</p>
          <strong>{projects.length}</strong>
        </article>

        <article className="dashboard-card">
          <p>Total Issues</p>
          <strong>{issues.length}</strong>
        </article>

        <article className="dashboard-card">
          <p>Open</p>
          <strong>{openIssues}</strong>
        </article>

        <article className="dashboard-card">
          <p>In Progress</p>
          <strong>{inProgressIssues}</strong>
        </article>

        <article className="dashboard-card">
          <p>Resolved</p>
          <strong>{resolvedIssues}</strong>
        </article>
      </section>
    </main>
  )
}

export default DashboardPage