import { apiRequest } from './http'

import type {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from '../types/project'

export type { Project };

export function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>('/api/projects')
}

export function getProjectById(
  projectId: number,
): Promise<Project> {
  return apiRequest<Project>(
    `/api/projects/${projectId}`,
  )
}

export function createProject(
  request: CreateProjectRequest,
): Promise<Project> {
  return apiRequest<Project>('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
}

export function updateProject(
  projectId: number,
  request: UpdateProjectRequest,
): Promise<Project> {
  return apiRequest<Project>(
    `/api/projects/${projectId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )
}