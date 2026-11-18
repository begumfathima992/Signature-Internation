import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/auth.js';
import { company } from '../data/company.js';

const links = [
  { to: '/admin', label: 'Services', icon: 'layers', end: true },
  { to: '/admin/contact', label: 'Contact details', icon: 'phone' },
  { to: '/admin/admins', label: 'Admins', icon: 'users' },
  { to: '/admin/activity', label: 'Activity log', icon: 'history' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src={logo} alt={company.name} width="160" height="40" />
          <span>Admin</span>
        </div>
        <nav aria-label="Admin">
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="admin-sidebar__link">
                  <Icon name={link.icon} size={18} />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" className="admin-sidebar__link">
            <Icon name="external" size={18} />
            View website
          </a>
          <button type="button" className="admin-sidebar__link" onClick={handleLogout}>
            <Icon name="logOut" size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar__company">{company.name}</span>
          <span className="admin-topbar__user">
            <span className="admin-topbar__avatar" aria-hidden="true">
              {admin.name.charAt(0).toUpperCase()}
            </span>
            Signed in as <strong>{admin.name}</strong>
          </span>
        </header>
        <main className="admin-content" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
