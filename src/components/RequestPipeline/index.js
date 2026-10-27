import React, { useState } from 'react';
import './index.scss';

const PIPELINE_STEPS = [
  {
    id: 'request',
    step: '01',
    name: 'Client Request',
    badge: 'HTTP / REST',
    description: 'Incoming client request with TLS termination, HTTP method, and route parameters.',
    pattern: 'RESTful API Specification & OpenAPI 3.0',
    tech: 'HTTP / TLS 1.3',
  },
  {
    id: 'auth',
    step: '02',
    name: 'JWT Middleware',
    badge: 'Security & RBAC',
    description: 'Interception pipeline verifies HMAC-SHA256 signature, validates token expiration, and maps Claims identity (User vs Admin).',
    pattern: 'Bearer Token Authentication & Role Claims',
    tech: 'Microsoft.AspNetCore.Authentication.JwtBearer',
  },
  {
    id: 'controller',
    step: '03',
    name: 'Controller & DTO',
    badge: 'Presentation',
    description: 'Binds request payload to strongly-typed DTOs and executes declarative model validation prior to hitting domain logic.',
    pattern: 'Data Transfer Object (DTO) & Fluent Validation',
    tech: 'C# ASP.NET Core MVC / Web API',
  },
  {
    id: 'service',
    step: '04',
    name: 'Domain Service',
    badge: 'Core Business',
    description: 'Encapsulates business rules and transactional boundaries, decoupled from UI and persistence tiers.',
    pattern: 'Clean Architecture & Dependency Injection',
    tech: 'Repository & Unit of Work Patterns',
  },
  {
    id: 'orm',
    step: '05',
    name: 'EF Core & LINQ',
    badge: 'Data Access',
    description: 'Compiles LINQ expressions into parameterized SQL queries with AsNoTracking() for non-mutating reads.',
    pattern: 'Object-Relational Mapping (Code-First)',
    tech: 'Entity Framework Core 8 / LINQ',
  },
  {
    id: 'db',
    step: '06',
    name: 'Database Engine',
    badge: 'Persistence',
    description: 'Executes indexed lookups with ACID transactional consistency and relational foreign key constraints.',
    pattern: 'Relational Indexing & Query Tuning',
    tech: 'MySQL / SQLite / PostgreSQL',
  },
  {
    id: 'response',
    step: '07',
    name: 'JSON Response',
    badge: 'Sub-60ms',
    description: 'Serializes sanitized output DTO, sets HTTP status code (200 OK / 201 Created), and returns response payload.',
    pattern: 'System.Text.Json Minimal Allocations',
    tech: 'HTTP 200 OK / Gzip Compression',
  },
];

const RequestPipeline = () => {
  const [activeStepId, setActiveStepId] = useState('auth');

  const activeStep = PIPELINE_STEPS.find((s) => s.id === activeStepId) || PIPELINE_STEPS[1];

  const handleNodeKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (idx + 1) % PIPELINE_STEPS.length;
      setActiveStepId(PIPELINE_STEPS[nextIdx].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (idx - 1 + PIPELINE_STEPS.length) % PIPELINE_STEPS.length;
      setActiveStepId(PIPELINE_STEPS[prevIdx].id);
    }
  };

  return (
    <div className="request-pipeline">
      <div className="pipeline-header">
        <span className="pipeline-eyebrow">SYSTEMS IN MOTION · ARCHITECTURAL RUNTIME</span>
        <h3 className="pipeline-title">REST API Request Lifecycle Pipeline</h3>
        <p className="pipeline-desc">
          Click any stage of the pipeline to inspect how architectural boundaries, authentication, and data access are layered in production.
        </p>
      </div>

      <div className="pipeline-flow-cont">
        <div className="pipeline-nodes" role="tablist" aria-label="API Pipeline Stages">
          {PIPELINE_STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                type="button"
                role="tab"
                aria-selected={activeStepId === step.id}
                className={`pipeline-node-btn ${activeStepId === step.id ? 'active' : ''}`}
                onClick={() => setActiveStepId(step.id)}
                onKeyDown={(e) => handleNodeKeyDown(e, idx)}
                title={`Stage ${step.step}: ${step.name} (${step.badge})`}
              >
                <span className="step-num">{step.step}</span>
                <span className="step-name">{step.name}</span>
                <span className="step-badge">{step.badge}</span>
              </button>
              {idx < PIPELINE_STEPS.length - 1 && (
                <span className="flow-arrow" aria-hidden="true">➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="pipeline-inspector">
        <div className="inspector-header">
          <div className="inspector-title">
            <span className="stage-tag">{activeStep.step}</span>
            <span className="stage-name">{activeStep.name}</span>
          </div>
          <span className="tech-badge">{activeStep.tech}</span>
        </div>
        <div className="inspector-body">
          <div className="detail-item">
            <span className="detail-label">Responsibility:</span>
            <p className="detail-val">{activeStep.description}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Design Pattern:</span>
            <p className="detail-val highlight">{activeStep.pattern}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPipeline;
