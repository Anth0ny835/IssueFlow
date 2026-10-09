export type IssueStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'

export interface Issue {
  id: number
  title: string
  description: string
  status: IssueStatus
  projectId: number
  projectName: string
}

export interface CreateIssueRequest {
  title: string
  description: string
}

export interface UpdateIssueStatusRequest {
  status: IssueStatus
}