import { Link, Navigate, useLocation } from 'react-router-dom'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { useLanguage } from '@/contexts/LanguageContext'

interface ConfirmationState {
  orderRef: string
  whatsappUrl: string
}

export function OrderConfirmation() {
  useDocumentMeta('Order sent — Salhi Numbers')
  const { t } = useLanguage()
  const { state } = useLocation()
  const data = state as ConfirmationState | null

  if (!data?.orderRef) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 pb-16 pt-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lagoon-soft text-lagoon">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink">{t.confirmation.title}</h1>
      <p className="text-muted">{t.confirmation.description}</p>

      <div className="rounded-xl border border-border bg-surface px-5 py-3">
        <p className="text-xs text-muted">{t.confirmation.orderRef}</p>
        <p className="font-numeric text-lg font-semibold text-ink">{data.orderRef}</p>
      </div>

      <a
        href={data.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lagoon text-sm font-semibold text-sand hover:bg-lagoon/90"
      >
        <MessageCircle size={18} />
        {t.confirmation.openWhatsApp}
      </a>

      <Link to="/browse" className="text-sm font-medium text-lagoon hover:underline">
        {t.confirmation.continueBrowsing}
      </Link>
    </div>
  )
}
