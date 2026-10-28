import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { company } from '../data/company.js';
import { services } from '../data/services.js';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'Services', icon: 'home' },
  { to: '/about', label: 'About us' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownToggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Services dropdown: close on Escape (returning focus to its button) or a click outside.
  useEffect(() => {
    if (!servicesOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        dropdownToggleRef.current?.focus();
      }
    }
    function onPointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) setServicesOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [servicesOpen]);

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

  const navLink = (link, className) => (
    <NavLink
      to={link.to}
      className={() => `${className}${isActive(link.to) ? ' is-active' : ''}`}
      aria-current={isActive(link.to) ? 'page' : undefined}
    >
      {link.icon && <Icon name={link.icon} size={18} />}
      {link.label}
    </NavLink>
  );

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="brand" aria-label={`${company.name}, Services home`}>
          <img className="brand__logo" src={logo} alt="" width="192" height="48" />
          <span className="brand__name">{company.name}</span>
        </Link>

        <nav className="navbar__nav" aria-label="Main">
          <ul>
            <li
              ref={dropdownRef}
              className="nav-dropdown"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
              }}
            >
              {navLink(links[0], 'nav-link')}
              <button
                ref={dropdownToggleRef}
                type="button"
                className={`nav-dropdown__toggle${servicesOpen ? ' is-open' : ''}`}
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                aria-label="Show all services"
                onClick={() => setServicesOpen((current) => !current)}
              >
                <Icon name="chevronDown" size={16} />
              </button>
              <ul id="services-menu" className="nav-dropdown__menu" hidden={!servicesOpen}>
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link to={`/services/${service.slug}`} className="nav-dropdown__link">
                      <Icon name={service.icon} size={18} />
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {links.slice(1).map((link) => (
              <li key={link.to}>{navLink(link, 'nav-link')}</li>
            ))}
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
            <ul className="mobile-menu__links">
              <li>
                {navLink(links[0], 'mobile-link')}
                <ul className="mobile-menu__sublinks" aria-label="Services">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <NavLink to={`/services/${service.slug}`} className="mobile-sublink">
                        {service.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              {links.slice(1).map((link) => (
                <li key={link.to}>{navLink(link, 'mobile-link')}</li>
              ))}
            </ul>
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
