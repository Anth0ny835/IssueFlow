import { Route, Routes } from 'react-router-dom'

import DashboardPage from './pages/DashboardPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ProjectsPage from './pages/ProjectsPage'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route element={<ProtectedRoute />}>
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
      </Route>
    </Routes>
  )
}

export default App