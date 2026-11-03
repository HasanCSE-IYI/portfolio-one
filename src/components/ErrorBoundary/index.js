import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faRotateRight,
  faHome,
  faChevronDown,
  faChevronUp,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import './index.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copiedTrace: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log exception for debugging and telemetry
    if (typeof console !== 'undefined' && console.error) {
      console.error('Portfolio ErrorBoundary Caught Exception:', error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = process.env.PUBLIC_URL || '/';
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  handleCopyTrace = () => {
    const errorText = `Fault: ${this.state.error?.toString() || 'Unknown'}\n\nComponent Stack:\n${
      this.state.errorInfo?.componentStack || 'No component stack trace available.'
    }`;

    const triggerSuccess = () => {
      this.setState({ copiedTrace: true });
      setTimeout(() => {
        this.setState({ copiedTrace: false });
      }, 2400);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(errorText)
        .then(triggerSuccess)
        .catch(() => {
          try {
            const el = document.createElement('textarea');
            el.value = errorText;
            el.style.position = 'fixed';
            el.style.opacity = '0';
            document.body.appendChild(el);
            if (typeof el.select === 'function') el.select();
            if (typeof document.execCommand === 'function') document.execCommand('copy');
            document.body.removeChild(el);
          } catch (e) {
            // ignore
          }
          triggerSuccess();
        });
    } else {
      try {
        const el = document.createElement('textarea');
        el.value = errorText;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        if (typeof el.select === 'function') el.select();
        if (typeof document.execCommand === 'function') document.execCommand('copy');
        document.body.removeChild(el);
      } catch (e) {
        // ignore
      }
      triggerSuccess();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen" role="alert" aria-live="assertive">
          <div className="error-card">
            <div className="error-glow-halo" aria-hidden="true" />

            <div className="error-icon-wrap">
              <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            </div>

            <div className="error-badge">RUNTIME EXCEPTION SHIELD</div>

            <h1 className="error-title">System Runtime Exception</h1>
            <p className="error-desc">
              The application encountered an unexpected runtime fault. The defensive Error Boundary isolated the failure to protect application state.
            </p>

            <div className="error-actions">
              <button type="button" className="action-btn reload-btn" onClick={this.handleReload}>
                <FontAwesomeIcon icon={faRotateRight} />
                <span>Reload Application</span>
              </button>
              <button type="button" className="action-btn home-btn" onClick={this.handleGoHome}>
                <FontAwesomeIcon icon={faHome} />
                <span>Return to Home</span>
              </button>
            </div>

            {this.state.error && (
              <div className="error-details-box">
                <button
                  type="button"
                  className="details-toggle-btn"
                  onClick={this.toggleDetails}
                  aria-expanded={this.state.showDetails}
                >
                  <span>Technical Diagnostics &amp; Stack Trace</span>
                  <FontAwesomeIcon icon={this.state.showDetails ? faChevronUp : faChevronDown} />
                </button>

                {this.state.showDetails && (
                  <div className="error-trace-container">
                    <div className="trace-actions-bar">
                      <span className="trace-heading">Diagnostic Trace</span>
                      <button
                        type="button"
                        className="copy-trace-btn"
                        onClick={this.handleCopyTrace}
                        aria-label="Copy technical diagnostics to clipboard"
                      >
                        <FontAwesomeIcon icon={this.state.copiedTrace ? faCheck : faCopy} />
                        <span>{this.state.copiedTrace ? 'Copied Diagnostic Trace' : 'Copy Trace'}</span>
                        <span className="sr-only" role="status" aria-live="polite">
                          {this.state.copiedTrace ? 'Technical diagnostics copied to clipboard' : ''}
                        </span>
                      </button>
                    </div>
                    <pre className="error-trace-log">
                      <code>
                        <strong>Fault:</strong> {this.state.error.toString()}
                        {'\n\n'}
                        <strong>Component Stack:</strong>
                        {this.state.errorInfo?.componentStack || 'No component stack trace available.'}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
