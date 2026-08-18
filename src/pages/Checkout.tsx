import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { dataService } from '@/data'
import { formatCurrency } from '@/utils/format'
import { buildOrderMessage, buildWhatsAppUrl, generateOrderRef } from '@/utils/whatsapp'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Checkout() {
  useDocumentMeta('Checkout — Salhi Numbers')
  const { t } = useLanguage()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: { name?: string; contact?: string } = {}
    if (!name.trim()) next.name = t.checkout.nameError
    if (!/^\d{7}$/.test(contact.trim())) next.contact = t.checkout.contactError
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || items.length === 0) return
    setSubmitting(true)

    const orderRef = generateOrderRef()
    const orderItems = items.map(({ msisdn, provider, category, price }) => ({ msisdn, provider, category, price }))

    dataService
      .createOrder({ orderRef, customerName: name.trim(), customerContact: contact.trim(), items: orderItems, total })
      .catch(() => {
        /* order log write is best-effort; the WhatsApp handoff below is the source of truth */
      })

    const message = buildOrderMessage({ name: name.trim(), contact: contact.trim(), items: orderItems, total, orderRef, t })
    const whatsappUrl = buildWhatsAppUrl(message)
    window.open(whatsappUrl, '_blank')

    clearCart()
    navigate('/order-confirmation', { state: { orderRef, whatsappUrl } })
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-6">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink">{t.checkout.title}</h1>
      <p className="mb-6 text-sm text-muted">{t.checkout.summary(items.length, formatCurrency(total))}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">{t.checkout.nameLabel}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className="h-12 rounded-xl border border-border bg-surface px-4 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
          />
          {errors.name && <span className="text-xs text-danger">{errors.name}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">{t.checkout.contactLabel}</span>
          <div className="flex items-center gap-2">
            <span className="flex h-12 items-center rounded-xl border border-border bg-surface px-3 font-numeric text-base text-muted">
              +960
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={7}
              value={contact}
              onChange={(e) => setContact(e.target.value.replace(/\D/g, '').slice(0, 7))}
              autoComplete="tel-national"
              placeholder={t.checkout.contactPlaceholder}
              aria-invalid={Boolean(errors.contact)}
              className="h-12 flex-1 rounded-xl border border-border bg-surface px-4 font-numeric text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
            />
          </div>
          {errors.contact && <span className="text-xs text-danger">{errors.contact}</span>}
        </label>

        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-lagoon text-sm font-semibold text-sand hover:bg-lagoon/90 disabled:opacity-60"
        >
          {t.checkout.submit}
        </button>
      </form>
    </div>
  )
}
