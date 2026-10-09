import { apiRequest } from './http'

import type {
  CreateIssueRequest,
  Issue,
  UpdateIssueStatusRequest,
} from '../types/issue'

export function getIssues(): Promise<Issue[]> {
  return apiRequest<Issue[]>('/api/issues')
}

export function getIssueById(
  issueId: number,
): Promise<Issue> {
  return apiRequest<Issue>(
    `/api/issues/${issueId}`,
  )
}

export function getIssuesByProjectId(
  projectId: number,
): Promise<Issue[]> {
  return apiRequest<Issue[]>(
    `/api/projects/${projectId}/issues`,
  )
}

export function createIssue(
  projectId: number,
  request: CreateIssueRequest,
): Promise<Issue> {
  return apiRequest<Issue>(
    `/api/projects/${projectId}/issues`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )
}

export function updateIssueStatus(
  issueId: number,
  request: UpdateIssueStatusRequest,
): Promise<Issue> {
  return apiRequest<Issue>(
    `/api/issues/${issueId}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )
}