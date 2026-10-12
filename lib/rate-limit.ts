
/**
 * Minimal in-memory rate limiter (per server instance).
 * Suitable for local development and single-instance deployments.
 * For multi-instance production, use a shared rate-limit store.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically remove expired buckets when another request arrives.
let lastCleanupAt = 0;
const CLEANUP_INTERVAL_MS = 60_000;

function cleanupExpiredBuckets(now: number): void {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;

  lastCleanupAt = now;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  {
    max = 5,
    windowMs = 10 * 60 * 1000,
  }: { max?: number; windowMs?: number } = {},
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  cleanupExpiredBuckets(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((bucket.resetAt - now) / 1000),
      ),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client IP extraction behind a trusted proxy. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
