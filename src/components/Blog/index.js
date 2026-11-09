import React, { useState, useEffect, useMemo, useRef } from 'react';
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

// Formats inline markdown (**bold** and `code`) into semantic React elements
const renderInlineMarkdown = (text) => {
  if (!text) return text;
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={pIdx}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const Blog = () => {
  const { slug } = useParams();
  const { playSound } = useUi();
  const [letterClass, setLetterClass] = useState('text-animate');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [shareToast, setShareToast] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const categoryBtnsRef = useRef([]);

  const articles = useMemo(() => getAllArticles(), []);
  const currentArticle = useMemo(() => (slug ? getArticleBySlug(slug) : null), [slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 2000);
    return () => clearTimeout(timer);
  }, [slug]);

  // Set document title to article title when reading a specific article, or Not Found
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (slug) {
      if (currentArticle?.title) {
        document.title = `${currentArticle.title} | Mahmud al Hasan`;
      } else {
        document.title = 'Article Not Found | Mahmud al Hasan';
      }
    } else {
      document.title = 'Engineering Notes & Architecture Blog | Mahmud al Hasan';
    }
  }, [slug, currentArticle]);

  // Track reading scroll depth for article detail view
  useEffect(() => {
    if (!slug || !currentArticle) return;
    const handleScroll = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) {
        setReadingProgress(0);
        return;
      }
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalScrollable) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, currentArticle]);

  // Robust cross-browser clipboard copy with execCommand fallback
  const safeCopyText = (text, onSuccess) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (onSuccess) onSuccess();
        })
        .catch(() => {
          fallbackCopy(text, onSuccess);
        });
    } else {
      fallbackCopy(text, onSuccess);
    }
  };

  const fallbackCopy = (text, onSuccess) => {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (onSuccess) onSuccess();
    } catch {
      // ignore
    }
  };

  // Handle code snippet copy
  const handleCopyCode = (codeText, id) => {
    safeCopyText(codeText.trim(), () => {
      setCopiedCodeId(id);
      playSound('chime');
      setTimeout(() => setCopiedCodeId(null), 2500);
    });
  };

  // Handle article share link
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;
    safeCopyText(url, () => {
      setShareToast('Link copied to clipboard!');
      playSound('chime');
      setTimeout(() => setShareToast(''), 3000);
    });
  };

  // Filter articles by category and search (memoized)
  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return articles.filter((art) => {
      const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
      const matchesSearch =
        !query ||
        art.title.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

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
      setActiveCategory(nextCat);
      playSound('click');
      const targetBtn = categoryBtnsRef.current[nextIndex];
      if (targetBtn && typeof targetBtn.focus === 'function') {
        targetBtn.focus();
      }
    }
  };

  // Handle Invalid Slug (Article Not Found)
  if (slug && !currentArticle) {
    return (
      <div className="container blog-page blog-article-view">
        <div className="article-container not-found-article">
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
          </nav>
          <header className="article-header">
            <h1 className="article-title">Article Not Found</h1>
            <p className="article-subtitle">
              The engineering note you requested does not exist or may have been relocated.
            </p>
          </header>
          <div style={{ marginTop: '24px' }}>
            <Link to="/blog" className="callout-action-btn" onClick={() => playSound('click')}>
              <span>Browse All Engineering Articles</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Single Article Detail View
  if (slug && currentArticle) {
    return (
      <div className="container blog-page blog-article-view">
        {/* Dynamic Reading Progress Bar */}
        <div
          className="reading-progress-track"
          role="progressbar"
          aria-valuenow={Math.round(readingProgress)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Article reading progress"
        >
          <div
            className="reading-progress-bar"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

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
                <span className="sr-only" role="status" aria-live="polite">
                  {shareToast ? 'Article link copied to clipboard' : ''}
                </span>
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
                          <span className="sr-only" role="status" aria-live="polite">
                            {isCopied ? 'Code snippet copied to clipboard' : ''}
                          </span>
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
                        <li key={iIdx}>{renderInlineMarkdown(it)}</li>
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
                        <li key={iIdx}>{renderInlineMarkdown(it)}</li>
                      ))}
                    </ol>
                  );
                }

                // Standard Paragraph
                return (
                  <p key={idx} className="content-p">
                    {renderInlineMarkdown(trimmed)}
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
                  onClick={() => {
                    playSound('close');
                    setSearchQuery('');
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="category-pill-strip" role="tablist" aria-label="Filter articles by category">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat}
                  ref={(el) => {
                    categoryBtnsRef.current[idx] = el;
                  }}
                  id={`blog-tab-${cat.toLowerCase()}`}
                  type="button"
                  role="tab"
                  tabIndex={activeCategory === cat ? 0 : -1}
                  aria-selected={activeCategory === cat}
                  aria-controls="articles-grid"
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    playSound('click');
                  }}
                  onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Articles Grid */}
        <div
          id="articles-grid"
          role="tabpanel"
          aria-labelledby={`blog-tab-${activeCategory.toLowerCase()}`}
          className="articles-grid"
        >
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
                    <button
                      key={tag}
                      type="button"
                      className="card-tag card-tag-btn"
                      onClick={() => {
                        playSound('click');
                        setSearchQuery(tag);
                      }}
                      title={`Filter articles by #${tag}`}
                      aria-label={`Filter articles by tag ${tag}`}
                    >
                      #{tag}
                    </button>
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

export default React.memo(Blog);
