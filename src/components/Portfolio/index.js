import React, { useEffect, useState } from 'react';
import AnimatedLetters from '../AnimatedLetters';
import StoreApiDemo from './StoreApiDemo';
import './index.scss';
import portfolioData from '../../data/portfolio.json';

const CATEGORIES = [
  { id: 'all', label: 'All Architectures' },
  { id: 'dotnet', label: '.NET Core & C#' },
  { id: 'laravel', label: 'Laravel & Cloud' },
  { id: 'python', label: 'Python & Data Pipelines' },
];

const Portfolio = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [portfolio] = useState(portfolioData.portfolio || []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSimulator, setShowSimulator] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const filteredPortfolio =
    activeCategory === 'all'
      ? portfolio
      : portfolio.filter((item) => item.category === activeCategory);

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
            Selected backend architectures, high-concurrency APIs, and microservices engineered across 8+ years.
          </p>

          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Store API Simulator (Inspired by Muttakin Hasib's case study prototypes) */}
        {(activeCategory === 'all' || activeCategory === 'dotnet') && (
          <div className="simulator-section">
            <div className="simulator-toggle-bar">
              <span className="section-label">
                <span className="accent-dot"></span>
                FEATURED ARCHITECTURAL PROTOTYPE
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

        <div className="projects-grid">
          {filteredPortfolio.map((port, idx) => {
            const imgSrc = port.image || (port.cover ? `${process.env.PUBLIC_URL}${port.cover}` : '');
            const title = port.name || port.title;

            return (
              <div className="project-card" key={idx}>
                {imgSrc && (
                  <div className="project-cover-wrap">
                    <img
                      src={imgSrc}
                      className="project-cover"
                      alt={title || 'Portfolio item'}
                    />
                    {port.categoryLabel && (
                      <span className="category-badge">{port.categoryLabel}</span>
                    )}
                    {port.metrics && (
                      <span className="metrics-badge">{port.metrics}</span>
                    )}
                  </div>
                )}
                <div className="card-body">
                  <div className="card-top">
                    <h3 className="card-title">{title}</h3>
                    {port.role && <p className="card-role">{port.role} {port.period && `• ${port.period}`}</p>}
                  </div>

                  <p className="card-description">{port.description}</p>

                  {port.highlights && port.highlights.length > 0 && (
                    <ul className="card-highlights">
                      {port.highlights.map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
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
                        GitHub Repository ↗
                      </a>
                    )}
                    {port.hasInteractiveDemo && (
                      <button
                        className="action-btn secondary"
                        onClick={() => {
                          setShowSimulator(true);
                          window.scrollTo({ top: 150, behavior: 'smooth' });
                        }}
                      >
                        ⚡ Live Simulator
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="project-links">
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/StoreApi"
          >
            Store API [.NET Core / EF Core] ↗
          </a>
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/Hamd-Shop"
          >
            Hamd-Shop [Laravel E-Commerce] ↗
          </a>
          <a
            className="portfolio-page-link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/Student-Management-System"
          >
            Student Management System ↗
          </a>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
