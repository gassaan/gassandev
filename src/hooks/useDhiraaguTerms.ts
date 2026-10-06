import { useCallback, useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

/**
 * The Dhiraagu ownership-transfer terms, and whether the customer has accepted
 * them for the cart as it currently stands.
 *
 * Lives in a hook rather than in the Cart page because the gate has to hold in
 * two places: the cart renders the panel and blocks its own button, and
 * checkout turns away anyone who arrived by typing the URL. A flag kept in the
 * cart page's own state would only guard the button.
 *
 * sessionStorage, not localStorage: consent should not outlive the browsing
 * session that gave it. Every access is wrapped — Safari's private mode throws
 * on access rather than returning null, and a storage failure must leave the
 * gate closed rather than take the page down.
 */
const KEY = 'salhi.dhiraaguTermsAgreed'

function read(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function write(value: boolean) {
  try {
    if (value) sessionStorage.setItem(KEY, '1')
    else sessionStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: the in-memory state below still gates this session */
  }
}

export function useDhiraaguTerms() {
  const { items } = useCart()
  // Only Dhiraagu numbers carry the transfer process these terms describe, so
  // an Ooredoo-only cart is never asked to accept them.
  const required = items.some((item) => item.provider === 'dhiraagu')
  const [agreed, setAgreed] = useState(read)

  // Emptying the cart of Dhiraagu numbers withdraws the acceptance: adding one
  // again is a fresh purchase and should ask again, rather than inheriting a
  // click the customer made about different stock.
  useEffect(() => {
    if (!required && agreed) {
      setAgreed(false)
      write(false)
    }
  }, [required, agreed])

  const accept = useCallback(() => {
    setAgreed(true)
    write(true)
  }, [])

  return { required, agreed, accept, blocked: required && !agreed }
}
