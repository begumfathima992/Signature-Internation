import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { company } from '../data/company.js';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'Services', icon: 'home' },
  { to: '/about', label: 'About us' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open: lock page scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const toggle = toggleRef.current;
    document.body.style.overflow = 'hidden';
    panel.querySelector(FOCUSABLE)?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  // Services stays active on its detail pages.
  const isActive = (to) => (to === '/' ? pathname === '/' || pathname.startsWith('/services/') : pathname === to);

  const navLinks = (className) =>
    links.map((link) => (
      <li key={link.to}>
        <NavLink
          to={link.to}
          className={() => `${className}${isActive(link.to) ? ' is-active' : ''}`}
          aria-current={isActive(link.to) ? 'page' : undefined}
        >
          {link.icon && <Icon name={link.icon} size={18} />}
          {link.label}
        </NavLink>
      </li>
    ));

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="brand" aria-label={`${company.name}, Services home`}>
          <img className="brand__logo" src={logo} alt="" width="192" height="48" />
          <span className="brand__name">{company.name}</span>
        </Link>

        <nav className="navbar__nav" aria-label="Main">
          <ul>
            {navLinks('nav-link')}
            <li>
              <NavLink to="/contact" className="button button--primary button--sm">
                Contact us
              </NavLink>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="icon-button navbar__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={24} />
        </button>
      </div>

      {/* `inert` keeps the closed menu out of the tab order and accessibility tree. */}
      <div className={`mobile-menu${open ? ' is-open' : ''}`} inert={!open}>
        <div className="mobile-menu__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
        <div
          ref={panelRef}
          id="mobile-menu"
          className="mobile-menu__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="mobile-menu__header">
            <span className="mobile-menu__title">Menu</span>
            <button type="button" className="icon-button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Icon name="close" size={24} />
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="mobile-menu__links">{navLinks('mobile-link')}</ul>
          </nav>
          <Link to="/contact" className="button button--primary button--block">
            Contact us
          </Link>
          <div className="mobile-menu__contact">
            <a href={`tel:${company.phoneHref}`}>
              <Icon name="phone" size={18} /> {company.phone}
            </a>
            <a href={`mailto:${company.email}`}>
              <Icon name="mail" size={18} /> {company.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
