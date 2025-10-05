# Sovereign Applications Sync System

## Overview

This document describes the implementation of an automated synchronization system that fetches application data from the OCC (Sovereign) API and stores it in Supabase. The system uses Vercel Cron Jobs to run periodic syncs and implements batched parallel processing for optimal performance.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
- [Database Schema](#database-schema)
- [Batch Processing Strategy](#batch-processing-strategy)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Architecture

### High-Level Flow

```
┌─────────────────┐
│  Vercel Cron    │
│  (Every 5 min)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  /api/cron/sync-applications                        │
│  - Authenticates request                            │
│  - Determines sync date (last successful or default)│
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  syncApplicationsSince()                            │
│  - Creates sync log entry                           │
│  - Fetches changed application IDs                  │
│  - Processes in batches                             │
│  - Upserts to Supabase                              │
│  - Updates sync log                                 │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  OCC API (AWS Lambda)                               │
│  - fetchApplicationsSinceData()                     │
│  - fetchMediumApplicationData()                     │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Supabase Database                                  │
│  - tblSovereignApplications (main data)             │
│  - tblSovereignApplicationsSyncLog (audit trail)    │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

- **Runtime**: Next.js 14+ (App Router)
- **Serverless**: Vercel Edge Functions
- **Database**: Supabase (PostgreSQL)
- **External API**: OCC API (AWS Lambda)
- **Scheduling**: Vercel Cron Jobs

---

## Components

### 1. Batch Processor (`lib/utils/batchProcessor.ts`)

A reusable utility for processing large arrays with controlled concurrency.

**Key Functions:**

- `processBatch<T, R>()` - Processes items in parallel batches
- `chunkArray<T>()` - Splits arrays into smaller chunks

**Features:**

- Configurable batch size for concurrent processing
- Promise.allSettled() for fault tolerance
- Separates successful from failed operations
- Built-in delay between batches to avoid rate limits

**Usage Example:**

```typescript
const { successful, failed } = await processBatch(
  items,
  15, // Process 15 items concurrently
  async (item) => await processItem(item)
)
```

### 2. OCC API Client (`lib/occ/applications.ts`)

Server actions for interacting with the Sovereign OCC API via AWS Lambda.

**Functions:**

#### `fetchApplicationsSinceData(changedDateSince: string)`

Fetches a list of application IDs that have changed since a given date.

- **Input**: Date string in `YYYY-MM-DD` format
- **Output**: `ApplicationDateSince[]` containing IDs and last saved timestamps
- **Lambda Function**: Uses `LAMBDA_FUNCTION_APPLICATIONS_BY_DATE`

#### `fetchMediumApplicationData(applicationExternalNumber: string)`

Fetches detailed application data for a specific application.

- **Input**: Application external number (G3 ID)
- **Output**: `ApplicationMedium` with full application details
- **Lambda Function**: Uses `LAMBDA_FUNCTION_APPLICTION_MEDIUM`

### 3. Sync Orchestrator (`lib/occ/syncApplications.ts`)

The main synchronization logic that coordinates the entire process.

**Functions:**

#### `syncApplicationsSince(sinceDate: string)`

Main sync function that orchestrates the entire process.

**Process:**

1. Creates sync log entry in database
2. Fetches list of changed applications from OCC API
3. Processes applications in batches of 15 concurrent requests
4. Transforms data to Supabase format
5. Upserts data in chunks of 100 records
6. Updates sync log with results

**Returns:**

```typescript
{
  success: boolean
  message: string
  syncLogId?: string
  stats: {
    applicationsFound: number
    applicationsFetched: number
    applicationsUpserted: number
    fetchFailures: number
    upsertFailures: number
  }
  errors?: Array<{ id: string; error: string }>
}
```

#### `getLastSyncDate()`

Retrieves the date of the last successful sync from the database.

- **Returns**: `string | null` (YYYY-MM-DD format)
- **Logic**: Queries `tblSovereignApplicationsSyncLog` for last completed sync

### 4. Supabase Operations (`lib/supabase/loan-application/insert.ts`)

Database operations for upserting application data.

**Functions:**

#### `upsertSovereignApplication(data)`

Upserts a single application record.

- **Conflict Resolution**: Uses `G3_application_number` as unique key
- **Returns**: Inserted/updated record

#### `bulkUpsertSovereignApplications(applications[])`

Bulk upserts multiple application records efficiently.

- **Batch Size**: Recommended 100 records per call
- **Conflict Resolution**: ON CONFLICT DO UPDATE
- **Returns**: Success status and count of upserted records

**Why UPSERT over DELETE+INSERT?**

- ✅ **Atomic Operation**: Single transaction
- ✅ **Performance**: No need to delete before inserting
- ✅ **Data Integrity**: Preserves foreign key relationships
- ✅ **Safer**: Less risk of data loss
- ✅ **Concurrent-Safe**: Handles race conditions better

### 5. Cron Endpoint (`app/api/cron/sync-applications/route.ts`)

Vercel Cron Job endpoint that triggers the sync process.

**Configuration:**

- **Method**: GET
- **Path**: `/api/cron/sync-applications`
- **Timeout**: 300 seconds (5 minutes)
- **Schedule**: Every 5 minutes (`*/5 * * * *`)

**Security:**

- Requires `Authorization: Bearer ${CRON_SECRET}` header
- Returns 401 if unauthorized

**Query Parameters:**

- `since` (optional): Override sync date (YYYY-MM-DD format)

**Response:**

```typescript
{
  success: boolean
  message: string
  fetched: number
  fetchFailed: number
  upserted: number
  upsertFailed: number
  duration: string
  timestamp: string
  errors?: Array<{ id: string; error: string }>
}
```

---

## Database Schema

### Main Tables

#### `tblSovereignApplications`

Stores application data from the Sovereign system.

```sql
CREATE TABLE tblSovereignApplications (
  G3_application_number TEXT PRIMARY KEY,
  applicationInternalNumber TEXT,
  applicationName TEXT,
  clientApplication TEXT,
  loadedByClientNumber TEXT,
  owner TEXT,
  applicationTitle TEXT,
  tradingBranch TEXT,
  salesChannel TEXT,
  subPrime TEXT,
  comparisonRatesSupplied TEXT,
  paymentMethod TEXT,
  type TEXT,
  appStatusDesc TEXT,
  appStatusCode TEXT,
  currentTaskWith TEXT,
  lastSavedDateTime TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**

```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX idx_sovereign_apps_g3_number
  ON tblSovereignApplications(G3_application_number);

-- Query performance indexes
CREATE INDEX idx_sovereign_apps_status
  ON tblSovereignApplications(appStatusCode);

CREATE INDEX idx_sovereign_apps_last_saved
  ON tblSovereignApplications(lastSavedDateTime DESC);

CREATE INDEX idx_sovereign_apps_trading_branch
  ON tblSovereignApplications(tradingBranch);

CREATE INDEX idx_sovereign_apps_created
  ON tblSovereignApplications(created_at DESC);
```

#### `tblSovereignApplicationsSyncLog`

Audit trail and monitoring for sync operations.

```sql
CREATE TABLE tblSovereignApplicationsSyncLog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  since_date DATE NOT NULL,
  sync_started_at TIMESTAMPTZ DEFAULT NOW(),
  sync_completed_at TIMESTAMPTZ,
  applications_found INTEGER DEFAULT 0,
  applications_fetched INTEGER DEFAULT 0,
  applications_upserted INTEGER DEFAULT 0,
  fetch_failures INTEGER DEFAULT 0,
  upsert_failures INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('running', 'completed', 'failed')),
  error_details JSONB
);
```

**Indexes:**

```sql
-- Query performance indexes
CREATE INDEX idx_sync_log_status
  ON tblSovereignApplicationsSyncLog(status);

CREATE INDEX idx_sync_log_started
  ON tblSovereignApplicationsSyncLog(sync_started_at DESC);

CREATE INDEX idx_sync_log_since_date
  ON tblSovereignApplicationsSyncLog(since_date DESC);
```

### Row Level Security (RLS)

Both tables should have RLS policies configured based on your security requirements:

```sql
-- Example RLS policy (adjust based on your needs)
ALTER TABLE tblSovereignApplications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tblSovereignApplicationsSyncLog ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
CREATE POLICY "Service role has full access"
  ON tblSovereignApplications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

---

## Batch Processing Strategy

### Why Batch Processing?

The OCC API can return thousands of applications. Processing them sequentially would be:

- ❌ **Slow**: Each API call takes ~1-2 seconds
- ❌ **Inefficient**: Only uses a fraction of available resources
- ❌ **Unreliable**: Likely to hit Vercel's 5-minute timeout

### Our Approach

#### 1. Parallel Fetch (Batch Size: 15)

```
Applications: [A1, A2, A3, ..., A45]

Batch 1: [A1, A2, ..., A15] → Process in parallel → Results
Batch 2: [A16, A17, ..., A30] → Process in parallel → Results
Batch 3: [A31, A32, ..., A45] → Process in parallel → Results
```

**Why 15 concurrent requests?**

- Balance between speed and resource usage
- Avoids overwhelming the Lambda functions
- Stays within typical rate limits
- Each batch waits 100ms before starting next

#### 2. Bulk Upsert (Chunk Size: 100)

```
Transformed Data: [R1, R2, R3, ..., R250]

Chunk 1: [R1, R2, ..., R100] → Single UPSERT query
Chunk 2: [R101, R102, ..., R200] → Single UPSERT query
Chunk 3: [R201, R202, ..., R250] → Single UPSERT query
```

**Why chunk size of 100?**

- PostgreSQL handles this efficiently
- Reduces number of database round trips
- Keeps transaction size manageable
- Balances between atomicity and performance

### Performance Metrics

For 1000 applications:

**Sequential Processing (Old):**

- Fetch: ~1000 seconds (16.7 minutes) ❌
- Insert: ~1000 queries
- Total: > 16 minutes

**Batch Processing (New):**

- Fetch: ~67 batches × 2 seconds = ~134 seconds (2.2 minutes) ✅
- Insert: ~10 bulk queries
- Total: ~2.5 minutes ✅

**Improvement: ~85% faster**

---

## Configuration

### Environment Variables

Add these to your `.env.local` (development) and Vercel Environment Variables (production):

```bash
# Cron Job Security
CRON_SECRET="your-secure-random-string-here"

# OCC API Configuration
LAMBDA_FUNCTION_APPLICATIONS_MAIN_PROD="your-production-lambda-arn"
LAMBDA_FUNCTION_APPLICATIONS_MAIN_TEST="your-test-lambda-arn"
LAMBDA_FUNCTION_APPLICATIONS_BY_DATE="your-by-date-lambda-function-name"
LAMBDA_FUNCTION_APPLICTION_MEDIUM="your-medium-lambda-function-name"
SOV_AWS_CLIENT_NUMBER="your-client-number"

# AWS Credentials (for Lambda invocation)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Vercel Cron Configuration

The `vercel.json` file configures the cron schedule:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-applications",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Cron Syntax:**

- `*/5 * * * *` = Every 5 minutes
- `0 * * * *` = Every hour at minute 0
- `0 0 * * *` = Every day at midnight
- `0 0 * * 0` = Every Sunday at midnight

**Important:** Cron jobs only work on Vercel Pro or higher plans.

---

## Deployment

### Prerequisites

1. ✅ Vercel account with Pro plan or higher
2. ✅ Supabase project with tables created
3. ✅ AWS Lambda functions deployed
4. ✅ Environment variables configured

### Deployment Steps

#### 1. Database Setup

Run these migrations in your Supabase SQL Editor:

```sql
-- Create main table
CREATE TABLE IF NOT EXISTS tblSovereignApplications (
  -- (see schema above)
);

-- Create sync log table
CREATE TABLE IF NOT EXISTS tblSovereignApplicationsSyncLog (
  -- (see schema above)
);

-- Create indexes
-- (see indexes above)

-- Enable RLS
-- (see RLS policies above)
```

#### 2. Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Select appropriate environments (Production, Preview, Development)

#### 3. Deploy to Vercel

```bash
# Option 1: Deploy from CLI
vercel --prod

# Option 2: Push to main branch (auto-deploy)
git push origin main
```

#### 4. Generate CRON_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32
```

Add this to Vercel Environment Variables as `CRON_SECRET`.

#### 5. Verify Cron Job

1. Go to Vercel Dashboard → Deployments
2. Click on your deployment → Functions tab
3. You should see the cron function listed
4. Check logs after 5 minutes to verify first run

---

## Monitoring

### Checking Sync Status

#### Query Recent Syncs

```sql
SELECT
  id,
  since_date,
  sync_started_at,
  sync_completed_at,
  applications_found,
  applications_upserted,
  status,
  EXTRACT(EPOCH FROM (sync_completed_at - sync_started_at)) as duration_seconds
FROM tblSovereignApplicationsSyncLog
ORDER BY sync_started_at DESC
LIMIT 10;
```

#### Query Failed Syncs

```sql
SELECT
  id,
  since_date,
  sync_started_at,
  error_details,
  applications_found,
  fetch_failures,
  upsert_failures
FROM tblSovereignApplicationsSyncLog
WHERE status = 'failed'
ORDER BY sync_started_at DESC;
```

#### Query Application Statistics

```sql
SELECT
  COUNT(*) as total_applications,
  COUNT(DISTINCT appStatusCode) as unique_statuses,
  MAX(lastSavedDateTime) as latest_update,
  MIN(created_at) as first_sync
FROM tblSovereignApplications;
```

### Vercel Logs

View real-time logs in Vercel Dashboard:

1. Go to your project
2. Click on "Logs" tab
3. Filter by function: `/api/cron/sync-applications`

### Log Messages

Key log messages to look for:

```
✅ [Cron] Starting sync job...
✅ [Cron] Using last sync date: 2025-01-15
✅ [syncApplicationsSince] Found 50 changed applications
✅ [syncApplicationsSince] Fetched 48 applications, 2 failed
✅ [syncApplicationsSince] Upserting chunk 1/1 (48 records)
✅ [syncApplicationsSince] Sync completed successfully
✅ [Cron] Sync completed in 12.45s
```

---

## Troubleshooting

### Common Issues

#### 1. 401 Unauthorized Error

**Symptom:** Cron job returns 401
**Cause:** Missing or incorrect `CRON_SECRET`
**Solution:**

```bash
# Verify CRON_SECRET is set in Vercel
vercel env ls

# Add if missing
vercel env add CRON_SECRET
```

#### 2. Timeout Errors

**Symptom:** Function times out after 5 minutes
**Cause:** Too many applications to process
**Solution:**

- Reduce batch size in `syncApplications.ts`
- Increase Vercel timeout (Pro plan: up to 300s)
- Consider splitting into multiple smaller syncs

#### 3. Lambda Connection Errors

**Symptom:** "Empty response from Lambda function"
**Cause:** AWS credentials or Lambda configuration issue
**Solution:**

- Verify AWS credentials in environment variables
- Check Lambda function names are correct
- Verify Lambda has correct permissions
- Check CloudWatch logs for Lambda errors

#### 4. Database Connection Errors

**Symptom:** "Failed to create sync log"
**Cause:** Supabase connection issue
**Solution:**

- Verify Supabase URL and keys
- Check RLS policies allow service role access
- Verify tables exist in correct schema

#### 5. Duplicate Key Errors

**Symptom:** "duplicate key value violates unique constraint"
**Cause:** Race condition or schema mismatch
**Solution:**

- Verify `G3_application_number` is unique in source data
- Check UPSERT logic is using correct conflict key
- Ensure `ON CONFLICT` clause is present

### Manual Sync Trigger

You can manually trigger a sync with a specific date:

```bash
# Using curl
curl -X GET "https://your-app.vercel.app/api/cron/sync-applications?since=2025-06-01" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Or using Vercel CLI
vercel logs --follow
# Then trigger from browser or Postman
```

### Resetting Sync State

If you need to re-sync all data:

```sql
-- Clear all sync logs
DELETE FROM tblSovereignApplicationsSyncLog;

-- Optional: Clear all application data
-- DELETE FROM tblSovereignApplications;
```

Next sync will start from default date (7 days ago).

---

## Best Practices

### 1. Monitoring

- ✅ Set up alerts for failed syncs
- ✅ Monitor sync duration trends
- ✅ Track error rates
- ✅ Review sync logs weekly

### 2. Performance

- ✅ Keep batch size between 10-20 for API calls
- ✅ Keep chunk size around 100 for database operations
- ✅ Monitor and adjust based on actual performance

### 3. Data Integrity

- ✅ Always use UPSERT instead of DELETE+INSERT
- ✅ Keep sync logs for audit trail
- ✅ Never delete data without backup
- ✅ Validate data transformation logic

### 4. Security

- ✅ Rotate CRON_SECRET periodically
- ✅ Use service role key only in server-side code
- ✅ Enable RLS on all tables
- ✅ Monitor unauthorized access attempts

### 5. Error Handling

- ✅ Log all errors with context
- ✅ Implement retry logic for transient errors
- ✅ Separate successful from failed operations
- ✅ Never fail entire sync for single record error

---

## Future Enhancements

### Potential Improvements

1. **Incremental Sync Optimization**
   - Track individual application sync status
   - Only re-fetch failed applications
   - Implement exponential backoff for retries

2. **Real-time Sync**
   - Add webhook support for immediate updates
   - Implement event-driven architecture
   - Reduce reliance on polling

3. **Admin Dashboard**
   - Build UI for monitoring sync status
   - Manual sync trigger interface
   - Visual charts for sync statistics

4. **Data Validation**
   - Add schema validation before upsert
   - Implement data quality checks
   - Alert on data anomalies

5. **Performance Optimization**
   - Implement connection pooling
   - Add caching layer for frequently accessed data
   - Optimize database indexes based on query patterns

---

## API Reference

### Types

#### `ApplicationDateSince`

```typescript
interface ApplicationDateSince {
  type: string
  id: string // G3 application number
  attributes: {
    lastSavedDateTime: string // ISO 8601 format
  }
  links: {
    self: string
  }
}
```

#### `ApplicationMedium`

```typescript
interface ApplicationMedium {
  type: string
  id: string // G3 application number
  attributes: {
    applicationInternalNumber: string
    applicationName: string
    clientApplication: string
    loadedByClientNumber: string
    owner: string
    applicationTitle: string
    tradingBranch: string
    salesChannel: string
    subPrime: string
    comparisonRatesSupplied: string
    paymentMethod: string
    type: string
    appStatusDesc: string
    appStatusCode: string
    currentTaskWith: string
    lastSavedDateTime: string
  }
  relationships: {
    originator: RelationshipApplicationMedium
    associatedClients: RelationshipApplicationMedium
  }
}
```

#### `SyncResult`

```typescript
interface SyncResult {
  success: boolean
  message: string
  syncLogId?: string
  stats: {
    applicationsFound: number
    applicationsFetched: number
    applicationsUpserted: number
    fetchFailures: number
    upsertFailures: number
  }
  errors?: Array<{ id: string; error: string }>
}
```

---

## Support

For issues or questions:

1. Check this documentation
2. Review Vercel logs
3. Check Supabase logs
4. Review AWS CloudWatch logs (for Lambda issues)
5. Contact your team's DevOps support

---

## Changelog

### Version 1.0.0 (Initial Release)

- ✅ Automated sync every 5 minutes
- ✅ Batch processing for performance
- ✅ UPSERT strategy for data integrity
- ✅ Comprehensive logging and monitoring
- ✅ Database indexes for query performance
- ✅ Error handling and fault tolerance

---

## License

[Your License Here]

---

**Last Updated:** October 2025  
**Author:** FCU Development Team
