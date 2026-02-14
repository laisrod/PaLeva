import { useState, useEffect, useCallback, useRef } from 'react'

const DEFAULT_PAGE_SIZE = 12

/**
 * Hook para infinite scroll no cliente.
 * Exibe `pageSize` itens por vez e carrega mais quando o sentinel entra na viewport.
 */
export function useInfiniteScroll<T>(
  items: T[],
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Garantir que items seja sempre um array
  const safeItems = Array.isArray(items) ? items : []
  const displayedItems = safeItems.slice(0, visibleCount)
  const hasMore = visibleCount < safeItems.length

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + pageSize, safeItems.length))
  }, [safeItems.length, pageSize])

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [safeItems.length, pageSize])

  useEffect(() => {
    if (!hasMore) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '100px', threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return {
    displayedItems,
    sentinelRef,
    hasMore,
  }
}
