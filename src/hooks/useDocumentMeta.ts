import { useEffect } from 'react'

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    let metaDescription: HTMLMetaElement | null = null
    let prevDescription: string | null = null
    if (description) {
      metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        prevDescription = metaDescription.content
        metaDescription.content = description
      }
    }

    return () => {
      document.title = prevTitle
      if (metaDescription && prevDescription != null) {
        metaDescription.content = prevDescription
      }
    }
  }, [title, description])
}
