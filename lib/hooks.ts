import { useState, useEffect } from 'react'

/**
 * Generic localStorage hook with type safety
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue] as const
}

/**
 * Hook for managing bookmarks/favorites with Set
 * @param storageKey - Storage key
 * @returns [bookmarks, toggleBookmark, hasBookmark]
 */
export function useBookmarks(storageKey: string) {
  const [bookmarks, setBookmarks] = useState<Set<string | number>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        setBookmarks(new Set(JSON.parse(saved)))
      }
    } catch (error) {
      console.error(`Error reading bookmarks from "${storageKey}":`, error)
    }
  }, [storageKey])

  const toggleBookmark = (id: string | number) => {
    setBookmarks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(Array.from(newSet)))
      } catch (error) {
        console.error(`Error saving bookmarks to "${storageKey}":`, error)
      }
      
      return newSet
    })
  }

  const hasBookmark = (id: string | number) => bookmarks.has(id)

  return { bookmarks, toggleBookmark, hasBookmark }
}

/**
 * Hook for managing search/filter state
 * @param initialQuery - Initial search query
 * @returns [query, setQuery, clearQuery]
 */
export function useSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery)

  const clearQuery = () => setQuery('')

  return { query, setQuery, clearQuery }
}

/**
 * Hook for debounced value (useful for search inputs)
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for managing tab state with loading transition
 * @param initialTab - Initial active tab
 * @param transitionDelay - Delay for loading animation (ms)
 * @returns { activeTab, isLoading, changeTab }
 */
export function useTabState<T extends string>(
  initialTab: T,
  transitionDelay: number = 200
) {
  const [activeTab, setActiveTab] = useState<T>(initialTab)
  const [isLoading, setIsLoading] = useState(false)

  const changeTab = (tab: T) => {
    if (tab === activeTab) return

    setIsLoading(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsLoading(false)
    }, transitionDelay)
  }

  return { activeTab, isLoading, changeTab }
}
