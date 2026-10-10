import { Route, Routes } from 'react-router-dom'

import DashboardPage from './pages/DashboardPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ProjectsPage from './pages/ProjectsPage'
import AppLayout from './components/AppLayout'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="projects"
          element={<ProjectsPage />}
        />

        <Route
          path="projects/:projectId"
          element={<ProjectDetailsPage />}
        />
      </Route>
    </Routes>
  )
}

export default App