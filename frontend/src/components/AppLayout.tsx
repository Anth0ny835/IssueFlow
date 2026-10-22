import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

import './AppLayout.css'

function AppLayout() {
  const navigate = useNavigate()

  const {
    user,
    signOut,
  } = useAuth()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <div className="app-brand-mark">IF</div>

          <div>
            <span className="app-brand-name">IssueFlow</span>
            <span className="app-brand-subtitle">
              Issue Management
            </span>
          </div>
        </div>

        <nav className="app-navigation">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'nav-link nav-link-active'
                : 'nav-link'
            }
            to="/"
            end
          >
            Dashboard
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'nav-link nav-link-active'
                : 'nav-link'
            }
            to="/projects"
          >
            Projects
          </NavLink>
        </nav>

        <button
          className="mobile-logout-button"
          type="button"
          onClick={handleLogout}
        >
          Sign Out
        </button>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <span className="sidebar-user-label">
              Signed in as
            </span>

            <span className="sidebar-user-email">
              {user?.email}
            </span>
          </div>

          <button
            className="sidebar-logout-button"
            type="button"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout