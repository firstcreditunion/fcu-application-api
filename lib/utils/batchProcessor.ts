/**
 * Process items in parallel batches with controlled concurrency
 *
 * @param items - Array of items to process
 * @param batchSize - Number of items to process concurrently
 * @param processor - Async function to process each item
 * @returns Object with successful results and failed items
 */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<{
  successful: R[]
  failed: Array<{ item: T; error: unknown }>
}> {
  const successful: R[] = []
  const failed: Array<{ item: T; error: unknown }> = []
  const totalBatches = Math.ceil(items.length / batchSize)

  // Process items in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const currentBatch = Math.floor(i / batchSize) + 1

    console.log(
      `[BatchProcessor] Processing batch ${currentBatch}/${totalBatches} (${batch.length} items)`
    )

    // Process batch in parallel using Promise.allSettled
    const results = await Promise.allSettled(
      batch.map((item) => processor(item))
    )

    // Separate successes from failures
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value)
      } else {
        failed.push({
          item: batch[index],
          error: result.reason,
        })
        console.error(`[BatchProcessor] Failed to process item:`, result.reason)
      }
    })

    // Add small delay between batches to avoid overwhelming the API
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  console.log(
    `[BatchProcessor] Completed: ${successful.length} successful, ${failed.length} failed`
  )

  return { successful, failed }
}

/**
 * Chunk an array into smaller arrays of specified size
 *
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
