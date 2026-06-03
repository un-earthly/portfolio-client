---
title: I Modernized a 20-Year-Old VB.NET System Without Burning the Business Down
date: 2025-10-20
tags: [legacy modernization, VB.NET, Nuxt.js, MSSQL, migration, software engineering, case study]
metaDescription: A technical case study on migrating a 20-year-old VB.NET monolith with millions of MSSQL records to a modern Nuxt.js stack — including strategy, pitfalls, and measurable results.
readTime: 20
type: technical
excerpt: Legacy modernization is the most underrated skill in software engineering. This is the Grimm Scientific case study — migrating a VB.NET monolith to Nuxt.js while the business ran uninterrupted, with 95% load time reduction.
---

Legacy modernization is the most underrated skill in software engineering.

Everyone wants to build greenfield. Almost no one wants to touch the system that's been running since 2003, has no documentation, and directly controls the revenue of a real business. That's exactly what I signed up for at Masleap when I led the Grimm Scientific Industries migration.

Grimm had a VB.NET desktop application sitting on top of a 20-year-old MSSQL database. Millions of records. Business logic embedded in stored procedures nobody fully understood. Queries that ran in nested loops written before JOIN optimization was a concern. The system worked — barely — and replacing it wrong would've taken the business down.

## The System We Inherited

Before touching a single line, I spent two weeks mapping the actual state:

```
┌─────────────────────────────────────────────────────┐
│                 Grimm Legacy Stack                   │
│                                                     │
│  VB.NET Forms App (.NET 2.0, Windows-only)          │
│         │                                           │
│  ┌──────▼──────┐   ADO.NET direct SQL              │
│  │  Stored     │◄──────────────────────────────┐   │
│  │  Procedures │   1,400+ stored procedures    │   │
│  └──────┬──────┘   40% undocumented            │   │
│         │                                      │   │
│  ┌──────▼──────────────────────────────────┐   │   │
│  │           MSSQL 2008 R2                  │   │   │
│  │  - 340 tables, ~40% without FK relations │   │   │
│  │  - 18M rows in core transaction table   │   │   │
│  │  - Zero composite indexes on joins       │   │   │
│  │  - Cursor-based loops in hot paths       │   │   │
│  └─────────────────────────────────────────┘   │   │
│                                                 │   │
│  Avg query time on reports: 45–120 seconds     │   │
└─────────────────────────────────────────────────┘
```

The archaeological phase produced three artifacts before any code was written:

- **Entity map**: all 340 tables, relationships inferred from column naming conventions and cross-referencing stored procedure calls
- **Hotspot report**: query profiler output identifying the 15 stored procedures responsible for 70% of execution time
- **Business logic catalogue**: every stored procedure classified as (a) pure retrieval, (b) computation, (c) state mutation, or (d) unknown

Classification mattered because the migration order followed it: pure retrieval first (safest), unknown last.

## The Approach: Strangler Fig, Not Big Bang

The worst mistake in legacy migration is trying to replace everything at once. I went strangler fig — run old and new in parallel, migrate surface by surface, validate against the live system.

```
Phase 0: API intermediary (NEW)        Phase 1: Migrate surfaces
─────────────────────────────          ─────────────────────────
                                       VB.NET ──► Nuxt.js
VB.NET ──► MSSQL                      (one module at a time)
              │                                │
              └──► NestJS API ◄──── Nuxt.js   ▼
                      │               All modules
                      └──► MSSQL     migrated
                                       │
                      ▲                ▼
                      │        VB.NET decommissioned
              Strangler wraps          
              old DB queries
              behind clean API
              contracts
```

The API intermediary was the architectural cornerstone. By inserting a NestJS layer between the old MSSQL and the new frontend, we could:

1. Migrate the frontend (VB.NET forms → Nuxt.js) independently of the database
2. Migrate the database schema incrementally behind the API contract
3. Run both old and new simultaneously, validating output parity

```typescript
// The API intermediary pattern — NestJS wrapping the legacy query
// The Nuxt.js frontend never knows it's hitting a 2003 database

@Injectable()
class PayrollService {
  constructor(private readonly mssql: MSSQLService) {}

  async getPayrollByEmployee(employeeId: string): Promise<PayrollRecord[]> {
    // Phase 1: delegate to legacy stored procedure, wrapped in clean contract
    const raw = await this.mssql.query<LegacyPayrollRow>(
      `EXEC sp_GetPayrollByEmp @EmpId = @0`,
      [employeeId]
    );

    // Normalize the inconsistent legacy schema to clean DTOs
    return raw.map(row => ({
      id: row.PayrollID,
      employeeId: row.EmpID,
      period: { start: row.PayPeriodStart, end: row.PayPeriodEnd },
      gross: parseFloat(row.GrossAmt ?? "0"),
      deductions: parseFloat(row.DeductTotal ?? "0"),
      net: parseFloat(row.NetPay ?? "0"),
    }));

    // Phase 2 (later): swap the query internals, keep the return type identical
    // The Nuxt.js layer never changes
  }
}
```

## The Query Rehabilitation

This was the most technically interesting phase. The original system had queries doing full table scans on tables with 18 million rows.

A representative example — the attendance summary report, which previously took 87 seconds:

```sql
-- BEFORE: cursor loop over 18M rows
DECLARE @EmpID INT
DECLARE emp_cursor CURSOR FOR SELECT EmpID FROM Employees
OPEN emp_cursor
FETCH NEXT FROM emp_cursor INTO @EmpID

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Nested scan per employee — O(n*m) against a non-indexed table
    INSERT INTO #TempAttendance
    SELECT EmpID, COUNT(*) AS DaysPresent
    FROM AttendanceLog
    WHERE EmpID = @EmpID
      AND AttDate BETWEEN @StartDate AND @EndDate
    GROUP BY EmpID

    FETCH NEXT FROM emp_cursor INTO @EmpID
END

CLOSE emp_cursor
DEALLOCATE emp_cursor
```

```sql
-- AFTER: set-based with composite index
-- Step 1: Create composite index on the 18M-row table
CREATE NONCLUSTERED INDEX IX_AttendanceLog_EmpDate
ON AttendanceLog (EmpID, AttDate)
INCLUDE (Status);

-- Step 2: Replace cursor with a single set-based aggregation
SELECT
    e.EmpID,
    e.FullName,
    e.Department,
    COUNT(CASE WHEN a.Status = 'P' THEN 1 END)  AS DaysPresent,
    COUNT(CASE WHEN a.Status = 'A' THEN 1 END)  AS DaysAbsent,
    COUNT(CASE WHEN a.Status = 'L' THEN 1 END)  AS DaysLeave
FROM Employees e
LEFT JOIN AttendanceLog a
    ON e.EmpID = a.EmpID
    AND a.AttDate BETWEEN @StartDate AND @EndDate
GROUP BY e.EmpID, e.FullName, e.Department
OPTION (MAXDOP 4);
```

The impact across the 15 critical operations:

```
Report / Operation              Before      After     Reduction
─────────────────────────────────────────────────────────────────
Attendance summary              87s         1.2s      98.6%
Payroll computation             45s         0.8s      98.2%
KPI dashboard load              120s        2.1s      98.3%
Supply chain report             65s         3.4s      94.8%
Employee record search          8s          0.05s     99.4%
Vendor payment listing          30s         0.4s      98.7%
─────────────────────────────────────────────────────────────────
Overall p95 load time           90s         2.5s      97.2%
```

Three techniques drove most of the improvement:

- **Composite indexes**: covering the exact column combinations used in JOINs and WHERE clauses
- **Cursor elimination**: replacing RBAR (row-by-agonizing-row) processing with set-based SQL
- **Subquery refactoring**: replacing correlated subqueries with CTEs and window functions

## Data Validation: The Zero-Tolerance Contract

With millions of live records, data integrity during migration was non-negotiable. I wrote a dual-read validator that ran nightly for six weeks, comparing output from the old and new layers:

```typescript
async function validateMigrationParity(
  legacyService: LegacyPayrollService,
  newService: PayrollService,
  sampleSize = 500
): Promise<ValidationReport> {
  const employeeIds = await sampleEmployees(sampleSize);
  const discrepancies: Discrepancy[] = [];

  for (const id of employeeIds) {
    const [legacy, migrated] = await Promise.all([
      legacyService.getPayrollByEmployee(id),
      newService.getPayrollByEmployee(id),
    ]);

    if (!isDeepEqual(normalise(legacy), normalise(migrated))) {
      discrepancies.push({
        employeeId: id,
        legacy: normalise(legacy),
        migrated: normalise(migrated),
        diff: deepDiff(normalise(legacy), normalise(migrated)),
      });
    }
  }

  return {
    sampleSize,
    discrepancyCount: discrepancies.length,
    discrepancyRate: discrepancies.length / sampleSize,
    details: discrepancies,
  };
}
```

Any discrepancy rate above 0.1% blocked the corresponding module from promotion to production. We hit zero data loss across the full migration.

## The Numbers

```
Metric                        Result
──────────────────────────────────────────────────────
P95 load time reduction       97.2% (90s → 2.5s)
Development velocity gain     30% faster post-migration
Data loss                     0 records
Business downtime             0 minutes
Migration duration            9 months (phased)
Modules migrated              8 (payroll, CAPA, vendor,
                               customer, logistics,
                               attendance, KPI, HR)
```

## What Most Devs Get Wrong About Legacy Work

They treat it as purely technical. It's not. The hardest part of this project was convincing stakeholders that the strangler fig approach meant the old system would keep running for months. That felt like failure to them. Reframing it as "zero-risk parallel validation" was as important as any line of code I wrote.

Two mental models that matter here:

**The cost of wrong** beats the cost of slow. A big-bang migration that fails corrupts live data, triggers emergency rollbacks, and destroys trust. A phased migration that takes 3x longer ships zero regressions.

**Archaeology before architecture**. You cannot design a migration for a system you haven't mapped. Two weeks of profiling and documentation before writing a line of code saved months of wrong-direction work.

Legacy modernization is 40% technical, 60% trust management.

If you have a system that's too important to break and too outdated to maintain — that's exactly the engagement I specialize in.
