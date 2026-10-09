import { Navigate, Route, Routes } from 'react-router-dom'

import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/projects" replace />}
      />

      <Route
        path="/projects"
        element={<ProjectsPage />}
      />

      <Route
        path="/projects/:projectId"
        element={<ProjectDetailsPage />}
      />
    </Routes>
  )
}

export default App