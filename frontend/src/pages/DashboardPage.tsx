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

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [projectData, issueData] = await Promise.all([
          getProjects(),
          getIssues(),
        ])

        setProjects(projectData)
        setIssues(issueData)
      } catch {
        setError('Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <p className="dashboard-message">
          Loading dashboard...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <p className="dashboard-message dashboard-error">
          {error}
        </p>
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