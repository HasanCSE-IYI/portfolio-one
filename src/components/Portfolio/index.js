import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faBolt,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import StoreApiDemo from './StoreApiDemo';
import './index.scss';
import portfolioData from '../../data/portfolio.json';

const CATEGORIES = [
  { id: 'all', label: 'All Repositories' },
  { id: 'dotnet', label: '.NET Core & C#' },
  { id: 'mobile', label: 'Mobile & GIS' },
  { id: 'backend', label: 'Backend & Cloud' },
  { id: 'typescript', label: 'TypeScript & APIs' },
];

const Portfolio = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [portfolio] = useState(portfolioData.portfolio || []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSimulator, setShowSimulator] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const filteredPortfolio =
    activeCategory === 'all'
      ? portfolio
      : portfolio.filter((item) => item.category === activeCategory);

  const getCategoryCount = (catId) => {
    if (catId === 'all') return portfolio.length;
    return portfolio.filter((item) => item.category === catId).length;
  };

  return (
    <>
      <div className="container portfolio-page">
        <div className="portfolio-header-zone">
          <h1 className="page-title">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Portfolio'.split('')}
              idx={15}
            />
          </h1>
          <p className="portfolio-subheading">
            Curated production backend architectures, GIS mobile engines, and cloud microservices directly from GitHub.
          </p>

          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="cat-count">({getCategoryCount(cat.id)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Store API Simulator (Featured Architectural Prototype) */}
        {(activeCategory === 'all' || activeCategory === 'dotnet') && (
          <div className="simulator-section">
            <div className="simulator-toggle-bar">
              <span className="section-label">
                <span className="accent-dot"></span>
                FEATURED ARCHITECTURAL PROTOTYPE · .NET CORE 8
              </span>
              <button
                className="toggle-simulator-btn"
                onClick={() => setShowSimulator(!showSimulator)}
              >
                {showSimulator ? '▲ Hide API Simulator' : '▼ Open Interactive API Simulator'}
              </button>
            </div>
            {showSimulator && <StoreApiDemo />}
          </div>
        )}

        {/* GitHub Repositories Grid (No Images, Pure Architectural Cards) */}
        <div className="projects-grid">
          {filteredPortfolio.map((port, idx) => {
            const title = port.title || port.name;

            return (
              <div
                className="project-card"
                key={port.id || idx}
                style={{ animationDelay: `${0.08 * (idx + 1)}s` }}
              >
                <div className="card-header-bar">
                  <div className="repo-meta">
                    <span
                      className="lang-dot"
                      style={{ backgroundColor: port.languageColor || '#f59e0b' }}
                      title={port.language}
                    ></span>
                    <span className="lang-name">{port.language}</span>
                    <span className="sep">•</span>
                    <span className="category-tag">{port.categoryLabel}</span>
                  </div>
                  {port.metrics && (
                    <span className="metrics-badge">{port.metrics}</span>
                  )}
                </div>

                <div className="card-body">
                  <div className="card-top">
                    <h3 className="card-title">
                      <FontAwesomeIcon icon={faFolder} className="folder-icon" aria-hidden="true" />
                      <span>{title}</span>
                    </h3>
                    {port.role && (
                      <p className="card-role">
                        {port.role} {port.period && `• ${port.period}`}
                      </p>
                    )}
                  </div>

                  <p className="card-description">{port.description}</p>

                  {port.highlights && port.highlights.length > 0 && (
                    <ul className="card-highlights">
                      {port.highlights.map((hl, hIdx) => (
                        <li key={hIdx}>
                          <span className="hl-bullet">▹</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {port.tags && port.tags.length > 0 && (
                    <div className="card-tags">
                      {port.tags.map((tag, tIdx) => (
                        <span className="tag-pill" key={tIdx}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-actions">
                    {port.url && (
                      <a
                        href={port.url}
                        target="_blank"
                        rel="noreferrer"
                        className="action-btn primary"
                      >
                        <span>GitHub Repository</span>
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="ext-icon" aria-hidden="true" />
                      </a>
                    )}
                    {port.hasInteractiveDemo && (
                      <button
                        type="button"
                        className="action-btn secondary"
                        onClick={() => {
                          setShowSimulator(true);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                      >
                        <FontAwesomeIcon icon={faBolt} className="sim-icon" aria-hidden="true" />
                        <span>Live Simulator</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Repository Links */}
        <div className="project-links">
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/StoreApi"
          >
            StoreApi [.NET Core / EF Core] ↗
          </a>
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/Mappi"
          >
            Mappi [Flutter GIS Navigation] ↗
          </a>
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/chittago"
          >
            Chittago [Offline Kotlin Map] ↗
          </a>
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/Hamd-Shop"
          >
            Hamd-Shop [Laravel E-Commerce] ↗
          </a>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
