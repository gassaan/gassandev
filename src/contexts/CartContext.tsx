import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem } from '@/types'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (msisdn: string) => void
  isInCart: (msisdn: string) => boolean
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'salhi.cart.v1'

function readCart(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.msisdn === item.msisdn) ? prev : [...prev, item]))
  }, [])

  const removeItem = useCallback((msisdn: string) => {
    setItems((prev) => prev.filter((i) => i.msisdn !== msisdn))
  }, [])

  const isInCart = useCallback((msisdn: string) => items.some((i) => i.msisdn === msisdn), [items])

  const clearCart = useCallback(() => setItems([]), [])

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items])
  const count = items.length

  const value = useMemo(
    () => ({ items, addItem, removeItem, isInCart, clearCart, total, count }),
    [items, addItem, removeItem, isInCart, clearCart, total, count],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
