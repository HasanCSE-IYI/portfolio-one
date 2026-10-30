import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faRotateRight,
  faHome,
  faChevronDown,
  faChevronUp,
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
                  <pre className="error-trace-log">
                    <code>
                      <strong>Fault:</strong> {this.state.error.toString()}
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo?.componentStack || 'No component stack trace available.'}
                    </code>
                  </pre>
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
