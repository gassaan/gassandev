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

  // Kept in sync with <html> so :dir()-sensitive CSS and assistive tech agree
  // with the page, not just the components that read this context.
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
    localStorage.setItem(STORAGE_KEY, language)
  }, [language, dir])

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
