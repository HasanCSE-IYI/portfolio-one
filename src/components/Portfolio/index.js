import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faBolt,
  faExternalLinkAlt,
  faSearch,
  faTimes,
  faCodeBranch,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import StoreApiDemo from './StoreApiDemo';
import { useUi } from '../../context/UiContext';
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
  const { playSound } = useUi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [letterClass, setLetterClass] = useState('text-animate');
  const [portfolio] = useState(portfolioData.portfolio || []);

  const paramCat = searchParams.get('cat') || searchParams.get('category');
  const paramQuery = searchParams.get('q') || searchParams.get('search');

  const [activeCategory, setActiveCategory] = useState(
    paramCat && CATEGORIES.some((c) => c.id === paramCat) ? paramCat : 'all'
  );
  const [searchQuery, setSearchQuery] = useState(paramQuery || '');
  const [copiedRepoId, setCopiedRepoId] = useState(null);
  const [showSimulator, setShowSimulator] = useState(true);
  const categoryBtnsRef = useRef([]);

  // Sync state if URL search parameters update
  useEffect(() => {
    const nextCat = searchParams.get('cat') || searchParams.get('category');
    if (nextCat && CATEGORIES.some((c) => c.id === nextCat)) {
      setActiveCategory(nextCat);
    }
    const nextQ = searchParams.get('q') || searchParams.get('search');
    if (nextQ !== null && nextQ !== undefined) {
      setSearchQuery(nextQ);
    }
  }, [searchParams]);

  const handleCategorySelect = useCallback(
    (catId) => {
      setActiveCategory(catId);
      playSound('tick');
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (catId === 'all') {
            next.delete('cat');
            next.delete('category');
          } else {
            next.set('cat', catId);
          }
          return next;
        },
        { replace: true }
      );
    },
    [playSound, setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    playSound('pop');
    setSearchQuery('');
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        next.delete('search');
        return next;
      },
      { replace: true }
    );
  }, [playSound, setSearchParams]);

  const handleTagClick = useCallback(
    (tag) => {
      playSound('click');
      const isTagActive = searchQuery.trim().toLowerCase() === tag.toLowerCase();
      if (isTagActive) {
        handleClearSearch();
      } else {
        setActiveCategory('all');
        setSearchQuery(tag);
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete('cat');
            next.delete('category');
            next.set('q', tag);
            return next;
          },
          { replace: true }
        );
      }
    },
    [playSound, searchQuery, handleClearSearch, setSearchParams]
  );

  const handleCategoryKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = CATEGORIES.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextCat = CATEGORIES[nextIndex];
      handleCategorySelect(nextCat.id);
      const targetBtn = categoryBtnsRef.current[nextIndex];
      if (targetBtn && typeof targetBtn.focus === 'function') {
        targetBtn.focus();
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCopyRepoUrl = (id, url) => {
    if (!url) return;
    const triggerSuccess = () => {
      playSound('chime');
      setCopiedRepoId(id);
      setTimeout(() => setCopiedRepoId(null), 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(triggerSuccess)
        .catch(() => {
          try {
            const el = document.createElement('textarea');
            el.value = url;
            el.style.position = 'fixed';
            el.style.opacity = '0';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            triggerSuccess();
          } catch (e) {
            // ignore
          }
        });
    } else {
      try {
        const el = document.createElement('textarea');
        el.value = url;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        triggerSuccess();
      } catch (e) {
        // ignore
      }
    }
  };

  const filteredPortfolio = useMemo(() => {
    return portfolio.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.language && item.language.toLowerCase().includes(q)) ||
        (item.role && item.role.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    });
  }, [portfolio, activeCategory, searchQuery]);

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

          <div className="portfolio-search-bar">
            <div className="search-input-wrap">
              <FontAwesomeIcon icon={faSearch} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by keyword, tech, or architecture (e.g. C#, MySQL, Redis, Docker, JWT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search repositories"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            <span className="search-count-badge" role="status" aria-live="polite">
              {searchQuery || activeCategory !== 'all'
                ? `Showing ${filteredPortfolio.length} of ${portfolio.length} repositories`
                : `${portfolio.length} Production Repositories`}
            </span>
          </div>

          <div className="category-filters" role="toolbar" aria-label="Project category filters">
            {CATEGORIES.map((cat, idx) => (
              <button
                type="button"
                key={cat.id}
                ref={(el) => {
                  categoryBtnsRef.current[idx] = el;
                }}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
                onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                aria-pressed={activeCategory === cat.id}
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
                type="button"
                className="toggle-simulator-btn"
                onClick={() => {
                  playSound('pop');
                  setShowSimulator(!showSimulator);
                }}
                aria-expanded={showSimulator}
                aria-controls="store-api-simulator-section"
              >
                {showSimulator ? '▲ Hide API Simulator' : '▼ Open Interactive API Simulator'}
              </button>
            </div>
            {showSimulator && (
              <div id="store-api-simulator-section">
                <StoreApiDemo />
              </div>
            )}
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
                      {port.tags.map((tag, tIdx) => {
                        const isTagActive = searchQuery.trim().toLowerCase() === tag.toLowerCase()
                        return (
                          <button
                            type="button"
                            className={`tag-pill ${isTagActive ? 'active' : ''}`}
                            key={tIdx}
                            onClick={() => handleTagClick(tag)}
                            title={isTagActive ? `Clear filter: ${tag}` : `Filter projects by ${tag}`}
                            aria-label={`Filter by ${tag}`}
                            aria-pressed={isTagActive}
                          >
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <div className="card-actions">
                    {port.url && (
                      <>
                        <a
                          href={port.url}
                          target="_blank"
                          rel="noreferrer"
                          className="action-btn primary"
                        >
                          <span>GitHub Repo</span>
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="ext-icon" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          className={`action-btn clone-btn ${copiedRepoId === (port.id || idx) ? 'copied' : ''}`}
                          onClick={() => handleCopyRepoUrl(port.id || idx, port.url)}
                          title="Copy Git repository URL"
                          aria-label="Copy Git clone URL"
                        >
                          <FontAwesomeIcon
                            icon={copiedRepoId === (port.id || idx) ? faCheck : faCodeBranch}
                            className="clone-icon"
                            aria-hidden="true"
                          />
                          <span>{copiedRepoId === (port.id || idx) ? 'Copied!' : 'Clone URL'}</span>
                          <span className="sr-only" role="status" aria-live="polite">
                            {copiedRepoId === (port.id || idx) ? 'Git clone URL copied to clipboard' : ''}
                          </span>
                        </button>
                      </>
                    )}
                    {port.hasInteractiveDemo && (
                      <button
                        type="button"
                        className="action-btn secondary"
                        onClick={() => {
                          playSound('pop');
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

        {filteredPortfolio.length === 0 && (
          <div className="no-results-card">
            <p className="no-results-title">No matching repositories found</p>
            <p className="no-results-desc">
              No projects matched &ldquo;<strong>{searchQuery}</strong>&rdquo; in the selected category.
            </p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                playSound('click');
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Reset Filters &amp; Show All
            </button>
          </div>
        )}

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

export default React.memo(Portfolio);
