/**
 * Engineering Blog & Technical Notes Repository
 * High-value architectural case-studies and engineering insights by Mahmud al Hasan.
 */

export const BLOG_ARTICLES = [
  {
    slug: 'clean-architecture-aspnet-core',
    title: 'Architecting High-Throughput Clean Architecture in ASP.NET Core 8 & C#',
    subtitle: 'CQRS with MediatR, Domain-Driven Design, and Resilient Query Performance',
    category: 'Architecture',
    date: 'October 28, 2026',
    readTime: '6 min read',
    tags: ['ASP.NET Core', 'C#', 'Clean Architecture', 'CQRS', 'Redis', 'EF Core'],
    summary:
      'A practical guide to structuring enterprise distributed backend services using Clean Architecture, CQRS, MediatR command pipelines, and zero-allocation query optimizations in .NET 8.',
    content: `
### 1. The Challenge with Monolithic Layering
In traditional N-tier architectures, the user interface or API controllers often leak business logic directly into repositories and database contexts. When handling hundreds of thousands of concurrent transactions—such as multi-vendor ecommerce orders or fintech ledger records—this coupling leads to performance bottlenecks, concurrency deadlocks, and testing nightmares.

### 2. The Clean Architecture Solution
By implementing Clean Architecture with Domain-Driven Design (DDD), dependencies strictly point inward towards the Core Domain:

- **Domain Layer**: Contains enterprise entities, value objects, domain events, and core validation rules without any third-party framework dependencies.
- **Application Layer**: Houses CQRS commands, queries, MediatR request handlers, and validation behaviors (FluentValidation pipeline behaviors).
- **Infrastructure Layer**: Encapsulates external implementations: EF Core DbContext, Redis distributed caching, RabbitMQ message publishers, and cloud blob storage.
- **Presentation / Web API Layer**: Lightweight ASP.NET Core Minimal APIs or Controllers acting strictly as transport adapters.

\`\`\`csharp
// Example: MediatR Command Pipeline with Validation & Cache Invalidation
public sealed record CreateOrderCommand(
    Guid CustomerId,
    IReadOnlyList<OrderItemDto> Items,
    AddressDto ShippingAddress
) : IRequest<Result<OrderResponse>>;

public sealed class CreateOrderCommandHandler 
    : IRequestHandler<CreateOrderCommand, Result<OrderResponse>>
{
    private readonly IOrderRepository _orderRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public CreateOrderCommandHandler(
        IOrderRepository orderRepo, 
        IUnitOfWork unitOfWork, 
        ICacheService cache)
    {
        _orderRepo = orderRepo;
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<Result<OrderResponse>> Handle(
        CreateOrderCommand request, 
        CancellationToken ct)
    {
        // 1. Instantiate Rich Domain Entity
        var order = Order.Create(request.CustomerId, request.ShippingAddress);
        foreach (var item in request.Items)
        {
            order.AddItem(item.ProductId, item.Quantity, item.UnitPrice);
        }

        // 2. Persist with Outbox Pattern
        await _orderRepo.AddAsync(order, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // 3. Invalidate Redis Caches
        await _cache.RemoveAsync($"customer-orders:{request.CustomerId}", ct);

        return Result.Success(OrderResponse.FromDomain(order));
    }
}
\`\`\`

### 3. Query Splitting & AsNoTracking in EF Core
For read-heavy endpoints, using \`AsNoTracking()\` combined with \`AsSplitQuery()\` prevents Cartesian explosion when joining complex navigational properties:

\`\`\`csharp
public async Task<OrderDetailsDto?> GetOrderByIdAsync(Guid id, CancellationToken ct)
{
    return await _context.Orders
        .AsNoTracking()
        .AsSplitQuery()
        .Where(o => o.Id == id)
        .Select(OrderQueries.ProjectToDetailsDto)
        .FirstOrDefaultAsync(ct);
}
\`\`\`

### 4. Key Takeaways
- Decouple application use-cases using CQRS commands and queries.
- Keep domain entities rich with behavior rather than anemic DTOs.
- Isolate infrastructure side-effects behind clean domain interfaces.
    `,
  },
  {
    slug: 'distributed-microservices-laravel-nestjs',
    title: 'Building Resilient Microservices with Laravel, NestJS & RabbitMQ',
    subtitle: 'Event-Driven Messaging, Transactional Outbox Pattern, and Graceful Idempotency',
    category: 'Backend',
    date: 'September 15, 2026',
    readTime: '8 min read',
    tags: ['Laravel', 'NestJS', 'Microservices', 'RabbitMQ', 'TypeScript', 'Docker'],
    summary:
      'How to orchestrate polyglot microservice ecosystems where high-throughput NestJS event consumers and Laravel business workflow services communicate with zero message loss.',
    content: `
### 1. The Distributed State Conundrum
When decomposing a system into specialized services—for instance, a **Laravel Billing Service** and a **NestJS Real-Time Notification & Analytics Service**—maintaining transactional consistency without distributed two-phase commit (2PC) locks is the primary engineering challenge.

### 2. The Transactional Outbox Pattern
To prevent the classic failure scenario (database commits but message broker publish fails), we implement the Transactional Outbox Pattern. Both the business entity change and the event payload are written within the same local database transaction.

\`\`\`typescript
// NestJS Outbox Consumer with Idempotent Message Processing
@Injectable()
export class OrderEventsConsumer {
  private readonly logger = new Logger(OrderEventsConsumer.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationService,
  ) {}

  @RabbitSubscribe({
    exchange: 'orders.topic',
    routingKey: 'order.placed',
    queue: 'notifications.order-placed',
  })
  public async handleOrderPlaced(msg: OrderPlacedEvent): Promise<void> {
    const dedupeKey = \`msg:dedupe:\${msg.eventId}\`;
    
    // 1. Atomic Redis check to guarantee exactly-once processing semantics
    const isNew = await this.redisService.setnx(dedupeKey, '1', 86400);
    if (!isNew) {
      this.logger.warn(\`Duplicate message detected: \${msg.eventId}, skipping.\`);
      return;
    }

    try {
      await this.notificationService.dispatchOrderAlert(msg);
      this.logger.log(\`Successfully notified customer for Order #\${msg.orderId}\`);
    } catch (err) {
      // Invalidate dedupe key on transient failure so retry queue can process
      await this.redisService.del(dedupeKey);
      throw err;
    }
  }
}
\`\`\`

### 3. Laravel Event-Driven Publishing
On the Laravel side, database transactions trigger domain events that write to the outbox table via dedicated observers:

\`\`\`php
DB::transaction(function () use ($orderData) {
    $order = Order::create($orderData);
    
    OutboxMessage::create([
        'event_id' => Str::uuid(),
        'event_type' => 'order.placed',
        'payload' => json_encode(new OrderPlacedResource($order)),
        'status' => 'PENDING',
    ]);
});
\`\`\`

A dedicated background worker reads pending outbox messages and publishes them to RabbitMQ topics with automatic exponential backoff retries.

### 4. Key Takeaways
- Never publish directly to message brokers inside an uncommitted database transaction.
- Always implement consumer-side idempotency keys via Redis or distributed unique constraints.
- Standardize event envelopes across PHP and TypeScript services using typed JSON schemas.
    `,
  },
  {
    slug: 'database-indexing-optimization-mysql',
    title: 'Database Indexing & Query Optimization for Millions of Records',
    subtitle: 'B-Tree Internals, Composite Index Selectivity, and EXPLAIN Query Plans',
    category: 'Database',
    date: 'August 22, 2026',
    readTime: '7 min read',
    tags: ['MySQL', 'PostgreSQL', 'SQL Optimization', 'Indexing', 'B-Tree'],
    summary:
      'A deep dive into indexing strategies, preventing table scans on multi-million row datasets, understanding composite index column ordering, and profiling queries with EXPLAIN ANALYZE.',
    content: `
### 1. How B-Trees Actually Work on Disk
Most relational database developers understand that indexes speed up reads, but few visualize the internal B+ Tree node layout. When MySQL InnoDB reads an index, it traverses pages of 16KB from root to leaf node. If your index doesn't cover the requested columns, the engine must perform a secondary lookup ("Bookmark Lookup" or clustered index traverse), multiplying random I/O reads.

### 2. The Golden Rule of Composite Indexes: ESR
When creating a multi-column composite index, order your columns using the **ESR Rule**:
1. **E - Equality**: Columns compared with \`=\` or \`IS NULL\` come first.
2. **S - Sort / Order By**: Columns used in \`ORDER BY\` come second.
3. **R - Range**: Columns compared with \`>\`, \`<\`, \`BETWEEN\`, or \`LIKE\` come last.

\`\`\`sql
-- Problem Query: Slow on 15,000,000 rows (Execution: 4.8 seconds)
SELECT id, customer_id, total_amount, created_at
FROM orders
WHERE tenant_id = 'tenant_4928'
  AND status = 'COMPLETED'
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 50;

-- Optimal Composite Index following ESR Rule:
CREATE INDEX idx_orders_tenant_status_created 
ON orders (tenant_id, status, created_at DESC);
\`\`\`

With the above composite index, MySQL performs an index range scan directly on the leaf nodes without any sorting in temporary memory (\`Using filesort\` is completely eliminated), bringing execution time from **4,800ms down to 1.8ms**.

### 3. Decoding EXPLAIN ANALYZE
Look for red flags in query execution plans:
- \`type: ALL\`: Full table scan. Fatal on large tables.
- \`Using filesort\`: Database has to sort rows in memory or on temporary disk.
- \`Using temporary\`: Query creates an internal temporary table to aggregate or group.

### 4. Key Takeaways
- Align multi-column indexes with the Equality-Sort-Range pattern.
- Strive for **Covering Indexes** on critical high-frequency read endpoints.
- Regularly inspect \`information_schema\` for unused redundant indexes that degrade write latency.
    `,
  },
  {
    slug: 'engineering-focus-station-web-audio',
    title: 'Engineering the Focus Station: Procedural Web Audio & Pomodoro Engine in React',
    subtitle: 'Zero-Asset Soundscapes, Low-Drift Timers, and VisionOS Glassmorphism',
    category: 'DevOps',
    date: 'July 10, 2026',
    readTime: '5 min read',
    tags: ['React', 'Web Audio API', 'Pomodoro', 'UI/UX', 'Architecture'],
    summary:
      'The architecture behind the Focus Station in this portfolio: synthesizing nature sounds with Web Audio API white noise filters, correcting browser setInterval drift, and building an accessible glassmorphism workstation.',
    content: `
### 1. The Inspiration
Developers spend 80% of their deep work time overcoming distractions. Instead of relying on third-party music streaming services that constantly recommend irrelevant videos or consume hundreds of megabytes of bandwidth, we engineered the **Focus Station** directly into this portfolio.

### 2. Procedural Web Audio Generation
Instead of loading gigabytes of MP3 files, nature sounds (rain, ocean waves, white noise) can be procedurally generated using Web Audio API nodes:

\`\`\`javascript
// Synthesizing Gentle Rain using Bandpass-Filtered Pink Noise
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const bufferSize = ctx.sampleRate * 2;
const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const output = noiseBuffer.getChannelData(0);

let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
for (let i = 0; i < bufferSize; i++) {
  const white = Math.random() * 2 - 1;
  b0 = 0.99886 * b0 + white * 0.0555179;
  b1 = 0.99332 * b1 + white * 0.0750759;
  b2 = 0.96900 * b2 + white * 0.1538520;
  b3 = 0.86650 * b3 + white * 0.3104856;
  b4 = 0.55000 * b4 + white * 0.5329522;
  b5 = -0.7616 * b5 - white * 0.0168980;
  output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
  b6 = white * 0.115926;
}

const whiteNoise = ctx.createBufferSource();
whiteNoise.buffer = noiseBuffer;
whiteNoise.loop = true;

// Bandpass Filter mimicking raindrop impact
const filter = ctx.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.setValueAtTime(1000, ctx.currentTime);

whiteNoise.connect(filter);
filter.connect(ctx.destination);
whiteNoise.start();
\`\`\`

### 3. Solving Browser Interval Drift
Standard \`setInterval(..., 1000)\` in JavaScript drifts by several seconds every hour due to thread queuing and tab throttling. In the Focus Station Pomodoro engine, we compute remaining seconds by diffing against \`performance.now()\` and target timestamps, guaranteeing millisecond accuracy.

### 4. Key Takeaways
- Procedural audio synthesis provides infinite sound playback with near-zero bundle size.
- Always use high-resolution timestamps (\`performance.now()\`) for countdown timers.
- Build tools that keep developers in the zone without leaving the workspace.
    `,
  },
];

export const getAllArticles = () => BLOG_ARTICLES;

export const getArticleBySlug = (slug) =>
  BLOG_ARTICLES.find((article) => article.slug === slug) || null;
