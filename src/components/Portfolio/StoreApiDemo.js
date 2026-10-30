import React, { useState } from 'react';
import './StoreApiDemo.scss';

const safeCopyText = (text) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
};

const fallbackCopy = (text) => {
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  } catch (e) {
    // ignore
  }
};

const CATALOG_ITEMS = [
  { id: 1, name: "Mechanical Keyboard (Cherry MX)", category: "Peripherals", price: 89.99, stock: 34, inStock: true, createdAt: "2026-10-28T09:15:00Z" },
  { id: 2, name: "27-inch 4K IPS Monitor", category: "Displays", price: 349.50, stock: 12, inStock: true, createdAt: "2026-10-27T14:30:00Z" },
  { id: 3, name: "Studio Condenser Microphone", category: "Audio", price: 129.00, stock: 18, inStock: true, createdAt: "2026-10-26T11:20:00Z" },
  { id: 4, name: "Ergonomic Vertical Mouse", category: "Peripherals", price: 54.00, stock: 45, inStock: true, createdAt: "2026-10-25T16:45:00Z" },
  { id: 5, name: "Ultra-Wide 34-inch Curved Display", category: "Displays", price: 599.00, stock: 8, inStock: true, createdAt: "2026-10-24T10:10:00Z" },
  { id: 6, name: "Active Noise-Cancelling Headphones", category: "Audio", price: 199.50, stock: 22, inStock: true, createdAt: "2026-10-23T18:00:00Z" },
  { id: 7, name: "Thunderbolt 4 Docking Station", category: "Peripherals", price: 219.00, stock: 15, inStock: true, createdAt: "2026-10-22T13:40:00Z" },
  { id: 8, name: "NVMe M.2 2TB Gen4 SSD", category: "Components", price: 149.99, stock: 50, inStock: true, createdAt: "2026-10-21T08:30:00Z" },
];

const CATEGORIES = ['All', 'Peripherals', 'Displays', 'Audio', 'Components'];

const STATIC_ENDPOINTS = [
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
  const [copiedSql, setCopiedSql] = useState(false);
  const [viewTab, setViewTab] = useState('csharp'); // 'csharp' or 'curl'

  // Interactive Query Parameters for get-products
  const [queryCategory, setQueryCategory] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [queryPage, setQueryPage] = useState(1);
  const [queryPageSize, setQueryPageSize] = useState(2);

  // Compute filtered items for get-products
  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    const matchesCategory = queryCategory === 'All' ? true : item.category === queryCategory;
    const matchesSearch = !searchKeyword.trim() ? true : item.name.toLowerCase().includes(searchKeyword.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });
  const totalCount = filteredCatalog.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / queryPageSize));
  const safePage = Math.min(queryPage, totalPages);
  const offset = (safePage - 1) * queryPageSize;
  const pagedItems = filteredCatalog.slice(offset, offset + queryPageSize);

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(safePage));
  queryParams.set('pageSize', String(queryPageSize));
  if (queryCategory !== 'All') {
    queryParams.set('category', queryCategory);
  }
  if (searchKeyword.trim()) {
    queryParams.set('search', searchKeyword.trim());
  }
  const queryString = queryParams.toString();
  const dynamicGetPath = `/api/products?${queryString}`;

  const whereClauses = [];
  if (queryCategory !== 'All') {
    whereClauses.push(`[p].[Category] = '${queryCategory}'`);
  }
  if (searchKeyword.trim()) {
    whereClauses.push(`[p].[Name] LIKE '%${searchKeyword.trim()}%'`);
  }
  const whereSql = whereClauses.length > 0 ? `\nWHERE ${whereClauses.join(' AND ')}` : '';

  const dynamicGetSql = `SELECT [p].[Id], [p].[Name], [p].[Category], [p].[Price], [p].[Stock]
FROM [Products] AS [p]${whereSql}
ORDER BY [p].[CreatedAt] DESC
LIMIT ${queryPageSize} OFFSET ${offset};`;

  const dynamicGetCurl = `curl -X GET "https://api.store.local${dynamicGetPath}" \\
  -H "Accept: application/json"`;

  const linqFilters = [];
  if (queryCategory !== 'All') {
    linqFilters.push(`query = query.Where(p => p.Category == category);`);
  }
  if (searchKeyword.trim()) {
    linqFilters.push(`query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));`);
  }

  const dynamicGetCsharp = `// ProductsController.cs
[HttpGet]
public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts(
    [FromQuery] int page = ${safePage},
    [FromQuery] int pageSize = ${queryPageSize}${queryCategory !== 'All' ? `,\n    [FromQuery] string category = "${queryCategory}"` : ''}${searchKeyword.trim() ? `,\n    [FromQuery] string search = "${searchKeyword.trim()}"` : ''})
{
    var query = _context.Products.AsNoTracking();
${linqFilters.length > 0 ? '    ' + linqFilters.join('\n    ') + '\n' : ''}    var total = await query.CountAsync();
    var items = await query
        .OrderByDescending(p => p.CreatedAt)
        .Skip((${safePage} - 1) * ${queryPageSize})
        .Take(${queryPageSize})
        .Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Stock))
        .ToListAsync();

    return Ok(new PagedResult<ProductDto>(items, total, ${safePage}, ${queryPageSize}));
};`;

  const dynamicGetResponse = {
    status: 200,
    page: safePage,
    pageSize: queryPageSize,
    totalCount: totalCount,
    totalPages: totalPages,
    data: pagedItems.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      inStock: p.inStock
    }))
  };

  const getDynamicEndpoint = () => {
    if (activeEndpointId === 'get-products') {
      return {
        id: 'get-products',
        method: 'GET',
        path: dynamicGetPath,
        name: 'Browse Catalog (EF Core Query & Pagination)',
        authRequired: false,
        curlCmd: dynamicGetCurl,
        csharpCode: dynamicGetCsharp,
        sqlExecution: dynamicGetSql,
        responseStatus: '200 OK',
        latency: `${14 + queryPageSize * 2}ms`,
        responseData: dynamicGetResponse,
      };
    }
    return STATIC_ENDPOINTS.find((e) => e.id === activeEndpointId) || STATIC_ENDPOINTS[0];
  };

  const activeEndpoint = getDynamicEndpoint();

  const handleExecute = () => {
    setIsExecuting(true);
    setHasExecuted(false);
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
    }, 350);
  };

  const handleCopyCode = () => {
    const textToCopy = viewTab === 'curl' ? activeEndpoint.curlCmd : activeEndpoint.csharpCode;
    safeCopyText(textToCopy);
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
    safeCopyText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopySql = () => {
    safeCopyText(activeEndpoint.sqlExecution);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const isQueryModified =
    queryCategory !== 'All' ||
    searchKeyword.trim() !== '' ||
    queryPage !== 1 ||
    queryPageSize !== 2;

  const handleResetQuery = () => {
    setQueryCategory('All');
    setSearchKeyword('');
    setQueryPage(1);
    setQueryPageSize(2);
    setHasExecuted(false);
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
          Test real controller pipelines, Entity Framework Core queries, dynamic LINQ pagination, and JWT Role-Based Authorization implemented in the <strong>StoreApi</strong> project.
        </p>
      </div>

      <div className="demo-controls">
        <div className="endpoint-selector">
          <button
            className={`endpoint-btn ${activeEndpointId === 'get-products' ? 'active' : ''}`}
            onClick={() => {
              setActiveEndpointId('get-products');
              setHasExecuted(false);
            }}
          >
            <span className="method-badge get">GET</span>
            <span className="ep-title">Browse Catalog (Interactive EF Core)</span>
          </button>
          {STATIC_ENDPOINTS.map((ep) => (
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

        {/* Live Interactive Query Controls for get-products */}
        {activeEndpointId === 'get-products' && (
          <div className="interactive-params-bar" role="toolbar" aria-label="Interactive Query Parameters">
            <div className="param-group">
              <span className="param-label">Category Filter:</span>
              <div className="param-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`param-pill ${queryCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setQueryCategory(cat);
                      setQueryPage(1);
                      setHasExecuted(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="param-group-row">
              <div className="param-group search-group">
                <span className="param-label">Search Keyword:</span>
                <div className="search-pill-wrap">
                  <input
                    type="text"
                    className="simulator-search-input"
                    placeholder="Search by title (e.g. keyboard, monitor)..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setQueryPage(1);
                      setHasExecuted(false);
                    }}
                    aria-label="Filter products by keyword in simulator"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      className="clear-sim-search"
                      onClick={() => {
                        setSearchKeyword('');
                        setQueryPage(1);
                        setHasExecuted(false);
                      }}
                      aria-label="Clear keyword search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="param-group">
                <span className="param-label">Page:</span>
                <div className="param-pills">
                  {[1, 2, 3, 4].slice(0, Math.max(1, totalPages)).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`param-pill page-pill ${safePage === p ? 'active' : ''}`}
                      onClick={() => {
                        setQueryPage(p);
                        setHasExecuted(false);
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="param-group">
                <span className="param-label">Page Size:</span>
                <div className="param-pills">
                  {[2, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`param-pill ${queryPageSize === size ? 'active' : ''}`}
                      onClick={() => {
                        setQueryPageSize(size);
                        setQueryPage(1);
                        setHasExecuted(false);
                      }}
                    >
                      {size} / page
                    </button>
                  ))}
                </div>
              </div>

              {isQueryModified && (
                <div className="param-group reset-group">
                  <button
                    type="button"
                    className="param-reset-btn"
                    onClick={handleResetQuery}
                    title="Reset simulator filters to default"
                    aria-label="Reset query parameters to default"
                  >
                    ↺ Reset Query
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
            aria-label="Send simulated HTTP request"
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
                C# Controller &amp; LINQ
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
            <span>EF Core Generated SQL Query (LINQ Translation)</span>
            <div className="sql-header-actions">
              <span className="file-tag">SQLite / MySQL</span>
              <button
                type="button"
                className="copy-btn copy-sql-btn"
                onClick={handleCopySql}
                aria-label="Copy generated SQL query"
              >
                {copiedSql ? '✓ Copied' : 'Copy SQL'}
              </button>
            </div>
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
