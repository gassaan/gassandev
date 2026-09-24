# Footer design at Maldivian, RTL and regional South Asian/Gulf news sites (2025-2026)

> **Access status (read first).** This research ran on 2026-09-24 in an environment where outbound access was heavily restricted. **Every target site's homepage was blocked** by the egress proxy, for both direct HTTP (curl, `CONNECT tunnel failed, response 403`) and WebFetch (`EGRESS_BLOCKED`). The blocked sites were sun.mv, mihaaru.com, avas.mv, psmnews.mv, pnc.mv, edition.mv, atolltimes.mv, raajje.mv, dhauru.com, cnm.mv, aljazeera.net, bbc.com, alarabiya.net, thehindu.com, gulfnews.com and dawn.com. The fallbacks were blocked too: **web.archive.org, en.wikipedia.org, t.me, maldivesindependent.com and law-democracy.org**.
>
> Two channels worked:
> 1. **GitHub.** I cloned the BBC's open-source World Service front-end, **Simorgh** (github.com/bbc/simorgh, latest commit 23 Sep 2026). It is the live code behind bbc.com/arabic and bbc.com/urdu, so the BBC Arabic and Urdu findings below are **verified from primary source code** (both the config and the components).
> 2. **WebSearch.** It returns result titles/URLs plus a model-written summary. Facts marked "(search summary)" come from that summary, not from a page I read myself, so treat them as **unverified, second-hand**.
>
> **Nothing about any Maldivian footer was verified directly.** Do not treat any Maldivian footer layout detail as confirmed. Anything not listed here was not found.

## Q1. What does each site's footer contain? (per-site inventory)

### Takeaway
The only footer I could verify in full is BBC Arabic/Urdu, from source code. It is deliberately minimal: a brand logo, then a "Why you can trust BBC News" link on its own row, then 6-7 institutional links (terms, about, privacy, cookies, contact, other languages, and a "Do not share or sell my info" link that stays in English), then a copyright line. All link text is in native script. There are no section lists, no social links, and no newsletter. For the Maldivian sites I found only fragments (copyright strings, contact details, registration facts), not footer layouts.

### Cited Findings

**BBC News Arabic (bbc.com/arabic): VERIFIED from Simorgh source**
- The service is configured with `lang: 'ar'`, `dir: 'rtl'` and brand name `BBC News عربي`. The brand name mixes the Latin "BBC News" with Arabic "عربي" in one string. — [bbc/simorgh arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts)
- The footer has a **trust link** at the top, "لماذا يمكنك الاعتماد على أخبار بي بي سي" ("Why you can rely on BBC News"), which goes to an institutional page. — [arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts)
- The footer link list, verbatim and in order:
  - شروط الاستخدام (Terms of use)
  - عن بي بي سي (About BBC)
  - سياسة الخصوصية (Privacy policy)
  - ملفات الارتباط Cookies. This label mixes Arabic with the Latin word "Cookies".
  - اتصل بـ بي بي سي (Contact BBC)
  - بي بي سي نيوز عربي في لغات أخرى (BBC News Arabic in other languages)
  - "Do not share or sell my info". This stays in **English** and is marked `lang: 'en-GB'`.
  
  Source: [arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts)
- The copyright text is `بي بي سي. بي بي سي ليست مسؤولة عن محتوى المواقع الخارجية.` ("BBC. The BBC is not responsible for the content of external sites."). It is followed by an inline link, "سياستنا بخصوص الروابط الخارجية." ("Our policy on external links"). — [arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts)
- In the render, the "©" symbol sits in its own `<span lang="en-GB">`, then the current year (`new Date().getFullYear()`, so it updates itself), then the localized copyright text. The Latin symbol is isolated with a language tag and the rest is native script. — [Footer/index.tsx](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/index.tsx)
- The "Do not share or sell my info" link only renders when ads are shown for the user's location (`showAdsBasedOnLocation`), and only when JavaScript is enabled. It opens a consent-manager modal. — [Footer/index.tsx](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/index.tsx)
- The footer container is `<footer role="contentinfo" lang={serviceLang}>`. It renders the **brand logo (BrandContainer) first**, then the links. The footer does not render inside the BBC apps (`if (isApp ...) return null`). It uses `content-visibility: auto` for performance. — [legacy/containers/Footer/index.jsx](https://github.com/bbc/simorgh/blob/latest/src/app/legacy/containers/Footer/index.jsx)
- Visual: dark background (`palette.EBON`), white text, thin dividers (`palette.SHADOW`) between the trust link, the list and the copyright line. Content is held to a max width equal to the 1008px breakpoint and centred. — [Footer/index.styles.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/index.styles.ts)
- There are **no** social icons, section/category lists, newsletter, app promo, address, phone or back-to-top link in the footer config or component. — [arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts), [Footer/index.tsx](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/index.tsx)

**BBC News Urdu (bbc.com/urdu): VERIFIED from Simorgh source**
- Same structure as Arabic: `lang: 'ur'`, `dir: 'rtl'`, brand `BBC News اردو`.
- Trust link: "جانیے کہ آپ بی بی سی پر کیوں اعتماد کر سکتے ہیں" ("Find out why you can trust the BBC").
- Links: استعمال کے ضوابط (Terms of use), بی بی سی کے بارے میں (About the BBC), پرائیویسی پالیسی (Privacy policy), کوکیز (Cookies), بی بی سی سے رابطہ کریں (Contact the BBC), بی بی سی نیوز دیگر زبانوں میں (BBC News in other languages), and "Do not share or sell my info" in English.
- Copyright text: "بی بی سی. بی بی سی بیرونی ویب سائٹس کے مواد کا ذمہ دار نہیں" ("BBC. The BBC is not responsible for the content of external websites").
- Unlike the Arabic "ملفات الارتباط Cookies", Urdu writes "Cookies" as a transliteration (کوکیز) with no Latin text.

  Source: [bbc/simorgh urdu.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/urdu.ts)

**PSM News (psmnews.mv), state broadcaster: search summary only, NOT verified**
- Copyright line: "© 2026 PSM News. Public Service Media. All rights reserved" (search summary). — [PSM News](https://psmnews.mv/)
- Address shown: "Public Service Media Radio Building, Ameenee Magu Male', 20331, Republic of Maldives" (search summary). This includes a postcode. — [PSM News](https://psmnews.mv/); [psm.mv/company](https://psm.mv/company)
- PSM is state-owned, founded 28 April 2015, with headquarters on Ameenee Magu. Its brands include PSM News, Yes TV, Television Maldives and radio stations (search summary). These are likely candidates for a "sister brands" strip. — [Public Service Media (Maldives), Wikipedia](https://en.wikipedia.org/wiki/Public_Service_Media_(Maldives))
- The copyright/address strings appear to be in English. I could not confirm whether the other footer links are in Dhivehi or English.

**Mihaaru (mihaaru.com): search summary only, NOT verified**
- Copyright line: "Copyright © 2026 Mihaaru. All rights reserved." (search summary). This is English/Latin, and the year is current. — [Mihaaru register page](https://mihaaru.com/register); [accounts.mihaaru.com/register](https://accounts.mihaaru.com/register)
- Pages that exist (likely footer targets): `/contact` ("Contact us"), `/us` ("US | Mihaaru", probably about/team), `/info/privacy-policy` (titled "Mihaaru - The most trusted news source in the Maldives", which is its tagline), and a job/"Mihaaru Connect" subdomain (connect.mihaaru.com). — [mihaaru.com/contact](https://mihaaru.com/contact); [mihaaru.com/us](https://mihaaru.com/us); [privacy policy](https://mihaaru.com/info/privacy-policy); [Mihaaru Connect](https://connect.mihaaru.com/8576)
- Tagline: "The most trusted news source in the Maldives" (page title). — [mihaaru.com/info/privacy-policy](https://mihaaru.com/info/privacy-policy)
- Mihaaru has user accounts and registration (accounts.mihaaru.com). — [accounts.mihaaru.com/register](https://accounts.mihaaru.com/register)
- Mihaaru runs a **Telegram channel** (t.me/mihaarulive, "Mihaaru – Telegram"). — [t.me/s/mihaarulive](https://t.me/s/mihaarulive)
- The English-language sister brand is **The Edition** (edition.mv). It split off from Mihaaru and launched on 15 May 2018 (search summary). The Wikipedia summary names Ismail Naseer as News editor. — [Mihaaru, Wikipedia](https://en.wikipedia.org/wiki/Mihaaru)

**The Edition (edition.mv): NOT verified**
- It is the English sister of Mihaaru, with Instagram @edition.mv and Facebook @editionmv (search results). No footer content was retrieved. — [Instagram](https://www.instagram.com/edition.mv/); [Facebook](https://www.facebook.com/editionmv/)

**Avas (avas.mv): search summary only, NOT verified**
- Avas Online was registered with the Ministry of Home Affairs on 6 November 2014 as an online platform (search summary of the about page). This kind of registration fact is what Maldivian outlets publish on their "About" page. — [About Us - Avas.mv](https://avas.mv/page/about)
- It has an about page (`/page/about`), an English section (`/en/news`, `/en/maldives-media`), X account @avasmv and a LinkedIn company page. Its homepage title tagline is "Avas.mv - Maldives news leader". — [avas.mv](https://avas.mv/); [X @avasmv](https://x.com/avasmv?lang=en); [LinkedIn](https://mv.linkedin.com/company/avasmv)

**Sun (sun.mv): search results only, NOT verified**
- Sun Media Group (formed 2011) calls itself the largest independent media group. It runs a TV station, radio, a magazine, a travel/tourism magazine, and local and international news websites (search summary of a ZoomInfo/en.sun.mv page). These are candidates for a sister-brand strip. — [Sun Media Group | SunOnline International](https://en.sun.mv/sun_media_group); [ZoomInfo](https://www.zoominfo.com/c/sun-media-group/445518337)
- Old article titles carry the prefix "SunOnline:". The site uses the subdomains en.sun.mv (English) and s1.sun.mv. — [sun.mv/12299](https://sun.mv/12299); [s1.sun.mv/221802](https://s1.sun.mv/221802)
- A search summary says sun.mv is the news site of Sun Siyam TV. That summary sits next to an unrelated Wikipedia result, so treat it as unconfirmed. — [Sun Siyam TV, Wikipedia](https://en.wikipedia.org/wiki/Sun_Siyam_TV)

**Raajje TV (raajje.mv): search summary only, NOT verified**
- Copyright line: "Copyright © 2010-2025 Raajje Television Pvt Ltd". It uses a year range and the legal company name. — [raajje.mv/category/news](https://raajje.mv/category/news)
- It lists **separate newsroom and marketing contacts**: newsroom phone +960 7770670, a newsroom email and a marketing email (both emails hidden by Cloudflare email obfuscation in the snippet), plus +960 300-7771 and info@raajjetv.tv (search summary). — [raajje.mv](https://raajje.mv/local/english)
- The site has an English section (`/local/english`). — [Raajje.mv: Local](https://raajje.mv/local/english)

**Dhauru (dhauru.com): search summary only, NOT verified (details come from Facebook, not the site footer)**
- Site title pattern: "Dhauru - Maldives news, photos, videos, podcasts and more". It has a podcast category. — [dhauru.com/category/news](https://dhauru.com/category/news)
- Contact details from Facebook: news@dhauru.com, H. Hulhugali, Male, +960 769-2020. Social accounts: Facebook (dhaurulive / DhauruNews), X @Dhaurunews, Issuu (digital print editions). — [Facebook](https://www.facebook.com/dhaurulive/); [X](https://x.com/Dhaurunews); [Issuu](https://issuu.com/dhauru)

**Atoll Times, CNM, PNC: nothing retrieved**
- Atoll Times describes itself as "a digital news platform that offers curated, comprehensive news and original reporting on Maldives and beyond" (search summary of the homepage). No footer details. — [Atoll Times](https://atolltimes.mv/)
- CNM and PNC: no footer data. Both domains are blocked, and searches returned nothing useful.

**Al Jazeera Arabic, Al Arabiya: nothing retrieved about footers**
- Al Jazeera's parent-network site is network.aljazeera.net/ar. Aljazeera.net opened in January 2001 as the first major Arabic news website (search summary). No footer content was found. — [شبكة الجزيرة الإعلامية](https://network.aljazeera.net/ar)
- Al Arabiya is owned by MBC Group (search summary). No footer content was found. — [Al Arabiya, Wikipedia](https://en.wikipedia.org/wiki/Al_Arabiya)

**Dawn, The Hindu, Gulf News: fragments only**
- Dawn publishes a standalone **Code of Ethics** page at dawn.com/code-of-ethics/. It is a likely footer link, but I could not confirm where it is placed. — [Code of Ethics - DAWN.COM](https://www.dawn.com/code-of-ethics/)
- Gulf News is published by Al Nisr Publishing LLC. It has "About Gulf News" sub-pages (services, terms and conditions, history) under /about-gulf-news/. — [Gulf News T&C](https://gulfnews.com/about-gulf-news/term-conditions); [History](https://gulfnews.com/about-gulf-news/history-gulfnews); [Services](https://gulfnews.com/about-gulf-news/our-services)
- The Hindu (THG Publishing Pvt Ltd): nothing retrieved about its footer.

### Inferences
- **Maldivian copyright lines seem to be written in English/Latin**, e.g. "Copyright © 2026 Mihaaru. All rights reserved.", "© 2026 PSM News. Public Service Media. All rights reserved", "Copyright © 2010-2025 Raajje Television Pvt Ltd". This rests on three sites and search summaries only. It suggests Dhivehi sites mix Thaana link text with a Latin legal line. Hulhangu could follow this, or localise the line in Thaana and isolate "©" and the year the way BBC does.
- **Separate newsroom and marketing contacts** (Raajje) and the use of **Telegram** (Mihaaru) are Maldivian patterns worth showing in a Hulhangu footer. I did not verify whether they sit in the footer itself or on a contact page.
- **Sister-brand strips** are plausible for Mihaaru (The Edition), Sun (TV, radio, magazines, en.sun.mv) and PSM (TVM, Yes TV, radio), since each is a multi-brand group. I did not verify this for any of them.
- BBC's pattern of a trust/"why trust us" link above a short legal row fits well with a new outlet that needs credibility. It maps onto an editorial-policy / code-of-ethics link for Hulhangu.

### Gaps
- None of the Maldivian footers (Sun, Mihaaru, Avas, PSM/PNC, Edition, Atoll Times, Raajje, Dhauru, CNM) could be read directly or through an archive. I could not confirm column structure, logo placement, section lists, app badges (App Store / Google Play), social icon sets, Viber use, editor-in-chief names, or whether links are in Thaana or English.
- There is no data on Al Jazeera Arabic, Al Arabiya, The Hindu, Gulf News or Dawn footer contents or layouts, because all were blocked.
- **Viber:** no source confirmed any Maldivian outlet linking a Viber community or channel in its footer. Searches found only Avas articles *about* Viber scams, not a Viber channel link. Telegram is confirmed for Mihaaru only.
- WhatsApp Channels: not confirmed for any site.

## Q2. How are footers laid out in RTL (column order, alignment, logo, mixed Latin/Arabic/Thaana text)?

### Takeaway
BBC Arabic and Urdu handle RTL by setting `dir="rtl"` on the service. Their footer is a CSS grid with `grid-auto-flow: column` that fills items column by column, so an RTL document flows the link columns right to left. The logo comes first, on the start edge. Latin fragments are wrapped individually with `lang="en-GB"`: the "©" symbol and the English "Do not share or sell my info" link. Mixed-script labels such as "ملفات الارتباط Cookies" are left inline. I could not verify any Maldivian or other Arabic site's RTL layout.

### Cited Findings
- Services set `dir: 'rtl'` in config, and the `<footer>` element gets `lang={serviceLang}` (for example `ar`, `ur`). — [arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts); [legacy Footer container](https://github.com/bbc/simorgh/blob/latest/src/app/legacy/containers/Footer/index.jsx)
- The link list is a `<ul role="list">` using `display: grid; grid-auto-flow: column` (with a CSS `column-count` fallback). The number of rows is calculated from the item count, so links fill down each column and then move to the next. Under `dir=rtl`, grid columns start from the right. — [Footer/List/index.styles.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/List/index.styles.ts)
- The trust link spans every column (`gridColumn: '1/-1'`, `columnSpan: 'all'`) and sits as its own row above the grid, with a bottom border. — [Footer/List/index.styles.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/List/index.styles.ts)
- Latin/bidi handling:
  - The "©" is rendered as `<span lang="en-GB">©</span>` followed by the year and the native-script text.
  - The English consent link carries `lang: 'en-GB'`.
  - Arabic keeps the Latin word "Cookies" inline in the label "ملفات الارتباط Cookies".
  - The brand name "BBC News عربي" mixes both scripts.

  Sources: [Footer/index.tsx](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/index.tsx); [arabic.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/arabic.ts)
- The brand logo SVG in the footer is sized between 16px and 24px tall (`svgMinHeight = 16`, `svgMaxHeight = 24`), so it is small. — [legacy/containers/Brand/index.jsx](https://github.com/bbc/simorgh/blob/latest/src/app/legacy/containers/Brand/index.jsx)

### Inferences
- A logical-order grid (not floats) keeps the column order correct in RTL with no extra code. For Hulhangu's Thaana footer, use CSS grid/flex with logical properties and `dir="rtl"` on `<html>`. Wrap Latin runs (©, year, emails, phone numbers, "Viber"/"Telegram" labels) in `<span lang="en" dir="ltr">` or `<bdi>` so phone numbers such as "+960 …" and emails do not reorder.
- Tagging the footer's language explicitly (`lang="dv"` for Hulhangu) helps screen readers and font selection for Thaana.

### Gaps
- There is no evidence on where Maldivian sites place the logo (right/start vs centre), how many columns they use, or whether they use Thaana or Latin numerals in dates and phone numbers.
- There is no data on the Al Jazeera or Al Arabiya RTL footer layout.

## Q3. How does the footer adapt on mobile?

### Takeaway
BBC Arabic/Urdu use a stepped grid: 1 column below 240px, 2 columns at 240-599px, 3 at 600-1007px, 4 at 1008-1279px and 5 at 1280px and up. The trust link always spans the full width, the side padding tightens on the smallest screens, and the footer is hidden entirely inside the BBC apps. I have no mobile data for the other sites.

### Cited Findings
- The list switches to `grid-auto-flow: row` with one column below 240px (GROUP_0). It uses 2 columns at 240-599px (GROUP_1+2), 3 at 600-1007px (GROUP_3), 4 at 1008-1279px (GROUP_4) and 5 from 1280px (GROUP_5). — [Footer/List/index.styles.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/List/index.styles.ts); [ThemeProvider/mediaQueries.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/ThemeProvider/mediaQueries.ts)
- An optional "extra links" list collapses to a single column below 600px. — [Footer/List/index.styles.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/List/index.styles.ts)
- The wrapper uses the DOUBLE spacing unit for side padding, dropping to FULL at 399px and below. `contain-intrinsic-size` is set per breakpoint (for example 33.125rem on the smallest screens and 17.188rem on wide ones), which reflects that the footer gets much taller on mobile. — [Footer/index.styles.ts](https://github.com/bbc/simorgh/blob/latest/src/app/components/Footer/index.styles.ts); [legacy Footer container](https://github.com/bbc/simorgh/blob/latest/src/app/legacy/containers/Footer/index.jsx)
- The footer does not render in the in-app webview (`isApp`). — [legacy Footer container](https://github.com/bbc/simorgh/blob/latest/src/app/legacy/containers/Footer/index.jsx)

### Inferences
- A two-column link grid on phones, rather than one long stacked list, is a proven pattern for RTL news footers. It keeps a Thaana footer short on mobile.

### Gaps
- There is no mobile footer data for any Maldivian, Gulf or South Asian site (accordions, collapsed section lists, sticky app banners and so on).

## Q4. What conventions are common across Maldivian sites (registration, hotlines, editor names), and what do the rules require?

### Takeaway
The regulatory picture changed in September 2025. The **Maldives Media Council was dissolved** and replaced by a single **Maldives Media and Broadcasting Commission** under Act No. 16/2025. Outlets must register, and the commission runs a code of ethics. I found no confirmed rule requiring a footer to display a registration number or editor name. From fragments, the observed Maldivian conventions are English copyright lines naming the legal entity, published registration facts on about pages, and separate newsroom and marketing contacts with +960 numbers.

### Cited Findings
- President Muizzu ratified the Maldives Media and Broadcasting Regulation Bill on 18 September 2025. It dissolved the Maldives Media Council and turned the Maldives Broadcasting Commission into the **Maldives Media and Broadcasting Commission**, one regulator for print, broadcast and online media. — [President's Office](https://presidency.gov.mv/Press/Article/34936); [Wikipedia: MMBC](https://en.wikipedia.org/wiki/Maldives_Media_and_Broadcasting_Commission)
- Under Act No. 16/2025, no media outlet may operate without registration. The news media registry moves from the Ministry of Youth Empowerment, Information and Art to the commission, which must publish a complete registry within 45 days. The seven-member commission can act against outlets that breach the law or a commission-set code of ethics (search summary). — [Wikipedia: MMBRA](https://en.wikipedia.org/wiki/Maldives_Media_and_Broadcasting_Regulation_Act); [Maldives Independent explainer](https://maldivesindependent.com/politics/whats-actually-in-the-media-control-act-c7c8)
- An unofficial English translation of the Act and a legal analysis exist from the Centre for Law and Democracy (Oct 2025). I could not read them (blocked). — [CLD translation PDF](https://www.law-democracy.org/wp-content/uploads/2025/10/Maldives.Media_.Sep25.Eng_.pdf); [CLD analysis PDF](https://www.law-democracy.org/wp-content/uploads/2025/10/Maldives.Media-Reg-Bill.Oct25.pdf)
- Editor requirements reported under the new regime: a Maldivian aged 25 or over, with a journalism or related degree and five years' experience at a registered outlet (search summary, source attribution unclear). — [Maldives Independent: MMC](https://maldivesindependent.com/maldives-media-council-mmc)
- Registration facts are published by outlets and reference works. Avas: registered with the Ministry of Home Affairs on 6 November 2014 (about page). Adhadhu: registered with the Ministry of Home Affairs on 22 February 2021. — [Avas About](https://avas.mv/page/about); [Adhadhu, Wikipedia](https://en.wikipedia.org/wiki/Adhadhu)
- Contact convention examples: Raajje lists separate newsroom and marketing contacts on +960 numbers. PSM shows a full street address with the Malé postcode 20331. — [raajje.mv](https://raajje.mv/local/english); [PSM News](https://psmnews.mv/)
- A different Maldivian English outlet, Maldives Today, publishes a dedicated corrections email (corrections@maldivestoday.com). Maldives Independent has an "Editorial Conduct" page. These show that corrections and editorial-policy links do appear in this market. — [Maldives Today About](https://maldivestoday.com/about); [Maldives Independent Editorial Conduct](https://maldivesindependent.com/editorial-conduct)

### Inferences
- Since September 2025, any "registered with the Maldives Media Council" wording is **out of date**. If Hulhangu shows a registration line, it should refer to the Maldives Media and Broadcasting Commission registry, or to the ministry registration if it predates the handover.
- Showing a registration number, the editor-in-chief's name, a corrections/complaints channel and a link to the commission's code of ethics is a low-cost trust signal in the new regulatory climate. I found **no confirmed legal requirement** that these appear in the footer specifically.

### Gaps
- I found no rule text specifying what must be *displayed* on an outlet's website (registration number, editor, address). The Act's translation was unreachable.
- I could not confirm whether any Maldivian site currently shows its registration number, editor-in-chief name, or a hotline/Viber number in the footer. These are commonly assumed conventions but **unverified** here.
- Whether the new commission has issued a code of ethics or a public online registry in 2026 was not researched, for lack of access.
