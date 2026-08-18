export interface Translations {
  /** Label for the *other* language, shown on the toggle button. */
  languageToggleLabel: string
  home: {
    headline: string
    browseButton: string
    availableCount: (count: number) => string
  }
  header: {
    homeAria: string
    cartAria: (count: number) => string
  }
  search: {
    placeholder: string
    ariaLabel: string
    clearAria: string
  }
  filters: {
    all: string
    filtersAndSort: string
    filtersAndSortActive: (count: number) => string
    grade: string
    allGrades: string
    priceRange: string
    min: string
    max: string
    sort: string
    sortPriceAsc: string
    sortPriceDesc: string
    sortNewest: string
    resetFilters: string
  }
  browse: {
    emptyTitle: string
    emptyDescription: string
    clearFilters: string
    resultsCount: (count: number) => string
    loadMore: string
  }
  numberCard: {
    reserved: string
    save: (percent: number) => string
    copyAria: (number: string) => string
    copied: string
    inCart: string
    add: string
    addAria: (number: string) => string
    addedToast: (number: string) => string
  }
  cart: {
    emptyTitle: string
    emptyDescription: string
    browseNumbers: string
    heading: (count: number) => string
    removeAria: (number: string) => string
    total: string
    continueToOrder: string
  }
  checkout: {
    title: string
    summary: (count: number, total: string) => string
    nameLabel: string
    nameError: string
    contactLabel: string
    contactPlaceholder: string
    contactError: string
    submit: string
  }
  confirmation: {
    title: string
    description: string
    orderRef: string
    openWhatsApp: string
    continueBrowsing: string
  }
  tiers: {
    silver: string
    gold: string
    platinum: string
  }
  whatsapp: {
    heading: string
    name: string
    contact: string
    numbers: string
    total: string
    orderRef: string
  }
}
