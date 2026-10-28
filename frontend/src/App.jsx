import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import SiteProvider from './components/SiteProvider.jsx';
import ServicesPage from './pages/ServicesPage.jsx';

// The landing page loads with the main bundle; other routes are split into their own chunks.
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.jsx'));
const SubServiceDetailPage = lazy(() => import('./pages/SubServiceDetailPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  const { pathname, hash } = useLocation();

  // New pages start at the top; links such as /#services scroll to that section instead.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <SiteProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex="-1">
        <Suspense fallback={<div className="page-loading" />}>
          <Routes>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/services" element={<Navigate to="/" replace />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/services/:slug/:subSlug" element={<SubServiceDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </SiteProvider>
  );
}
