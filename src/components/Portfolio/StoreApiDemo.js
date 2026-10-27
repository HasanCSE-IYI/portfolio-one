import React, { useState } from 'react';
import './StoreApiDemo.scss';

const ENDPOINTS = [
  {
    id: 'get-products',
    method: 'GET',
    path: '/api/products?page=1&pageSize=2',
    name: 'Browse Catalog (EF Core Query)',
    authRequired: false,
    curlCmd: `curl -X GET "https://api.store.local/api/products?page=1&pageSize=2" \\
  -H "Accept: application/json"`,
    csharpCode: `// ProductsController.cs
[HttpGet]
public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts(
    [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
{
    var query = _context.Products.AsNoTracking();
    var total = await query.CountAsync();
    var items = await query
        .OrderByDescending(p => p.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Stock))
        .ToListAsync();

    return Ok(new PagedResult<ProductDto>(items, total, page, pageSize));
}`,
    sqlExecution: `SELECT [p].[Id], [p].[Name], [p].[Price], [p].[Stock]
FROM [Products] AS [p]
ORDER BY [p].[CreatedAt] DESC
LIMIT 2 OFFSET 0;`,
    responseStatus: '200 OK',
    latency: '18ms',
    responseData: {
      status: 200,
      page: 1,
      pageSize: 2,
      totalCount: 48,
      data: [
        { id: 1, name: "Mechanical Keyboard (Cherry MX)", price: 89.99, stock: 34, inStock: true },
        { id: 2, name: "27-inch 4K IPS Monitor", price: 349.50, stock: 12, inStock: true }
      ]
    }
  },
  {
    id: 'auth-login',
    method: 'POST',
    path: '/api/auth/login',
    name: 'JWT Authentication & Claims',
    authRequired: false,
    curlCmd: `curl -X POST "https://api.store.local/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "password": "SecurePassword123!"}'`,
    csharpCode: `// AuthController.cs
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    var user = await _userManager.FindByNameAsync(dto.Username);
    if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        return Unauthorized(new { message = "Invalid credentials" });

    var userRoles = await _userManager.GetRolesAsync(user);
    var token = _tokenService.GenerateJwtToken(user, userRoles);

    return Ok(new { token, expiresIn = 3600, roles = userRoles });
}`,
    sqlExecution: `SELECT [u].[Id], [u].[UserName], [u].[PasswordHash]
FROM [AspNetUsers] AS [u]
WHERE [u].[UserName] = 'admin' LIMIT 1;`,
    responseStatus: '200 OK',
    latency: '32ms',
    responseData: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWhtdWQiLCJyb2xlIjoiQWRtaW4iLCJpc3MiOiJTdG9yZUFwaSJ9.signature_hash_verified",
      tokenType: "Bearer",
      expiresIn: 3600,
      claims: {
        sub: "mahmud.csem@gmail.com",
        role: "Admin",
        permission: "Products.Manage"
      }
    }
  },
  {
    id: 'post-product',
    method: 'POST',
    path: '/api/products',
    name: 'Role Authorization ([Authorize(Roles = "Admin")])',
    authRequired: true,
    curlCmd: `curl -X POST "https://api.store.local/api/products" \\
  -H "Authorization: Bearer eyJhbGciOi..." \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Ultra-Wide USB-C Dock", "price": 119.00, "stock": 25}'`,
    csharpCode: `// ProductsController.cs
[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var entity = new Product {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        CreatedAt = DateTime.UtcNow
    };

    _context.Products.Add(entity);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
}`,
    sqlExecution: `INSERT INTO [Products] ([Name], [Price], [Stock], [CreatedAt])
VALUES ('Ultra-Wide USB-C Dock', 119.00, 25, '2026-10-26T12:00:00Z');
SELECT last_insert_rowid();`,
    responseStatus: '201 Created',
    latency: '24ms',
    responseData: {
      status: 201,
      message: "Product created successfully",
      createdItem: {
        id: 49,
        name: "Ultra-Wide USB-C Dock",
        price: 119.00,
        stock: 25,
        createdAt: "2026-10-26T12:00:00Z"
      }
    }
  },
  {
    id: 'error-handling',
    method: 'GET',
    path: '/api/products/999',
    name: 'RFC 7807 Exception (404 Not Found)',
    authRequired: false,
    curlCmd: `curl -X GET "https://api.store.local/api/products/999" \\
  -H "Accept: application/problem+json"`,
    csharpCode: `// ProductsController.cs & GlobalExceptionHandler.cs
[HttpGet("{id:int}")]
public async Task<ActionResult<ProductDto>> GetById(int id)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null)
    {
        // Handled via ASP.NET Core ProblemDetails (RFC 7807)
        return Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Product Not Found",
            detail: $"Product with ID {id} was not found in the catalog."
        );
    }
    return Ok(_mapper.Map<ProductDto>(product));
}`,
    sqlExecution: `SELECT [p].[Id], [p].[Name], [p].[Price], [p].[Stock]
FROM [Products] AS [p]
WHERE [p].[Id] = 999
LIMIT 1;
-- Query returned 0 records; triggering ProblemDetails response`,
    responseStatus: '404 Not Found',
    latency: '14ms',
    responseData: {
      type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
      title: "Product Not Found",
      status: 404,
      detail: "Product with ID 999 was not found in the catalog.",
      instance: "/api/products/999",
      traceId: "00-8b4e7246a362dbd66e300dabaed78-01"
    }
  }
];

const StoreApiDemo = () => {
  const [activeEndpointId, setActiveEndpointId] = useState('get-products');
  const [role, setRole] = useState('Admin'); // 'Admin' or 'User'
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [viewTab, setViewTab] = useState('csharp'); // 'csharp' or 'curl'

  const activeEndpoint = ENDPOINTS.find((e) => e.id === activeEndpointId) || ENDPOINTS[0];

  const handleExecute = () => {
    setIsExecuting(true);
    setHasExecuted(false);
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
    }, 400);
  };

  const handleCopyCode = () => {
    const textToCopy = viewTab === 'curl' ? activeEndpoint.curlCmd : activeEndpoint.csharpCode;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    const payload = isForbidden
      ? {
          status: 403,
          title: "Forbidden",
          detail: "User is not authorized to access this resource. Requires role: 'Admin'. Current role: 'User'.",
          path: activeEndpoint.path
        }
      : activeEndpoint.responseData;
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const isForbidden = activeEndpoint.authRequired && role !== 'Admin';
  const isErrorStatus =
    isForbidden ||
    activeEndpoint.responseStatus.startsWith('4') ||
    activeEndpoint.responseStatus.startsWith('5');

  return (
    <div className="store-api-demo">
      <div className="demo-header">
        <div className="demo-badge">
          <span className="pulse-dot"></span>
          LIVE ARCHITECTURE SIMULATOR · ASP.NET CORE &amp; EF CORE
        </div>
        <p className="demo-description">
          Test real controller pipelines, Entity Framework Core queries, and JWT Role-Based Authorization implemented in the <strong>StoreApi</strong> project.
        </p>
      </div>

      <div className="demo-controls">
        <div className="endpoint-selector">
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              className={`endpoint-btn ${activeEndpointId === ep.id ? 'active' : ''}`}
              onClick={() => {
                setActiveEndpointId(ep.id);
                setHasExecuted(false);
              }}
            >
              <span className={`method-badge ${ep.method.toLowerCase()}`}>{ep.method}</span>
              <span className="ep-title">{ep.name}</span>
            </button>
          ))}
        </div>

        {activeEndpoint.authRequired && (
          <div className="role-switcher">
            <span className="role-label">Simulate Request as:</span>
            <div className="role-buttons">
              <button
                className={`role-btn ${role === 'Admin' ? 'active admin' : ''}`}
                onClick={() => {
                  setRole('Admin');
                  setHasExecuted(false);
                }}
              >
                Role: Admin (Authorized)
              </button>
              <button
                className={`role-btn ${role === 'User' ? 'active user' : ''}`}
                onClick={() => {
                  setRole('User');
                  setHasExecuted(false);
                }}
              >
                Role: Regular User (Forbidden)
              </button>
            </div>
          </div>
        )}

        <div className="action-bar">
          <div className="url-preview">
            <span className={`method-pill ${activeEndpoint.method.toLowerCase()}`}>
              {activeEndpoint.method}
            </span>
            <span className="url-text">{activeEndpoint.path}</span>
          </div>
          <button
            className="execute-btn"
            onClick={handleExecute}
            disabled={isExecuting}
          >
            {isExecuting ? 'Simulating Pipeline...' : '▶ Send Request'}
          </button>
        </div>
      </div>

      <div className="demo-workspace">
        <div className="code-column">
          <div className="panel-header">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="tab-switch">
              <button
                className={`tab-btn ${viewTab === 'csharp' ? 'active' : ''}`}
                onClick={() => setViewTab('csharp')}
              >
                C# Controller
              </button>
              <button
                className={`tab-btn ${viewTab === 'curl' ? 'active' : ''}`}
                onClick={() => setViewTab('curl')}
              >
                cURL Command
              </button>
            </div>
            <button className="copy-btn" onClick={handleCopyCode}>
              {copiedCode ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <pre className="code-block">
            <code>{viewTab === 'curl' ? activeEndpoint.curlCmd : activeEndpoint.csharpCode}</code>
          </pre>

          <div className="panel-header sql-header">
            <span>EF Core Generated SQL Query</span>
            <span className="file-tag">SQLite / MySQL</span>
          </div>
          <pre className="code-block sql-block">
            <code>{activeEndpoint.sqlExecution}</code>
          </pre>
        </div>

        <div className="output-column">
          <div className="panel-header">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span>HTTP Response Inspector</span>
            <div className="header-actions">
              {hasExecuted && (
                <>
                  <button className="copy-btn" onClick={handleCopyJson}>
                    {copiedJson ? '✓ Copied' : 'Copy JSON'}
                  </button>
                  <span className={`status-pill ${isErrorStatus ? 'error' : 'success'}`}>
                    {isForbidden ? '403 Forbidden' : activeEndpoint.responseStatus} ({activeEndpoint.latency})
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="output-body">
            {!hasExecuted && !isExecuting && (
              <div className="placeholder-state">
                <p>Click <strong>▶ Send Request</strong> to execute the ASP.NET Core pipeline and inspect the simulated HTTP response.</p>
              </div>
            )}
            {isExecuting && (
              <div className="executing-state">
                <div className="spinner"></div>
                <p>Evaluating JWT Claims &amp; Executing EF Core Query...</p>
              </div>
            )}
            {hasExecuted && (
              <pre className="json-output">
                <code>
                  {JSON.stringify(
                    isForbidden
                      ? {
                          status: 403,
                          title: "Forbidden",
                          detail: "User is not authorized to access this resource. Requires role: 'Admin'. Current role: 'User'.",
                          path: activeEndpoint.path
                        }
                      : activeEndpoint.responseData,
                    null,
                    2
                  )}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreApiDemo;
