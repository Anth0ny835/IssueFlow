import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProjectById } from '../api/projects'
import { createIssue, getIssuesByProjectId } from '../api/issues'

import type { Project } from '../types/project'
import type { Issue } from '../types/issue'
import type { FormEvent } from 'react'

import './ProjectDetailsPage.css'

function ProjectDetailsPage() {
  const { projectId } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [issueTitle, setIssueTitle] = useState('')
  const [issueDescription, setIssueDescription] = useState('')

  const [isCreatingIssue, setIsCreatingIssue] =
    useState(false)

  const [issueFormError, setIssueFormError] =
    useState<string | null>(null)

  useEffect(() => {
    async function loadProjectDetails() {
      const id = Number(projectId)

      if (!projectId || Number.isNaN(id)) {
        setError('Invalid project ID')
        setIsLoading(false)
        return
      }

      try {
        const [projectData, issuesData] = await Promise.all([
          getProjectById(id),
          getIssuesByProjectId(id),
        ])

        setProject(projectData)
        setIssues(issuesData)
      } catch {
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjectDetails()
  }, [projectId])

  async function handleCreateIssue(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setIssueFormError(null)

    if (!project) {
      setIssueFormError('Project is not available')
      return
    }

    const trimmedTitle = issueTitle.trim()
    const trimmedDescription = issueDescription.trim()

    if (!trimmedTitle) {
      setIssueFormError('Issue title is required')
      return
    }

    try {
      setIsCreatingIssue(true)

      const newIssue = await createIssue(
        project.id,
        {
          title: trimmedTitle,
          description: trimmedDescription,
        },
      )

      setIssues((currentIssues) => [
        ...currentIssues,
        newIssue,
      ])

      setIssueTitle('')
      setIssueDescription('')
    } catch {
      setIssueFormError('Failed to create issue')
    } finally {
      setIsCreatingIssue(false)
    }
  }

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
        <div className="issues-section-header">
          <div>
            <h2>Issues</h2>

            <p>
              {issues.length} issue{issues.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <form
          className="issue-form"
          onSubmit={handleCreateIssue}
        >
          <div className="issue-form-fields">
            <div className="issue-form-field">
              <label htmlFor="issue-title">
                Issue Title
              </label>

              <input
                id="issue-title"
                type="text"
                value={issueTitle}
                onChange={(event) =>
                  setIssueTitle(event.target.value)
                }
                placeholder="e.g. Login button not working"
              />
            </div>

            <div className="issue-form-field">
              <label htmlFor="issue-description">
                Description
              </label>

              <textarea
                id="issue-description"
                value={issueDescription}
                onChange={(event) =>
                  setIssueDescription(event.target.value)
                }
                placeholder="Describe the issue"
                rows={4}
              />
            </div>
          </div>

          {issueFormError && (
            <p className="issue-form-error">
              {issueFormError}
            </p>
          )}

          <button
            className="create-issue-button"
            type="submit"
            disabled={isCreatingIssue}
          >
            {isCreatingIssue
              ? 'Creating...'
              : 'Create Issue'}
          </button>
        </form>

        {issues.length === 0 ? (
          <p className="section-placeholder">
            No issues have been created for this project.
          </p>
        ) : (
          <div className="issues-list">
            {issues.map((issue) => (
              <article
                className="issue-card"
                key={issue.id}
              >
                <div className="issue-card-header">
                  <div>
                    <p className="issue-number">
                      Issue #{issue.id}
                    </p>

                    <h3>{issue.title}</h3>
                  </div>

                  <span
                    className={`issue-status issue-status-${issue.status.toLowerCase()}`}
                  >
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="issue-description">
                  {issue.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ProjectDetailsPage