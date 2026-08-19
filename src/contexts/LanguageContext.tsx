import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from '@/i18n/en'
import { dv } from '@/i18n/dv'
import type { Translations } from '@/i18n/types'

export type Language = 'en' | 'dv'

interface LanguageContextValue {
  language: Language
  toggleLanguage: () => void
  dir: 'ltr' | 'rtl'
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)
const STORAGE_KEY = 'salhi.lang.v1'
const DICTS: Record<Language, Translations> = { en, dv }

function readLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'dv' ? 'dv' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readLanguage)
  const dir: 'ltr' | 'rtl' = language === 'dv' ? 'rtl' : 'ltr'

  // Deliberately does NOT sync <html lang>/<html dir> here — this provider is
  // mounted outside the router (main.tsx), so it has no route information,
  // and Tailwind's rtl: variant matches any descendant of html[dir=rtl]
  // regardless of a nearer dir="ltr" override in between. Forcing English/LTR
  // on an admin subtree would not stop rtl: utilities from still applying
  // there. <DirectionSync> in App.tsx owns the DOM sync instead, since it can
  // see both this language state and the current route, and keeps admin
  // pinned to English/LTR no matter what the customer-facing toggle is set to.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      toggleLanguage: () => setLanguage((l) => (l === 'en' ? 'dv' : 'en')),
      dir,
      t: DICTS[language],
    }),
    [language, dir],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
