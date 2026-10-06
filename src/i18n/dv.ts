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
    headline: 'ހަނދާން ކުރަން ފަސޭހަ، ހަނދާން ނައްތާލަން އުނދަގޫ.',
    browseButton: 'ނަންބަރުތައް ބައްލަވާ',
    availableCountSuffix: (_count) => ` ނަންބަރު އެބަހުރި`,
  },
  header: {
    homeAria: 'Salhi Numbers — މައި ސަފުހާ',
    cartAria: (count) => `ކާޓް، ${count} އައިޓަމް`,
  },
  search: {
    placeholder: 'ނަންބަރެއް ހޯއްދަވާ…',
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
    sortNumberAsc: 'ނަންބަރު: ކުޑައިން ބޮޑަށް',
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
    errorTitle: 'ނަންބަރުތައް ލޯޑް ނުވި',
    errorDescription: 'އިންޓަނެޓް ކަނެކްޝަން ޗެކްކުރައްވާފައި، އަލުން މަސައްކަތްކުރައްވާ.',
    retry: 'އަލުން މަސައްކަތްކުރޭ',
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
    emptyTitle: 'މިވަގުތު ކާޓުގައި އެއްވެސް ނަންބަރެއް ނެތް!',
    emptyDescription: 'ލިބެންހުރި ނަންބަރުތައް ބައްލަވާ، ބޭނުންވާ ނަންބަރެއް ކާޓައްލާ',
    browseNumbers: 'ނަންބަރުތައް ބައްލަވާ',
    title: 'ކާޓު',
    countAria: (count) => `ކާޓުގައި ${count} ނަންބަރު`,
    removeAria: (number) => `${number} ކާޓުން ނަގާ`,
    total: 'ޖުމްލަ',
    continueToOrder: 'އޯޑަރަށް ކުރިއަށްދޭ',
  },
  // The clauses below are the shop owner's own Dhivehi text, supplied for this
  // purpose — not a translation made here. They are binding, so they say what
  // the owner wants them to say, and nothing was adjusted for fit or tone. The
  // English in en.ts is the counterpart; the two have to change together.
  //
  // blockedHint is the owner's wording too. Only the two labels on the control
  // itself (agree / agreed) were written here, and they are the one part of
  // this block that is not owner-supplied.
  dhiraaguTerms: {
    title: 'ޝަރުޠުތަކާއި އުޞޫލުތައް',
    points: [
      'ތިޔަފަރާތުން ދިރާގު ‘މައި އެކައުންޓް’ ގައި ރަޖިސްޓްރީ ވެލާފައި ވާނަމަ، ބައްލަވައިގަންނަ ނަންބަރުގެ މިލްކުވެރިކަން ވަގުތުން ބަދަލުކޮށްދެވޭނެއެވެ.',
      'ކަސްޓަމަރުގެ ފަރާތުން ދިމާވާ ސަބަބަކާ ހުރެ ނަންބަރުގެ މިލްކުވެރިކަން ބަދަލުކުރުމުގެ މަރުޙަލާ ފުރިހަމަނުވެއްޖެ ނަމަ، އެ ކަން ފުރިހަމަކުރުމަށް 7 ދުވަހުގެ މުއްދަތެއް ދެވޭނެއެވެ.',
      'ދެވިފައިވާ 7 ދުވަހުގެ މުއްދަތުގައި މިލްކުވެރިކަން ބަދަލުކުރުމުގެ ކަންކަން ފުރިހަމަނުކޮށްފި ނަމަ، އެ ނަންބަރު ބާޠިލުކުރެވޭނެއެވެ. އަދި މިފަދަ ޙާލަތްތަކުގައި ފައިސާ އަނބުރާ ނުލިބޭނެއެވެ.',
      'ބާޠިލުކުރެވޭ ނަންބަރުތައް އަލުން ވިއްކުމަށް އަޅުގަނޑުމެންގެ ވެބްސައިޓުގައި ޝާއިޢުކުރުމުގެ އިޚުތިޔާރު ކުންފުންޏަށް ލިބިގެންވެއެވެ.',
      'ނަންބަރެއް ބައްލަވައިގަތުމުން، މި ބަޔާންކުރެވުނު ޝަރުޠުތަކަށް އެއްބަސްވެވުނީ ކަމުގައި ބެލެވޭނެއެވެ.',
    ],
    agree: 'އެއްބަސްވަން',
    agreed: 'ޝަރުޠުތަކަށް އެއްބަސްވެވިއްޖެ.',
    blockedHint: 'ކުރިޔަށް ދިއުމަށް ޝަރުޠުތަކަށް އެއްބަސްވެލައްވާ!',
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
