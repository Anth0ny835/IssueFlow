import {
  NavLink,
  Outlet,
} from 'react-router-dom'

import './AppLayout.css'

function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <div className="app-brand-mark">
            IF
          </div>

          <div>
            <p>IssueFlow</p>
            <span>Issue Management</span>
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

        <div className="app-sidebar-footer">
          <p>IssueFlow</p>
          <span>Software issue & release management</span>
        </div>
      </aside>

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout