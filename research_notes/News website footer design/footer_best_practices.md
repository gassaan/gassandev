# Website Footer Best Practices for a News/Publisher Site (UX, Mobile, Accessibility, Trust, SEO, Legal, Engagement)

Source-access note (read first): this environment's egress proxy blocked direct fetches of nngroup.com, thetrustproject.org, schema.org, support.google.com, w3.org and design-system.service.gov.uk. How each source was read:
- **Read in full (primary text, through GitHub source repos on raw.githubusercontent.com):** W3C WCAG 2.2 "Understanding" docs (w3c/wcag repo), W3C ARIA Authoring Practices landmark examples (w3c/aria-practices), MDN `<footer>` and `contentinfo` pages (mdn/content), the GOV.UK Design System footer page (alphagov/govuk-design-system), and schema.org's vocabulary definitions (schemaorg/schemaorg `data/schema.ttl`). The citations below link to the canonical public URLs for these pages.
- **Search snippets only (full page not read):** NN/g, Baymard, The Trust Project, JTI, IFCN, Google Search Central and the Google News Publisher Center, W3C Internationalization, and the Reuters Institute. Claims from these carry less certainty because the surrounding text wasn't visible.
- **Not consulted:** BBC GEL (not reached).

---

## 1. UX research: what footers are for, fat vs minimal footers, sitemap footers, what users look for

### Takeaway
UX research treats the footer as a "safety net" and a place where users expect to find utility and corporate information: contact, about, policies and legal links. Big "fat" or sitemap footers help on long pages but have to stay scannable. Stuffing every link into the footer is a known anti-pattern, and hiding the footer (for example, collapsing all of it) is discouraged.

### Cited Findings
- NN/g has a dedicated article, "Web Page Footers 101: Design Patterns and When to Use Each", and a video titled "Footers are Underrated". Their existence is confirmed by search listings, but I couldn't read the article text or confirm its date. It is probably pre-2023, so treat it as older. — [NN/g Footers 101](https://www.nngroup.com/articles/footers/); [NN/g video](https://www.nngroup.com/videos/footers/)
- Snippets attributed to NN/g: footers act as a "safety net" for users who reach the end of a page without finding what they needed. In NN/g usability studies, "users often turn to page footers for important information and tasks". — [NN/g Footers video / search summary](https://www.nngroup.com/videos/footers/) (snippet-level; secondary summaries such as [Eleken](https://www.eleken.co/blog-posts/footer-ux) repeat it)
- NN/g (intranet/IA articles): "Fat footers can greatly increase usability for people who arrive at the end of a page without finding what they want", **but** "some sites stuff every link known to humankind into page bottoms, which is bad for users when the link collection is so big that it's impossible to scan quickly." — [NN/g (search snippet, IA/intranet articles)](https://www.nngroup.com/articles/ia-vs-navigation/)
- NN/g on mobile accordions / footers (snippet): "While the footer is not the primary navigation, people still use it and rely upon it, so don't try to hide it" (said about sites that hide the footer behind an animation or accordion for aesthetic reasons). — [NN/g Footers 101 via search](https://www.nngroup.com/articles/footers/)
- Named patterns in NN/g and pattern libraries: "doormat" navigation, where the top navigation is repeated at the bottom (useful on long pages and when the header isn't sticky), and the "sitemap footer" / "fat footer", a structured set of links that mirrors the IA. — [NN/g Footers 101 (search summary)](https://www.nngroup.com/articles/footers/); [Designing Interfaces: Sitemap Footer](http://designinginterfaces.com/patterns/sitemap-footer/) (older, around 2010s); [IxDF sitemap footers](https://ixdf.org/literature/article/how-to-implement-sitemap-footers-to-keep-users-going)
- Baymard (e-commerce, qualitative testing): "a subgroup of users will consistently look in the footer" for specific utility info (shipping/returns). 20% of benchmarked sites lacked a simple text link to it in the footer. This is e-commerce evidence that users look up utility and policy information in the footer by convention. — [Baymard: footer needs return/shipping links](https://baymard.com/blog/footer-needs-return-shipping-links) (snippet; article date not verified)
- An older academic paper (2013) on footers in website design exists. — [IACIS 2013](https://iacis.org/iis/2013/271_iis_2013_182-185.pdf) (older, not read)
- GOV.UK Design System: use the footer "at the bottom of every page". The footer carries the copyright notice, licensing, and links to Privacy, Accessibility (statement), Cookies, Terms and conditions, and help. It recommends these exact short link labels: "Privacy", "Accessibility", "Cookies", "Terms and conditions". Secondary navigation in the footer is optional, and GOV.UK advises against it where you don't want users to leave a linear task. (The component was updated in June 2025 for the brand refresh.) — [GOV.UK Design System: Footer](https://design-system.service.gov.uk/components/footer/)

### Inferences
- For a small news site, a "moderate" sitemap footer fits: the sections (latest, popular, reports, stories, gallery, graphics, polls) and the six categories as grouped columns, plus a utility and trust strip. A news homepage is long and scroll-heavy, which is the case where NN/g says fat footers help. The link count should stay small enough to scan at a glance (roughly 20–30 links across 3–5 labeled groups). This number is a design judgment, not a researched threshold.
- Don't hide the footer behind infinite scroll. If a section uses infinite scroll, the footer can't be reached. That's a common reason to use "load more" buttons on listing pages instead. (This is an inference from NN/g's "don't hide it"; I didn't find a source for the infinite-scroll point.)

### Gaps
- I couldn't read NN/g's full "Footers 101" text, its publication date, or any quantitative footer engagement data (click-through rates, percentage of users who reach the footer). I found no reliable 2023–2026 statistic on footer usage. The claim that "Chartbeat and NN/g show users spend more time at the bottom of a page" appeared only in a secondary snippet with no verifiable source, so it is excluded as a fact.
- I found no Baymard research specific to news sites. Baymard's footer research is e-commerce.

---

## 2. Mobile: accordion vs stacked vs trimmed, tap targets, back-to-top, sticky elements

### Takeaway
On mobile, accordions save space but add interaction cost and can disorient users. The footer shouldn't be hidden, and the essential trust and contact links should stay visible without extra taps. Tap targets need to be at least 24×24 CSS px (WCAG 2.2 AA), with 44×44 as the AAA/best-practice size. Back-to-top helps only on pages longer than about 4 screens. Sticky footers and bars must not cover focused elements (WCAG 2.4.11).

### Cited Findings
- NN/g: on mobile, accordions "often solve the problem of displaying too much content in too little screen space" but "can also cause disorientation and too much scrolling". Auto-scrolling an expanded accordion to the top can make users think they navigated to a new page and press Back. — [NN/g: Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/) (snippet; older article, date not verified)
- Baymard (checkout context): collapsed accordion states that show only headings forced users to reopen them, adding friction, and "on mobile sites this process will be even more arduous, as users must avoid mistaps." — [Baymard: accordion checkout](https://baymard.com/blog/accordion-checkout-usability) (snippet; checkout context, not footer)
- A real-world mobile footer accordion issue is documented in the US Web Design System: "Accordion in mobile footer can only be expanded". USWDS uses a collapsible mobile footer pattern. — [USWDS GitHub issue #1857](https://github.com/uswds/uswds/issues/1857) (older; title only)
- **WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA:** targets must be "at least 24 by 24 CSS pixels", with exceptions for Spacing (an undersized target passes if a 24px-diameter circle centered on it doesn't intersect other targets or their circles), Equivalent, **Inline** (links inside sentences or constrained by line-height), User-agent, and Essential. The W3C recommends as best practice to meet the minimum size itself and not rely only on spacing. Example: two rows of 16px-high buttons with a 1px gap fail. — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- **WCAG SC 2.5.5 Target Size (Enhanced), Level AAA:** "Make custom targets at least 44 by 44 pixels." — [W3C Understanding 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- **WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum), AA:** "Typical types of content that can overlap focused items are sticky footers, sticky headers, and non-modal dialogs." Author-positioned sticky content "must not prevent the item receiving focus from being immediately visible". A cookie banner "will fail this success criterion if it entirely obscures a component receiving focus". Fixes include making the banner modal or using **scroll padding** so the banner doesn't overlap content. — [W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- NN/g Back-to-Top guidelines: use a Back to Top button "for pages that are longer than 4 screens". On short pages it's overkill. Consider showing it only after users have scrolled several pages **and** signal intent to scroll up. Most users don't know the browser/OS shortcuts for jumping to the top. — [NN/g: Back-to-Top Button Design Guidelines](https://www.nngroup.com/articles/back-to-top/) (snippet; the article is pre-2023, originally around 2016)
- Several government design systems document a back-to-top component (Red Hat, NYC, California, NSW). — [Red Hat DS](https://ux.redhat.com/elements/back-to-top/guidelines/); [NSW DS](https://designsystem.nsw.gov.au/components/back-to-top/index.html) (titles only)

### Inferences
- Recommended mobile pattern: **stack the essentials, collapse the long lists**. Keep the logo/tagline, the trust links (About, Contact, Corrections, Ethics/Policies), social/channel icons and the copyright line always visible. Put the long "Sections" and "Categories" groups into disclosure accordions (`<button aria-expanded>` controlling a list), or trim them to a 2-column grid of short links. This follows NN/g's "don't hide the footer" and keeps help/contact in the same place on every page for WCAG 3.2.6 (Consistent Help).
- Vertical lists of footer links should use about 44px row height (or at least 24px plus spacing) to avoid mistaps. Inline links in the copyright sentence fall under the 2.5.8 "Inline" exception, but stand-alone utility links in a row don't.
- A back-to-top control is justified on long news homepages and long serialized-story pages. It isn't needed on short pages. If it floats, it counts as sticky content and must not cover focused elements (use `scroll-padding-bottom`). In an RTL layout, a floating back-to-top button conventionally goes in the bottom-left corner, mirroring the LTR bottom-right position. This mirroring is my inference; I found no source that states it.
- Avoid a permanently sticky footer bar on mobile. It uses scarce vertical space and creates 2.4.11 risk.

### Gaps
- I found no 2023–2026 quantitative study comparing accordion and stacked mobile footers on news sites.
- I couldn't verify how the BBC GEL or major publishers handle mobile footers (no access).

---

## 3. Accessibility: WCAG 2.2 / ARIA for footers, landmarks, link text, contrast, focus order, RTL/bidi

### Takeaway
Use a single page-level `<footer>` as a direct child of `<body>`, not nested inside `main`/`article`/`section`, so it maps to the `contentinfo` landmark. Give each `<nav>` inside it a unique label. Keep help/contact links in a consistent position (SC 3.2.6), meet 24px targets, don't let sticky elements hide focus, meet 4.5:1 text contrast, and isolate mixed-direction strings with `dir="auto"` or `<bdi>`.

### Cited Findings
- APG: "The HTML footer element defines a contentinfo landmark when its context is the body element" and "is not considered a contentinfo landmark when it is descendant of" `article`, `aside`, `main`, `nav`, `section`. "Each page may have one contentinfo landmark", it "should be a top-level landmark", and if there's more than one "each should have a unique label". The APG example heading is "Contact, Policies and Legal". — [W3C APG: Contentinfo landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/contentinfo.html)
- MDN: `contentinfo` "defines a footer, containing identifying information such as copyright information, navigation links, and privacy statements, found on every document within a site". Prefer `<footer>` over `role="contentinfo"`. Use only one per page, as an immediate descendant of `<body>`. For **mega-footers**: "Do not nest additional `<footer>` elements or `contentinfo` landmarks inside the document's footer. Use other content sectioning elements instead." Too many landmarks create "noise" in screen readers. — [MDN: ARIA contentinfo role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role)
- MDN `<footer>`: it "typically contains information about the author of the section, copyright data or links to related documents". Author/contact info can go in `<address>`. Before Safari 13, VoiceOver didn't expose the landmark, so add `role="contentinfo"` only if you need to support legacy Safari. — [MDN: footer element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer)
- APG navigation landmark: "If a page includes more than one navigation landmark, each should have a unique label". Pages with identical link sets should share the same label. Label via `aria-labelledby` pointing to a visible heading (for example, `<nav aria-labelledby="nav1"><h2 id="nav1">…`). — [W3C APG: Navigation landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)
- **WCAG 2.2 SC 3.2.6 Consistent Help (A):** if help mechanisms (human contact details, contact form, social channel, FAQ, chatbot) appear on multiple pages, they must be "in the same relative order". Example: "a direct link to a contact page". A smaller viewport may place them differently (user-initiated change exception), but consistent placement both visually and programmatically "is the most usable". — [W3C Understanding 3.2.6](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html). GOV.UK explicitly cites 3.2.6 for help links placed in its footer. — [GOV.UK Footer](https://design-system.service.gov.uk/components/footer/)
- WCAG 1.4.3 Contrast (Minimum) sets a lower contrast requirement for large text (18pt, or 14pt bold) than for normal text. The standard ratios are 4.5:1 for normal text and 3:1 for large text; the ratio lines weren't in my extract, but these are the well-known SC values. — [W3C Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- WCAG 2.4.4 Link Purpose (In Context) is intended "to help users understand the purpose of each link". Avoid bare "More" / "Click here" and unlabeled icon links (social icons need accessible names). — [W3C Understanding 2.4.4](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- W3C i18n: `dir="auto"` makes the browser use the first strong character to set direction. `<bdi>` isolates content and defaults to `dir=auto`. "If unknown text will be injected at run time, then either wrap the phrase in bdi… or… add dir="auto"." RTL scripts commonly contain short LTR runs (Latin, numbers). — [W3C: Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/); [W3C: Strings and bidi](https://w3c.github.io/i18n-drafts/articles/strings-and-bidi/index.en); [W3C: Authoring HTML – RTL scripts](https://www.w3.org/TR/i18n-html-tech-bidi/) (snippets)

### Inferences
- Suggested structure: `<footer>` (direct child of body) → `<h2 class="visually-hidden">` (for example, the Dhivehi equivalent of "Site information") → `<nav aria-labelledby>` for "Sections", another for "Categories", a third for "About/Policies" → `<address>` for contact → social list with `aria-label` on each icon link → `<p><small>© 2026 [Publisher]</small></p>`. Use headings (h2/h3) for column titles, not bold text.
- RTL/Thaana: set `<html lang="dv" dir="rtl">`. Wrap Latin strings in the footer (email addresses, URLs, phone numbers, "WhatsApp", "Viber", handles such as @name) in `<bdi>` or `<span dir="ltr">`, or add `lang="en"` where it's English text. That keeps punctuation and the "@" from reordering, and lets screen readers switch pronunciation. Phone numbers such as "+960 …" are a classic bidi reordering failure without isolation. Mirror the column order (first column on the right) and use logical CSS properties (`margin-inline-start`, `padding-inline`) so one stylesheet works.
- DOM order should equal visual reading order in RTL. With CSS grid/flex in `dir=rtl` this happens naturally. Don't use `order:` or `row-reverse` hacks that break focus order (WCAG 2.4.3).
- Thaana text at small footer sizes (12–13px) is hard to read. Keep footer body text at about 14–16px or larger and check contrast on dark footer backgrounds. (This is a design inference; I found no source on Thaana legibility.)

### Gaps
- I couldn't read the 1.4.3 SC text exactly (only an extract). The 4.5:1 and 3:1 figures come from the well-known SC, not a quote captured here.
- I found no source on screen reader behavior with Thaana specifically (for example, JAWS/NVDA/VoiceOver Dhivehi voice support).

---

## 4. Trust and transparency signals for news (Trust Project, JTI, Google News, IFCN)

### Takeaway
Every major news-trust framework converges on the same set of site-level disclosures: **mission/about, ownership and funding, masthead/staff with contacts, ethics/editorial standards, corrections policy, labeling of opinion/sponsored content, and a real (non-generic) contact method**. The footer is the conventional, persistent place to link them. These frameworks require the disclosures to exist; none that I could read mandates the footer as the location.

### Cited Findings
- The Trust Project's 8 Trust Indicators are described as "the first global transparency standard": policies for honesty, accuracy and fairness, commitments to own up to mistakes, ownership details, journalist expertise, "and more". The indicators found: **Best Practices** (who funds the outlet, mission, commitments to ethics, diverse voices, accuracy, corrections and other standards), **Author/Journalist Expertise**, **Type of Work** (labels for opinion, analysis and sponsored content), **Citations and References**, **Methods**, **Locally Sourced**, **Diverse Voices**, **Actionable Feedback** (public help with coverage priorities, accuracy and so on). — [The Trust Project: Trust Indicators](https://thetrustproject.org/trust-indicators/); [Trust Project home](https://thetrustproject.org/) (snippets; I couldn't read the full indicator text, so exact wording and whether "Methods" is still listed as separate should be verified)
- Survey finding reported by the Trust Project/Santa Clara (2017, older): 63% of participants thought that noting a news org's participation in the Trust Project would increase their trust; 53% said a list of best practices (ethics, diversity, corrections policies) would increase trust. — [Santa Clara University press release, 2017](https://www.scu.edu/news-and-events/press-releases/2017/nov-2017/the-trust-project-helps-readers-identify-reliable-news.html) (older)
- Adoption example: The Texas Tribune joined the Trust Project in December 2023. — [Texas Tribune, 2023](https://www.texastribune.org/2023/12/21/trust-project-texas-tribune-journalism-transparency/)
- JTI: published December 2019 as CEN Workshop Agreement **CWA 17493**. It turns ethics into "concrete transparency and governance requirements" covering "editorial mission, ownership structure, management, sources of revenue and accountability to the public". It has 18 clauses spanning ownership, revenue, correction policies, labeling of opinion/sponsored content and accuracy. Criteria include a code of ethics, evidence of ultimate ownership, "the identities and contacts of executives", and revenue sources. It can be independently audited. — [JTI: the standard](https://journalismtrustinitiative.org/jti-the-standard/); [CEN CWA 17493 PDF](https://www.cencenelec.eu/media/CEN-CENELEC/CWAs/ICT/cwa17493.pdf); [RSF explainer](https://rsf.org/en/journalism-trust-initiative-tout-comprendre-%C3%A0-la-certification-des-m%C3%A9dias-d-information) (snippets; the standard dates from 2019, and I didn't verify whether a newer ISO version exists)
- Google News policies, transparency: at site level Google looks for "a mission statement, editorial policies and standards, staff information and bios, non-generic contact information, and organizational-level information like owners and/or funding sources". At article level it looks for bylines linking to bios, publish dates, and type labels (Opinion/News). Sponsorship "including ownership or affiliate interest, payment, or material support" must be clearly disclosed. Sites that "misrepresent or conceal their ownership or primary purpose" aren't allowed. — [Google News policies (Publisher Center Help)](https://support.google.com/news/publisher-center/answer/6204050?hl=en); [Google Search Central blog: Understanding the sources behind Google News (2021)](https://developers.google.com/search/blog/2021/06/google-news-sources) (snippets; the 2021 blog is older than the requested window, and the policies page is live but I didn't read it directly)
- Google News manual actions labeled "Transparency" exist (community thread about WNC-642400), which suggests missing transparency info can have practical consequences. — [Publisher Center community thread](https://support.google.com/news/publisher-center/thread/126679987/manual-action-wnc-642400-transparency?hl=en) (title/snippet only)
- IFCN Code of Principles (fact-checkers, but relevant to newsroom transparency): transparency of funding and organization (funding sources, funders have no influence, professional backgrounds of key figures, organizational structure and legal status), transparency of methodology, and an "open & honest corrections policy" that is published and followed. — [IFCN Code of Principles: the commitments](https://ifcncodeofprinciples.poynter.org/the-commitments) (snippet)
- Google's "Who, How, and Why" self-assessment asks whether it's self-evident who created the content, whether bylines lead to author information, and whether there is "background about the author or site through links to an author page or About page". — [Google Search Central: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) (snippet)

### Inferences
- A minimum trust block in the footer of a small Maldivian news site: **About us / mission**, **Our team (masthead)** with named editor and contacts, **Ownership & funding**, **Editorial policy / code of ethics**, **Corrections policy + "Report an error"**, **Contact** (a real email, phone and physical address; Google specifically says "non-generic"), and **Advertise / sponsored content policy**. Where relevant, add a line naming the registered publisher/company and its media registration. Whether the Maldives requires registration details on-site is unverified; see Gaps.
- Since the site has serialized fiction with ratings, a **Type of Work** label (fiction vs news) and a footer link explaining the fiction section's status (not journalism) would align with the Trust Project's labeling indicator. This is an extrapolation.
- The site has polls. A short "About our polls" methodology page (unscientific/opt-in disclaimer) matches the Trust Project's "Methods" and IFCN "methodology" transparency. This is an extrapolation.

### Gaps
- I couldn't read the Trust Project pages directly (blocked). The exact current wording of each indicator, and any placement guidance such as "link from footer", is unverified.
- I found no source that *requires* trust links in the footer specifically. The footer placement is convention, backed by NN/g's findings that users look for about, contact and policies there.
- I didn't research Maldives-specific legal requirements (Maldives Media and Broadcasting Commission rules, registration display, data protection law).

---

## 5. SEO: footer links, sitewide links, internal linking, Organization/NewsMediaOrganization structured data

### Takeaway
Footer links are template ("boilerplate") links. Google reportedly gives them little weight compared with contextual in-content links, so footers should serve users and crawl paths, not stuffed keyword anchors. The larger SEO value is (a) linking trust pages sitewide and (b) publishing `NewsMediaOrganization` structured data with `logo`, `sameAs`, `contactPoint` and the publishing-principles properties that point to those same footer-linked pages.

### Cited Findings
- Google's John Mueller has said links in footers or sitewide are not given much weight (reported by SERoundtable). — [SERoundtable: Google says footer/sitewide links not given much weight](https://www.seroundtable.com/google-footer-sitewide-links-weight-21540.html) (older, around 2015–16; secondary). A Google comment that internal link placement "doesn't matter but is measured differently" is also reported. — [SEO This Week](https://seothisweek.com/google-internal-link-placement-doesnt-matter-but-is-measured-differently/) (secondary)
- **Caution:** some SEO blogs claim footer links "pass only 15–20% of the ranking power" of in-content links. I found no primary Google source for this number and treat it as unverified. — [search summary citing SEO blogs, e.g. screamingcat.net](https://screamingcat.net/blog/internal-linking/footer-links-seo-best-practices/)
- Google (Nov 2023) expanded Organization structured data support: name, alternateName, legalName, description, logo, url, sameAs, address, contactPoint (telephone, email), foundingDate, numberOfEmployees, various IDs (VAT, DUNS, LEI and so on). It is used in knowledge panels and attribution. — [Google Search Central blog, Nov 2023](https://developers.google.com/search/blog/2023/11/introducing-organization-markup); [Google: Organization structured data docs](https://developers.google.com/search/docs/appearance/structured-data/organization); [Search Engine Land](https://searchengineland.com/google-search-expands-organization-markup-to-add-name-address-contact-information-and-various-business-identifiers-435151) (snippets)
- schema.org definitions (read from the schema.org source):
  - `publishingPrinciples`: "a document describing the editorial principles of an Organization … that relate to their activities as a publisher, e.g. ethics or diversity policies". It can also be applied to a CreativeWork (for example, NewsArticle). — [schema.org/publishingPrinciples](https://schema.org/publishingPrinciples)
  - `correctionsPolicy` (sub-property of publishingPrinciples): "a statement describing (in news media, the newsroom's) disclosure and correction policy for errors." — [schema.org/correctionsPolicy](https://schema.org/correctionsPolicy)
  - `ethicsPolicy`: for a NewsMediaOrganization, "a statement describing the personal, organizational, and corporate standards of behavior expected by the organization." — [schema.org/ethicsPolicy](https://schema.org/ethicsPolicy)
  - `masthead` (sub-property of publishingPrinciples): "a link to the masthead page or a page listing top editorial management." — [schema.org/masthead](https://schema.org/masthead)
  - `ownershipFundingInfo`: "a description of organizational ownership structure; funding and grants. In a news/media setting, this is with particular reference to editorial independence." — [schema.org/ownershipFundingInfo](https://schema.org/ownershipFundingInfo)
  - Also defined: `actionableFeedbackPolicy` (public engagement in coverage decisions), `diversityPolicy`, `diversityStaffingReport`, `missionCoveragePrioritiesPolicy` (coverage priorities, public agenda or stance), `verificationFactCheckingPolicy`, `unnamedSourcesPolicy`, `noBylinesPolicy` ("when authors of articles are not named in bylines"). — [schema.org: Markup for News](https://schema.org/docs/news.html)
  - The schema.org News page says these best-practice properties were proposed in collaboration with the Trust Project. Search summaries described them as "proposed/pending", which may be out of date; I didn't verify the current pending status. — [schema.org/docs/news.html](https://schema.org/docs/news.html)
- Google's "people-first content" guidance points to bylines, author pages and "About" pages as signals that help users assess trust (E-E-A-T). — [Google Search Central: Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content); [Google blog: E-E-A-T (Dec 2022)](https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t)

### Inferences
- Put one `NewsMediaOrganization` JSON-LD block sitewide (or at least on the homepage and About page) with: `name` (Dhivehi plus `alternateName` in Latin transliteration/English), `url`, `logo`, `sameAs` (Facebook, X, Instagram, YouTube, TikTok, Telegram/WhatsApp channel URLs, Wikipedia/Wikidata if they exist), `contactPoint`, `address`, `foundingDate`, and `publishingPrinciples`/`correctionsPolicy`/`ethicsPolicy`/`masthead`/`ownershipFundingInfo` URLs that match the footer links exactly. Visible footer links and structured data should agree.
- Footer SEO hygiene: plain crawlable `<a href>` links, descriptive Dhivehi anchor text, no keyword-stuffed city/term lists, no `nofollow` on internal policy links. Don't try to "sculpt" with footer links; put the internal linking effort into article bodies and related-story modules.
- Google's Organization docs and Google News both value a stable, specific contact method. A footer `<address>` with email, phone and physical address also serves users (WCAG 3.2.6) and Google News transparency.

### Gaps
- I couldn't read Google's current docs directly to confirm whether Google Search uses the `publishingPrinciples`-family properties for any feature. I found no evidence that it does; they are primarily Trust Project and platform signals.
- I found no primary 2023–2026 Google statement specifically on footer links; the Mueller statements are older.

---

## 6. Legal/compliance basics in footers (privacy, terms, cookies, copyright)

### Takeaway
The standard footer "meta" row is: copyright notice, Privacy, Terms, Cookies (plus a way to reopen cookie settings if a consent tool is used), and Accessibility statement. GOV.UK gives the canonical short labels.

### Cited Findings
- GOV.UK: add a copyright notice "to clarify who owns the copyright", say whether content is available for re-use and under what licence, and link Privacy, Accessibility, Cookies and Terms using those exact short labels. — [GOV.UK Design System: Footer](https://design-system.service.gov.uk/components/footer/)
- MDN's example copyright line uses `<small>`: "Copyright © 2023 Football History Archives. All Rights Reserved." — [MDN: footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer)
- WCAG 2.4.11: cookie banners that are sticky must not fully obscure the focused component. Make them modal or use scroll padding. — [W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

### Inferences
- Copyright format: "© 2026 [Legal publisher name]" (in Dhivehi, with the Latin legal name in `<bdi>` if used). The year can be a range such as "2019–2026" or just the current year. Update it dynamically. "All rights reserved" is conventional but not required.
- If the site sets no non-essential cookies and has no consent manager, a "Cookies" link to a short cookie policy is enough. If a consent tool is used (for example, for ad networks), add a "Cookie settings" button (`<button>`, not a link) in the footer so users can change consent later. This is common CMP practice; I didn't research a specific legal mandate for the Maldives.
- Content-reuse note: a line such as "Reproduction of articles requires permission / credit with link", relevant for Maldivian news where copying is common. Unsourced; a design suggestion only.

### Gaps
- I didn't research Maldivian privacy and data protection law or any legal requirements for cookie consent and imprint (publisher registration) display.
- I found no authoritative 2023–2026 source on copyright-year best practice.

---

## 7. Engagement features in publisher footers (newsletter, apps, social, WhatsApp/Telegram, tips, donations)

### Takeaway
Publishers commonly put follow/channel links, newsletter signup, "tip us / report an error" and support/subscribe calls to action in the footer. Evidence for these is mostly observational. WhatsApp is a significant news platform globally (about 19% weekly use for news per the Reuters Institute DNR 2025), so a WhatsApp/Telegram/Viber channel link is well justified for a Maldivian audience.

### Cited Findings
- Reuters Institute Digital News Report 2025: WhatsApp is used by around 19% of people globally for news. Publishers are investing in personality-led newsletters and podcasts. The survey covered nearly 100,000 people in 48 countries. — [Reuters Institute DNR 2025 executive summary](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025/dnr-executive-summary); [DNR 2025 PDF](https://reutersinstitute.politics.ox.ac.uk/sites/default/files/2025-06/Digital_News-Report_2025.pdf) (snippets). A DNR 2026 edition exists. — [digitalnewsreport.org](https://www.digitalnewsreport.org/) (not read)
- The Trust Project's "Actionable Feedback" indicator and schema.org's `actionableFeedbackPolicy` both describe newsroom mechanisms for the public to contribute to coverage and accuracy. That supports "Send a tip" and "Report an error" links. — [Trust Project indicators](https://thetrustproject.org/trust-indicators/); [schema.org/docs/news.html](https://schema.org/docs/news.html)
- WCAG 3.2.6 lists "social media channel" and "contact form" among help mechanisms that must be in a consistent location if present across pages. — [W3C Understanding 3.2.6](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html)
- Generic footer guidance lists newsletter signup and CTAs as optional footer elements. — [UXPin footer basics](https://www.uxpin.com/studio/blog/footer-design-basics/); [Eleken 2026 footer patterns](https://www.eleken.co/blog-posts/footer-ux) (vendor blogs; lower authority)

### Inferences
- Order of priority for this site's footer engagement row: (1) social/channel icons (Facebook, X, Instagram, YouTube, TikTok, plus WhatsApp/Telegram/Viber channels, whichever the newsroom actually runs) with accessible names; (2) "Send us news / tip" (a WhatsApp or Viber number is common in Maldivian newsrooms; this is an observation I didn't verify); (3) "Report an error" linking to the corrections page or form; (4) an optional newsletter signup only if the site actually sends one (don't ship dead forms); (5) app badges only if native apps exist.
- Keep the engagement row compact. Don't let it push the trust and legal rows out of view on mobile.
- Donation/subscription links are appropriate only if the business model uses them. The Trust Project and JTI would then want funding sources disclosed on the Ownership & Funding page.

### Gaps
- I found no quantitative data on conversion rates for newsletter signups or social follows placed in the footer versus elsewhere.
- I didn't verify Maldives-specific platform usage (Viber vs WhatsApp vs Telegram). The DNR 2025 doesn't appear to cover the Maldives.
