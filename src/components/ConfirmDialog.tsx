import { Modal } from '@/components/Modal'

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onClose,
}: {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-5 text-sm text-muted">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 items-center rounded-full border border-border px-4 text-sm font-semibold text-ink hover:bg-lagoon-soft"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`flex h-11 items-center rounded-full px-4 text-sm font-semibold text-sand ${
            danger ? 'bg-danger hover:bg-danger/90' : 'bg-lagoon hover:bg-lagoon/90'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
