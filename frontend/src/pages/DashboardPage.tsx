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

  const recentIssues = [...issues]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">ISSUEFLOW</p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Overview of projects and issue status across the system.
          </p>
        </div>

        <Link className="dashboard-link" to="/projects">
          View Projects
        </Link>
      </header>

      <section
        className="dashboard-grid"
        aria-label="IssueFlow overview"
      >
        <article className="dashboard-card dashboard-card-neutral">
          <div className="dashboard-card-top">
            <span className="dashboard-card-label">
              Total Projects
            </span>

            <span
              className="dashboard-card-indicator"
              aria-hidden="true"
            />
          </div>

          <strong>{projects.length}</strong>

          <p>Projects currently tracked</p>
        </article>

        <article className="dashboard-card dashboard-card-neutral">
          <div className="dashboard-card-top">
            <span className="dashboard-card-label">
              Total Issues
            </span>

            <span
              className="dashboard-card-indicator"
              aria-hidden="true"
            />
          </div>

          <strong>{issues.length}</strong>

          <p>Issues across all projects</p>
        </article>

        <article className="dashboard-card dashboard-card-open">
          <div className="dashboard-card-top">
            <span className="dashboard-card-label">Open</span>

            <span
              className="dashboard-card-indicator"
              aria-hidden="true"
            />
          </div>

          <strong>{openIssues}</strong>

          <p>Waiting to be worked on</p>
        </article>

        <article className="dashboard-card dashboard-card-progress">
          <div className="dashboard-card-top">
            <span className="dashboard-card-label">
              In Progress
            </span>

            <span
              className="dashboard-card-indicator"
              aria-hidden="true"
            />
          </div>

          <strong>{inProgressIssues}</strong>

          <p>Currently being worked on</p>
        </article>

        <article className="dashboard-card dashboard-card-resolved">
          <div className="dashboard-card-top">
            <span className="dashboard-card-label">
              Resolved
            </span>

            <span
              className="dashboard-card-indicator"
              aria-hidden="true"
            />
          </div>

          <strong>{resolvedIssues}</strong>

          <p>Completed issues</p>
        </article>
      </section>

      <section className="recent-issues-section">
        <div className="recent-issues-header">
          <div>
            <h2>Recent Issues</h2>

            <p>Latest issues across all projects.</p>
          </div>

          <Link className="recent-issues-link" to="/projects">
            Browse projects →
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <div className="dashboard-empty-state">
            <div
              className="dashboard-empty-icon"
              aria-hidden="true"
            >
              IF
            </div>

            <h3>No issues yet</h3>

            <p>
              Create a project and add your first issue to start
              tracking work.
            </p>

            <Link
              className="dashboard-empty-action"
              to="/projects"
            >
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="recent-issues-list">
            {recentIssues.map((issue) => (
              <Link
                className="recent-issue-row"
                key={issue.id}
                to={`/projects/${issue.projectId}`}
              >
                <div className="recent-issue-content">
                  <p className="recent-issue-meta">
                    Issue #{issue.id}
                    {issue.projectName
                      ? ` · ${issue.projectName}`
                      : ""}
                  </p>

                  <h3>{issue.title}</h3>

                  <p className="recent-issue-description">
                    {issue.description ||
                      "No issue description provided."}
                  </p>
                </div>

                <span
                  className={`dashboard-status dashboard-status-${issue.status.toLowerCase()}`}
                >
                  {issue.status
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase(),
                    )
                    .join(" ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardPage