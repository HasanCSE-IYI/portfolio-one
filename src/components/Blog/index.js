import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faClock,
  faCalendarAlt,
  faTag,
  faArrowLeft,
  faShareNodes,
  faCopy,
  faCheck,
  faBookOpen,
  faLaptopCode,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import { getAllArticles, getArticleBySlug } from '../../data/blogData';
import { useUi } from '../../context/UiContext';
import './index.scss';

const CATEGORIES = ['All', 'Architecture', 'Backend', 'Database', 'DevOps'];

const Blog = () => {
  const { slug } = useParams();
  const { playSound } = useUi();
  const [letterClass, setLetterClass] = useState('text-animate');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [shareToast, setShareToast] = useState('');

  const articles = getAllArticles();
  const currentArticle = slug ? getArticleBySlug(slug) : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 2000);
    return () => clearTimeout(timer);
  }, [slug]);

  // Handle code snippet copy
  const handleCopyCode = (codeText, id) => {
    try {
      navigator.clipboard.writeText(codeText.trim());
      setCopiedCodeId(id);
      playSound('chime');
      setTimeout(() => setCopiedCodeId(null), 2500);
    } catch {
      // Fallback
    }
  };

  // Handle article share link
  const handleShare = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setShareToast('Link copied to clipboard!');
      playSound('chime');
      setTimeout(() => setShareToast(''), 3000);
    } catch {
      // Fallback
    }
  };

  // Filter articles by category and search
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      art.title.toLowerCase().includes(query) ||
      art.summary.toLowerCase().includes(query) ||
      art.tags.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Render Single Article Detail View
  if (slug && currentArticle) {
    return (
      <div className="container blog-page blog-article-view">
        <div className="article-container">
          {/* Top Navigation & Breadcrumbs */}
          <nav className="article-nav-bar" aria-label="Breadcrumb">
            <Link
              to="/blog"
              className="back-btn"
              onClick={() => playSound('click')}
              aria-label="Back to all articles"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Articles</span>
            </Link>
            <div className="share-actions">
              <button
                type="button"
                className="share-btn"
                onClick={handleShare}
                aria-label="Share this article"
                title="Copy share link"
              >
                <FontAwesomeIcon icon={shareToast ? faCheck : faShareNodes} />
                <span>{shareToast ? 'Link Copied!' : 'Share Article'}</span>
              </button>
            </div>
          </nav>

          {/* Article Header */}
          <header className="article-header">
            <div className="article-meta-row">
              <span className="category-tag">{currentArticle.category}</span>
              <span className="meta-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                <span>{currentArticle.date}</span>
              </span>
              <span className="meta-item">
                <FontAwesomeIcon icon={faClock} className="meta-icon" />
                <span>{currentArticle.readTime}</span>
              </span>
            </div>

            <h1 className="article-title">{currentArticle.title}</h1>
            <p className="article-subtitle">{currentArticle.subtitle}</p>

            <div className="author-card">
              <div className="author-avatar-wrap">
                <span className="author-avatar-initials">MH</span>
              </div>
              <div className="author-info">
                <span className="author-name">Mahmud al Hasan</span>
                <span className="author-role">Senior Backend Software Engineer</span>
              </div>
              <div className="author-socials">
                <a
                  href="https://github.com/HasanCSE-IYI"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Author GitHub"
                  className="social-icon"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  href="https://www.linkedin.com/in/mahmud-al-hasan/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Author LinkedIn"
                  className="social-icon"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </div>

            <div className="article-tags-wrap">
              {currentArticle.tags.map((tag) => (
                <span key={tag} className="article-tag-badge">
                  <FontAwesomeIcon icon={faTag} className="tag-icon" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </header>

          {/* Article Body Content */}
          <article className="article-body">
            {currentArticle.content
              .split('\n\n')
              .map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Code block detection
                if (trimmed.startsWith('```')) {
                  const lines = trimmed.split('\n');
                  const lang = lines[0].replace('```', '') || 'text';
                  const code = lines.slice(1, -1).join('\n');
                  const codeId = `code-${idx}`;
                  const isCopied = copiedCodeId === codeId;

                  return (
                    <div key={idx} className="code-block-container">
                      <div className="code-block-header">
                        <span className="code-lang-label">{lang}</span>
                        <button
                          type="button"
                          className="copy-code-btn"
                          onClick={() => handleCopyCode(code, codeId)}
                          aria-label="Copy code block to clipboard"
                        >
                          <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
                          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="code-pre">
                        <code className={`language-${lang}`}>{code}</code>
                      </pre>
                    </div>
                  );
                }

                // Heading 3
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="content-h3">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                // Bullet points
                if (trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n- ').map((s) => s.replace(/^- /, ''));
                  return (
                    <ul key={idx} className="content-ul">
                      {items.map((it, iIdx) => (
                        <li key={iIdx}>{it}</li>
                      ))}
                    </ul>
                  );
                }

                // Ordered list
                if (/^\d+\.\s/.test(trimmed)) {
                  const items = trimmed.split(/\n\d+\.\s/).filter(Boolean);
                  return (
                    <ol key={idx} className="content-ol">
                      {items.map((it, iIdx) => (
                        <li key={iIdx}>{it}</li>
                      ))}
                    </ol>
                  );
                }

                // Standard Paragraph
                return (
                  <p key={idx} className="content-p">
                    {trimmed}
                  </p>
                );
              })}
          </article>

          {/* Article Footer & Quick Contact */}
          <footer className="article-footer">
            <div className="footer-callout">
              <div className="callout-text">
                <h4>Have questions or need distributed systems consulting?</h4>
                <p>Feel free to reach out directly to discuss architecture, high-throughput APIs, or contracts.</p>
              </div>
              <Link
                to="/contact"
                className="callout-action-btn"
                onClick={() => playSound('click')}
              >
                <span>Discuss Project</span>
              </Link>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // Render Article Directory List View
  return (
    <div className="container blog-page blog-list-view">
      <div className="blog-content-wrapper">
        {/* Header Zone */}
        <header className="blog-header-zone">
          <div className="blog-badge-tag">
            <FontAwesomeIcon icon={faBookOpen} className="badge-icon" />
            <span>Architecture &amp; Engineering</span>
          </div>

          <h1 className="page-title">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Engineering Notes'.split('')}
              idx={15}
            />
          </h1>

          <p className="blog-lead">
            In-depth architectural post-mortems, distributed backend design patterns, database indexing masteries, and production insights authored by Mahmud al Hasan.
          </p>

          {/* Search & Category Filter Strip */}
          <div className="blog-control-strip">
            <div className="search-box-wrap">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search articles by topic, architecture, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search technical articles"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="category-pill-strip" role="tablist" aria-label="Filter articles by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    playSound('click');
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((art) => (
              <article key={art.slug} className="article-card">
                <div className="card-top-row">
                  <span className="card-category">{art.category}</span>
                  <span className="card-read-time">
                    <FontAwesomeIcon icon={faClock} className="read-icon" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h2 className="card-title">
                  <Link
                    to={`/blog/${art.slug}`}
                    className="card-title-link"
                    onClick={() => playSound('pop')}
                  >
                    {art.title}
                  </Link>
                </h2>

                <p className="card-summary">{art.summary}</p>

                <div className="card-tags-row">
                  {art.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="card-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="card-footer-row">
                  <span className="card-date">
                    <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                    <span>{art.date}</span>
                  </span>

                  <Link
                    to={`/blog/${art.slug}`}
                    className="read-more-btn"
                    onClick={() => playSound('pop')}
                    aria-label={`Read full article: ${art.title}`}
                  >
                    <span>Read Article</span>
                    <span className="arrow-sym">→</span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state-box">
              <FontAwesomeIcon icon={faLaptopCode} className="empty-icon" />
              <h3>No articles found</h3>
              <p>No technical notes match your search query &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                className="reset-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  playSound('click');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
