import type { Translations } from '@/i18n/types'

// Dhivehi (Thaana script, right-to-left). Translated for the shop's customer-
// facing flow — home, browse, cart, checkout, confirmation, and the WhatsApp
// order message. The admin panel stays English, since only the shop owner
// uses it.
export const dv: Translations = {
  languageToggleLabel: 'English',
  formatPrice: (amount) => `${amount} ރުފިޔާ`,
  providers: {
    dhiraagu: 'ދިރާގު',
    ooredoo: 'އުރީދޫ',
  },
  home: {
    headline: 'ބައެއް ނަންބަރުތަކަކީ ހާއްސަ ނަންބަރުތަކެކެވެ.',
    browseButton: 'ނަންބަރުތައް ބައްލަވާ',
    availableCount: (count) => `${count} ނަންބަރު ލިބެން އެބަހުރި`,
  },
  header: {
    homeAria: 'Salhi Numbers — މައި ސަފުހާ',
    cartAria: (count) => `ކާޓް، ${count} އައިޓަމް`,
  },
  search: {
    placeholder: 'ނަންބަރެއް ހޯއްދަވާ… މިސާލު: 7777',
    ariaLabel: 'ފޯނު ނަންބަރު ހޯދާ',
    clearAria: 'ހޯދުން ސާފުކުރޭ',
  },
  filters: {
    all: 'ހުރިހާ',
    filtersAndSort: 'ފިލްޓަރު އަދި ތަރުތީބު',
    filtersAndSortActive: (count) => `ފިލްޓަރު އަދި ތަރުތީބު، ${count} ފިލްޓަރު ބޭނުންކޮށްފައި`,
    grade: 'ފެންވަރު',
    allGrades: 'ހުރިހާ ފެންވަރެއް',
    priceRange: 'އަގުގެ ރޭންޖު',
    min: 'އެންމެ ކުޑަ (ރުފިޔާ)',
    max: 'އެންމެ ބޮޑު (ރުފިޔާ)',
    sort: 'ތަރުތީބުކުރޭ',
    sortPriceAsc: 'އަގު: ދަށުން މައްޗަށް',
    sortPriceDesc: 'އަގު: މަތިން ދަށަށް',
    sortNewest: 'އެންމެ އަލަށް',
    resetFilters: 'ފިލްޓަރުތައް ރީސެޓްކުރޭ',
  },
  browse: {
    emptyTitle: 'މި ހޯދުމާ ދިމާވާ ނަންބަރެއް ނެތް',
    emptyDescription: 'މަދު ޑިޖިޓް ބޭނުންކުރައްވާ، ނުވަތަ ފިލްޓަރުތައް ސާފުކުރައްވާ.',
    clearFilters: 'ފިލްޓަރުތައް ސާފުކުރައްވާ',
    resultsCount: (count) => `${count} ނަންބަރު ފެނިއްޖެ`,
    loadMore: 'އިތުރަށް ދައްކާ',
  },
  numberCard: {
    reserved: 'ރިޒަރވްކޮށްފައި',
    save: (percent) => `${percent}% ޑިސްކައުންޓް`,
    copyAria: (number) => `ނަންބަރު ކޮޕީކުރޭ ${number}`,
    copied: 'ކޮޕީވެއްޖެ',
    inCart: 'ކާޓުގައި',
    add: 'ކާޓަށްލާ',
    addAria: (number) => `${number} ކާޓަށް އިތުރުކުރޭ`,
    addedToast: (number) => `${number} ކާޓަށް އިތުރުކުރެވިއްޖެ`,
  },
  cart: {
    emptyTitle: 'ކާޓު ހުހެވެ',
    emptyDescription: 'ލިބެންހުރި ނަންބަރުތައް ބައްލަވާ، ބޭނުންވާ ނަންބަރު އިތުރުކުރައްވާ.',
    browseNumbers: 'ނަންބަރުތައް ބައްލަވާ',
    heading: (count) => `ކާޓު (${count})`,
    removeAria: (number) => `${number} ކާޓުން ނަގާ`,
    total: 'ޖުމްލަ',
    continueToOrder: 'އޯޑަރަށް ކުރިއަށްދޭ',
  },
  checkout: {
    title: 'އޯޑަރު ފުރިހަމަކުރުން',
    summary: (count, total) => `${count} ނަންބަރު · ${total} ރުފިޔާ`,
    nameLabel: 'ނަން',
    nameError: 'ތިޔަބޭފުޅާގެ ނަން ޖައްސަވާ.',
    contactLabel: 'ގުޅޭނެ ނަންބަރު',
    contactPlaceholder: '7771234',
    contactError: '7 ޑިޖިޓުގެ ނަންބަރެއް ޖައްސަވާ.',
    submit: 'ވަޓްސްއެޕުން އޯޑަރު ފޮނުވާ',
  },
  confirmation: {
    title: 'އޯޑަރު ފޮނުވިއްޖެ',
    description: 'ތިޔަބޭފުޅާގެ އޯޑަރުގެ ތަފްސީލާއެކު ވަޓްސްއެޕް ހުޅުވިއްޖެ. ނުހުޅުވިއްޖެނަމަ، ތިރީގައިވާ ބަޓަނަށް ފިއްތަވާ.',
    orderRef: 'އޯޑަރު ނަންބަރު',
    openWhatsApp: 'ވަޓްސްއެޕް ހުޅުވާ',
    continueBrowsing: 'ނަންބަރުތައް ބެލުން ކުރިއަށްދޭ',
  },
  tiers: {
    silver: 'ރިހި',
    gold: 'ރަން',
    platinum: 'ޕްލެޓިނަމް',
  },
  whatsapp: {
    heading: 'އައު އޯޑަރު',
    name: 'ނަން',
    contact: 'ގުޅޭނެ ނަންބަރު',
    numbers: 'ނަންބަރުތައް',
    total: 'ޖުމްލަ',
    orderRef: 'އޯޑަރު ނަންބަރު',
  },
}
