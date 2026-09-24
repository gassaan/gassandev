# Footers of major English-language international news websites (2025-2026)

> **How this was verified (read first).** None of the live sites could be fetched from this research environment: bbc.com, cnn.com, theguardian.com, nytimes.com, washingtonpost.com, reuters.com, apnews.com, aljazeera.com, npr.org and economist.com were all blocked or refused by the egress proxy. web.archive.org, archive.ph, r.jina.ai, Common Crawl and Google/Bing caches were blocked too. Web search returned almost nothing useful about footer contents.
>
> What I could reach was GitHub, and that gave me two kinds of evidence:
> 1. **Publisher source code.** The Guardian's footer code is open source (`guardian/dotcom-rendering` and `guardian/frontend`), read from the `main` branch as of Sept 2026. The BBC's Simorgh renderer (`bbc/simorgh`) holds a News-service footer config.
> 2. **Third-party text scrapes of live article pages, converted to Markdown.** These come mainly from the public repo `artur-shlyapnikov/hn-distill`, which scrapes pages linked from Hacker News. Its BBC, CNN, NYT, Reuters, AP, Al Jazeera, Guardian and Economist pages are dated Aug–Nov 2025, going by article content and copyright years. Washington Post scrapes (© 1996-2025) came from `BstWPY/WildGraphBench`. NPR scrapes came from `kibiddd/DECEPT-URL` (undated, post-2022) and `MathildeCh/PPE1_banlieue` (© 2022).
>
> Text scrapes reliably show **which links and labels exist and their order and grouping**. They do **not** show colours, column widths, icons or whether something is an accordion. Visual claims are therefore made only where code or scrape structure supports them. Everything else is listed under Gaps.

## Q1. What does each site's footer contain? (per-site inventory)

### Takeaway
Every site studied ends its pages with a legal/policy row (privacy, terms, cookies, accessibility, copyright). Most also have a "company" group (about, contact, advertise, careers). The sites differ mainly in four ways:
- **Section sitemap:** a big one at CNN, WaPo, Reuters and BBC; none at AP, Al Jazeera and The Economist.
- **Trust and ethics links:** strong at NPR, WaPo, the Guardian, Reuters and AP; absent at CNN and NYT.
- **Sister brands and commercial products:** Reuters/LSEG, Al Jazeera network, Economist Group, CNN Underscored/Games.
- **Reader-revenue asks:** the Guardian's "Support the Guardian" block and NPR's "Support Public Radio".

### Cited Findings

#### BBC (bbc.com, scraped article page, Nov 2025)
- **Footer order:**
  1. BBC logo link ("British Broadcasting Corporation").
  2. A horizontal list of 16 site sections: Home, News, Sport, Business, Innovation, Culture, Arts, Travel, Earth, Audio, Video, Live, Documentaries, Weather, BBC Shop, BritBox.
  3. "BBC in other languages" (a language/World Service switcher).
  4. "Follow BBC on:" (social icons; their labels were not captured as text).
  5. Legal/company links: Terms of Use, Subscription Terms, About the BBC, Privacy Policy, Cookies, Accessibility Help, Contact the BBC, Advertise with us, Do not share or sell my info, BBC.com Help & FAQs, Content Index.
  6. Final line: "Copyright 2025 BBC. All rights reserved. The BBC is not responsible for the content of external sites. **Read about our approach to external linking.**"
  — [hn-distill scrape of bbc.com article](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45841464.md)
- **Subscription Terms link:** "Subscription Terms" sits in the legal row, which is consistent with bbc.com's paid tier for users outside the UK — [same scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45841464.md)
- **Simorgh config (open-source renderer for BBC News/World Service pages):**
  - A dedicated trust link: "Why you can trust the BBC" (to /news/help-41670342).
  - An external-linking note: "Read about our approach to external linking."
  - Links: Terms of Use, About the BBC, Privacy Policy, Cookies, Accessibility Help, Contact the BBC, and "Do not share or sell my info". The last one is a `COOKIE_SETTINGS` button, not a page link.
  - Copyright text: "BBC. The BBC is not responsible for the content of external sites."
  — [bbc/simorgh news.ts](https://github.com/bbc/simorgh/blob/latest/src/app/lib/config/services/news.ts)
  - Note: the bbc.com scrape does not show the "Why you can trust the BBC" link. The two BBC renderers differ.

#### CNN (cnn.com Business article, scraped ~30 Oct 2025)
- **Section header:** the footer starts with the CNN logo plus the current section name ("Business"), links to Watch and Listen, and "Follow CNN Business" with 4 social icons (unlabelled in the scrape) — [hn-distill CNN scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
- **Account block:** Subscribe, Sign in, and My Account (Settings, Newsletters, Topics you follow, Sign out) — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
- **Full two-level sitemap: 21 top-level groups, each with sub-links:**
  - US (Crime + Justice)
  - World (Africa, Americas, Asia, Australia, China, Europe, India, Middle East, United Kingdom)
  - Politics (Trump, Facts First, CNN Polls, 2025 Elections)
  - Business (Tech, Media, Calculators, Videos)
  - Markets (Pre-markets, After-Hours, Fear & Greed, Investing, Markets Now, Nightcap)
  - Health (Life But Better, Fitness, Food, Sleep, Mindfulness, Relationships)
  - CNN Underscored (Electronics, Fashion, Beauty, Health & Fitness, Home, Reviews, Deals, Gifts, Travel, Outdoors, Pets)
  - Entertainment
  - Tech
  - Style
  - Travel
  - Sports
  - Science
  - Climate
  - Weather
  - Ukraine-Russia War
  - Israel-Hamas War
  - Watch (incl. TV Shows A-Z, CNN Max, TV Schedule)
  - Listen (named podcasts + "All CNN Audio podcasts")
  - Games (Daily Crossword, Jumble Crossword, Photo Shuffle, Sudoblock, Sudoku, 5 Things Quiz)
  - About CNN (Subscribe, Photos, Investigations, CNN Profiles, CNN Leadership, CNN Newsletters, Work for CNN)
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
- **Business-page disclaimer:** Business pages add a long market-data attribution paragraph (BATS, FactSet, CME, S&P Dow Jones Indices, etc.) — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
- **Legal row:**
  - Links: Terms of Use, Privacy Policy, [unlabelled icon link], Ad Choices, Accessibility & CC, About, Subscribe, Newsletters, Transcripts, Help Center.
  - Then: "© 2025 Cable News Network. A Warner Bros. Discovery Company. All Rights Reserved. CNN Sans ™ & © 2016 Cable News Network."
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
- **Edition switcher:** "Edition: US / International / Arabic / Español" appears in the page chrome, in the header/menu area of the scrape. I could not confirm that it repeats in the footer — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)

#### The Guardian (theguardian.com; source code as of Sept 2026 plus live scrape Oct 2025)
- **Footer order (from the component code):**
  1. A row of "pillar" links (News / Opinion / Sport / Culture / Lifestyle) repeated from the top nav.
  2. An email-signup block: "Original reporting and incisive analysis, direct from the Guardian every morning" with a button, "Sign up for our email". It links to an edition-specific newsletter (First Edition in UK/INT, US Morning Newsletter, AU Morning Mail).
  3. Three link columns plus a reader-revenue block.
  4. On the AU edition only, an Acknowledgement of Country paragraph.
  5. A "Back to top" button.
  6. The copyright line "© {year} Guardian News & Media Limited or its affiliated companies. All rights reserved."
  — [dotcom-rendering Footer.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/Footer.tsx); [BackToTop.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/BackToTop.tsx)
- **Column 1 (UK edition):** About us, Help, Complaints & corrections, Contact us, Tip us off, SecureDrop, Privacy policy, Cookie policy, Modern Slavery Act, Tax strategy, Terms & conditions — [guardian/frontend FooterLinks.scala](https://github.com/guardian/frontend/blob/main/common/app/navigation/FooterLinks.scala)
- **Column 2:**
  - Links: All topics, All writers, Newsletters, Digital newspaper archive.
  - Social links as plain text: Bluesky, Facebook, Instagram, LinkedIn, Threads, TikTok, YouTube.
  - The social URLs change per edition. AU and US editions have their own accounts.
  - Note: there is no X/Twitter link.
  — [FooterLinks.scala](https://github.com/guardian/frontend/blob/main/common/app/navigation/FooterLinks.scala)
- **Column 3 (UK):** Advertise with us, Guardian Labs (branded content), Search jobs, Patrons, Work with us, Accessibility settings — [FooterLinks.scala](https://github.com/guardian/frontend/blob/main/common/app/navigation/FooterLinks.scala)
- **Edition-specific link lists:** each edition gets its own lists.
  - US drops Modern Slavery Act and Patrons.
  - AU adds "Information".
  - International/Europe use "Search UK jobs" and "Tips".
  — [FooterLinks.scala](https://github.com/guardian/frontend/blob/main/common/app/navigation/FooterLinks.scala)
- **Privacy link:** the privacy link is a consent-manager button. It reads "US resident - Do Not Sell or Share" under the US privacy framework and "Privacy settings" elsewhere — [PrivacySettingsLink.island.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/PrivacySettingsLink.island.tsx)
- **Reader-revenue block:**
  - Heading "Support the Guardian", subline "Available for everyone, funded by readers", and a "Support us →" button.
  - Existing supporters instead see "Thank you" / "Your support powers our independent journalism".
  - It is shown only after client-side country and sign-in checks.
  — [FooterReaderRevenueLinks.island.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/FooterReaderRevenueLinks.island.tsx)
- **Live confirmation (Oct 2025 scrape, apparently US-edition lists):**
  - Content: regional links (World, Europe, US news, Americas, Asia, Australia, Middle East, Africa, Inequality, Global development) plus pillars, the newsletter CTA, the three columns, "Back to top", and "© 2025 Guardian News & Media Limited … (dcr)".
  - The client-side Support block and privacy button did not appear in the text scrape.
  — [hn-distill Guardian scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45655413.md)

#### The New York Times (nytimes.com articles, scraped Oct 2025)
- **Structure:** a "Site Index" heading is present, followed by "Site Information Navigation" — [hn-distill NYT scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45503960.md); [second NYT scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45605921.md)
- **Site-information links, in order:**
  - © 2025 The New York Times Company (the copyright notice is itself a link)
  - NYTCo, Contact Us, Accessibility, Work with us, Advertise, T Brand Studio
  - Privacy Policy, Cookie Policy, Terms of Service, Terms of Sale
  - Site Map, Canada, International (edition links), Help, Subscriptions, Manage Privacy Preferences
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45503960.md)
- **Section columns not captured:** the section columns under "Site Index" did not render in either scrape. They are probably injected client-side or hidden. See Gaps.

#### The Washington Post (washingtonpost.com articles, © 1996-2025 scrape)
- **Desktop variant: five headed groups.**
  - **Company:** About The Post, Newsroom Policies & Standards, WP Creative Group, Diversity & Inclusion, Careers, Media & Community Relations, Accessibility Statement.
  - **Sections (16):** Trending, Politics, Elections, Opinions, National, World, Style, Sports, Business, Climate, Well+Being, D.C., Md., & Va., Obituaries, Weather, Arts & Entertainment, Recipes.
  - **Get The Post (15):** WP Intelligence, Enterprise Subscriptions, Manage Your Subscription, Become a Subscriber, Gift Subscriptions, Mobile & Apps, Newsletters & Alerts, Washington Post Live, Reprints & Permissions, Post Store, Books & E-Books, Print Special Editions Store, Print Archives (Subscribers Only), Today's Paper, Public Notices.
  - **Contact Us:** Contact the Newsroom, Contact Customer Care, Contact the Opinions Team, Advertise, Licensing & Syndication, Request a Correction, Send a News Tip, Report a Vulnerability.
  - **Terms of Use:** Digital Products Terms of Sale, Print Products Terms of Sale, Terms of Service, Privacy Policy, Cookie Settings, Submissions & Discussion Policy, RSS Terms of Service, Sitemap, Ad Choices, CA Notice of Collection, Your Privacy Choices (with the CCPA opt-out icon).
  - Final line: "washingtonpost.com © 1996-2025 The Washington Post".
  — [WildGraphBench WaPo scrape](https://github.com/BstWPY/WildGraphBench/blob/main/corpus/people/Donald%20Trump/reference_pages/Historians%20just%20ranked%20the%20presidents%20Trump%20wasnt%20last.txt)
- **Second (mobile-style) variant in the same page:**
  - Headings "### Company / Sections / Get The Post / Contact Us", each followed by "Chevron Icon".
  - Its Company list differs: WP Intelligence, Ask The Post AI, WP Creative Group, Diversity & Inclusion, Careers, Media & Community Relations, Accessibility Statement.
  - After the groups comes one flat list: Download the Washington Post App, About The Post, Policies & Standards, and then the legal links.
  — [same](https://github.com/BstWPY/WildGraphBench/blob/main/corpus/people/Donald%20Trump/reference_pages/Historians%20just%20ranked%20the%20presidents%20Trump%20wasnt%20last.txt); consistent with [second WaPo scrape](https://github.com/BstWPY/WildGraphBench/blob/main/corpus/people/Donald%20Trump/reference_pages/In%20first%20days%20Trump%20deals%20death%20blow%20to%20DEI%20and%20affirmative%20action.txt)

#### Reuters (reuters.com article, scraped ~30 Oct 2025)
- **"Site Index" footer with headed groups:**
  - **Browse (11):** World, Business, Markets, Sustainability, Legal, Breakingviews, Technology, Investigations, Sports, Science, Lifestyle.
  - **About Reuters (10):** About Reuters, Advertise with Us, Careers, Reuters News Agency, Brand Attribution Guidelines, Reuters and AI, Reuters Leadership, Reuters Fact Check, Reuters Diversity Report, Commercial Disclosure (Japan).
  - **Stay Informed:** Download the App (iOS), Download the App (Android), Newsletters, Subscribe.
  - **Information you can trust:** a short mission paragraph ("Reuters, the news and media division of Thomson Reuters, is the world's largest multimedia news provider…").
  - **Follow Us:** X, Facebook, Instagram, Youtube, Linkedin, WhatsApp.
  - **LSEG Products:** Workspace, Data Catalogue and World-Check, each with a one-sentence description (a cross-sell to the sister data business).
  — [hn-distill Reuters scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45797740.md)
- **Bottom row:**
  - Links: Advertise With Us, Advertising Guidelines, Purchase Licensing Rights, Cookies, Terms & Conditions, Privacy, Digital Accessibility, Corrections, Site Feedback.
  - Then: "All quotes delayed a minimum of 15 minutes. See here for a complete list of exchanges and delays." and "© 2025 Reuters. All rights reserved".
  - Links that open elsewhere carry an explicit ", opens new tab" accessible label.
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45797740.md)

#### Associated Press (apnews.com article, scraped 23 Sept 2025)
- **Opening:** the footer starts with a mission paragraph: "The Associated Press is an independent global news organization dedicated to factual reporting. Founded in 1846, AP today remains the most trusted source… More than half the world's population sees AP journalism every day." — [hn-distill AP scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)
- **Two link groups:**
  - **"The Associated Press":** ap.org, Careers, Advertise with us, Contact Us, Accessibility Statement, Terms of Use, Privacy Policy, Cookie Settings (a button), Do Not Sell or Share My Personal Information, Limit Use and Disclosure of Sensitive Personal Information, CA Notice of Collection.
  - **"More From AP News":** About, AP News Values and Principles, AP's Role in Elections, AP Leads, AP Definitive Source Blog, AP Images Spotlight Blog, AP Stylebook.
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)
- **Closing:** "Copyright 2025 The Associated Press. All Rights Reserved." followed by social icons: twitter, instagram, facebook. There is no section sitemap, newsletter signup or app badge in the footer text — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)

#### Al Jazeera English (aljazeera.com article, scraped Sept 2025)
- **Four headed groups, each heading with a "Show more" toggle:**
  - **About:** About Us, Code of Ethics, Terms and Conditions, EU/EEA Regulatory Notice, Privacy Policy, Cookie Policy, Cookie Preferences, Accessibility Statement, Sitemap, Work for us.
  - **Connect:** Contact Us, User Accounts Help, Advertise with us, Stay Connected, Newsletters, Channel Finder, TV Schedule, Podcasts, Submit a Tip.
  - **Our Channels:** Al Jazeera Arabic, Al Jazeera English, Al Jazeera Investigative Unit, Al Jazeera Mubasher, Al Jazeera Documentary, Al Jazeera Balkans, AJ+.
  - **Our Network:** Al Jazeera Centre for Studies, Al Jazeera Media Institute, Learn Arabic, Al Jazeera Centre for Public Liberties & Human Rights, Al Jazeera Forum, Al Jazeera Hotel Partners.
  — [hn-distill Al Jazeera scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45409227.md)
- **Closing:** "Follow Al Jazeera English:" with facebook, twitter, youtube, instagram and rss icons, then "© 2025 Al Jazeera Media Network". The AJ logo appears above the groups. There are no section links and no app badges in the footer text — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45409227.md)

#### NPR (npr.org; undated post-2022 scrape plus a 2022 scrape)
- **Four headed groups:**
  - **Read & Listen:** Home, News, Culture, Music, Podcasts & Shows.
  - **Connect:** Newsletters, Facebook, Instagram, Press, Public Editor, Corrections, Contact & Help.
  - **About NPR:** Overview, Diversity, NPR Network, Accessibility, Ethics, Finances.
  - **Get Involved:** Support Public Radio, Sponsor NPR, NPR Careers, NPR Shop, NPR Events, NPR Extra.
  - Then a legal row: Terms of Use, Privacy, Your Privacy Choices, Text Only.
  - Then a "Sponsor Message / Become an NPR sponsor" slot.
  — [DECEPT-URL NPR scrape (undated)](https://github.com/kibiddd/DECEPT-URL/blob/main/legit-active/9527_scraped.txt)
- **2022 version:** it had the same four groups, but Connect included Twitter and About NPR held Public Editor and Corrections. It ended "© 2022 NPR". So NPR has moved Public Editor/Corrections, added "NPR Network" and "Accessibility", and dropped Twitter since then — [PPE1_banlieue NPR scrape (2022)](https://github.com/MathildeCh/PPE1_banlieue/blob/main/DUMPS-TEXT/38en.txt)

#### The Economist (economist.com article, scraped Sept 2025)
- **Top of footer:**
  - Social links: LinkedIn, Instagram, Facebook, X, TikTok, YouTube, WhatsApp.
  - Then "Get The Economist app on iOS or Android".
  — [hn-distill Economist scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45167625.md)
- **Four headed columns:**
  - **The Economist:** About, Reuse our content, Subscribe, Economist Enterprise, SecureDrop.
  - **The Economist Group:** The Economist Group, Economist Intelligence, Economist Impact, Economist Impact Events, Economist Education Courses.
  - **Contact:** Help and support, Advertise, Press centre, Affiliate programme.
  - **Careers:** Working here, Executive Jobs.
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45167625.md)
- **Bottom:**
  - An inline cookie note ("To enhance your experience… we use cookies…") with a "Manage cookies" control.
  - Legal row: Terms of use, Privacy, Cookie Policy, Accessibility, Modern Slavery Statement, Sitemap, Your Privacy Choices (with the CCPA icon).
  - Company registration line: "Registered in England and Wales. No. 236383 | Registered office: The Adelphi… | VAT Reg No…".
  - "© The Economist Newspaper Limited 2025".
  — [same](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45167625.md)

### Inferences
- **Two broad footer types:**
  - **"Sitemap footers":** CNN, WaPo, Reuters, BBC, the Guardian's pillar row, and probably the NYT Site Index.
  - **"Corporate/trust footers":** AP, Al Jazeera, The Economist. These put the company, network, policy and ethics links first and do not repeat the section nav.
- **Subscription-driven sites use the footer as a commerce hub.** WaPo "Get The Post", NYT "Subscriptions / Terms of Sale", The Economist "Subscribe / Reuse our content", CNN "Subscribe" and bbc.com "Subscription Terms" all do this.
- **US privacy law shapes the legal row.** Many sites have "Do Not Sell or Share" / "Your Privacy Choices" / "CA Notice of Collection" links, and on the Guardian the label switches by jurisdiction. A small non-US site needs only "Privacy policy", "Cookie policy/settings" and "Terms", unless it targets US readers.

### Gaps
- **Live verification:** no live footer could be fetched. All inventories come from 2025 text scrapes or from publisher source code. Items rendered only by client-side JavaScript may be missing (e.g. the Guardian's Support block, which the code confirms, and the NYT Site Index columns).
- **NYT section columns:** I could not verify the NYT "Site Index" columns (News/Arts/Lifestyle/Opinion/More/Account, as commonly described).
- **NPR date:** the newest NPR scrape is undated.
- **Social icon labels:** BBC and CNN social icons were not captured as text, so their platforms are unverified.
- **CNN edition switcher:** whether CNN's edition switcher appears inside the footer (and not only the header) is unverified.
- **Mobile user agents:** no mobile-UA fetches were possible for any site.

## Q2. Visual structure (columns, logo placement, background, dividers, density)

### Takeaway
Only the Guardian's visual structure could be verified from code. Its footer uses a dark brand-colour background with thin brand-coloured vertical dividers and a CSS grid: signup on the left, three link columns plus a support column on the right, and copyright below. For the other sites I verified the grouping and number of headed columns from scrapes, but not colours or exact layout.

### Cited Findings
- **Guardian background and dividers:** the footer uses `background-color: brandBackground.primary` and `color: brandText.primary`. Dividers are `1px solid palette.brand[600]` between columns, and hover links turn `brandAlt[400]` — [Footer.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/Footer.tsx)
- **Guardian grid:**
  - On desktop the grid areas are `'signup links' / 'acknowledgment links'`. The newsletter block is fixed at 247px (desktop) or 298px (leftCol), and link columns are 150px wide with 1px left borders.
  - On smaller screens the areas stack: `signup`, `links`, `acknowledgment`.
  — [Footer.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/Footer.tsx)
- **Guardian type sizes:** link text is textSans17 with 12px bottom padding per link. The copyright line is small (textSans12) and sits below the grid. The "Back to top" button is absolutely positioned at the grid edge — [Footer.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/Footer.tsx); [BackToTop.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/BackToTop.tsx)
- **Headed-column counts from the scrapes:**
  - WaPo: 5 (Company, Sections, Get The Post, Contact Us, Terms of Use) — [WaPo scrape](https://github.com/BstWPY/WildGraphBench/blob/main/corpus/people/Donald%20Trump/reference_pages/Historians%20just%20ranked%20the%20presidents%20Trump%20wasnt%20last.txt)
  - Reuters: 6 groups plus a bottom row — [Reuters scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45797740.md)
  - Al Jazeera: 4 — [AJE scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45409227.md)
  - NPR: 4 — [NPR scrape](https://github.com/kibiddd/DECEPT-URL/blob/main/legit-active/9527_scraped.txt)
  - The Economist: 4 plus a legal row — [Economist scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45167625.md)
  - AP: 2 groups — [AP scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)
  - CNN: 21 top-level sitemap groups with sub-items — [CNN scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
- **Logo placement (from the order of text in the scrapes):**
  - The BBC logo comes first, before the section row — [BBC scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45841464.md)
  - The CNN logo plus section name sits at the top of the footer — [CNN scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
  - The AJ logo sits above the columns — [AJE scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45409227.md)
  - AP has logo images next to its mission blurb — [AP scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)
- **Link density (approximate counts from the scrapes):**
  - CNN is by far the densest, with roughly 150 links including the sitemap and podcasts — [CNN scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45773985.md)
  - WaPo has about 65 links on desktop — [WaPo scrape](https://github.com/BstWPY/WildGraphBench/blob/main/corpus/people/Donald%20Trump/reference_pages/Historians%20just%20ranked%20the%20presidents%20Trump%20wasnt%20last.txt)
  - AP has about 18 links — [AP scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)
  - NYT's site-information strip has 17 links — [NYT scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45503960.md)

### Inferences
- **Guardian background:** in the Guardian's Source design system, `brandBackground.primary` is the dark Guardian blue, so the footer is a dark footer with light text. The token is verified; the exact hex was not checked here.
- **Common layout:** most sites appear to use a "headed columns plus a thin legal strip plus a copyright line" layout. The copyright usually comes last (BBC, CNN, WaPo, Reuters, AJE, Economist). AP puts the copyright before its social icons.

### Gaps
- No screenshots or computed CSS were available for BBC, CNN, NYT, WaPo, Reuters, AP, Al Jazeera, NPR or The Economist, so their background colour (dark or light), dividers and column widths are unverified.
- No design write-ups, such as a Guardian digital blog, NYT Open or BBC GEL page about footers, could be fetched or found through search.

## Q3. How footers adapt on mobile

### Takeaway
Two sites show evidence of **collapsible accordion groups** on small screens: WaPo, whose separate mobile footer uses chevron headings, and Al Jazeera, whose headings have "Show more" toggles. The Guardian instead **stacks and reflows** its columns into a 2-up grid with the signup block on top. The WaPo mobile variant also **re-orders and merges** content: it promotes "Download the App" and moves About and Policies & Standards into a flat list.

### Cited Findings
- **WaPo:**
  - The page contains a second footer rendering with "### Company / Sections / Get The Post / Contact Us" headings, each followed by a "Chevron Icon". This is an expand/collapse pattern.
  - The legal and "Terms" group is flattened into an unheaded list beginning with "Download the Washington Post App", "About The Post" and "Policies & Standards".
  - The Company group changes too: it adds "WP Intelligence" and "Ask The Post AI".
  — [WaPo scrape](https://github.com/BstWPY/WildGraphBench/blob/main/corpus/people/Donald%20Trump/reference_pages/Historians%20just%20ranked%20the%20presidents%20Trump%20wasnt%20last.txt)
- **Al Jazeera:** each group heading is paired with a "Show more" control ("AboutShow more", "ConnectShow more", "Our ChannelsShow more", "Our NetworkShow more") — [AJE scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45409227.md)
- **Guardian:**
  - Below desktop, the links area gets a top border and the grid stacks in the order signup → links → acknowledgment.
  - Below tablet, each link list is 50% wide, so the columns form a 2×2 grid. The reader-revenue block also goes to 50% width with a top border, and odd-numbered columns lose their left border.
  - From tablet up, columns are fixed at 150px.
  — [Footer.tsx](https://github.com/guardian/dotcom-rendering/blob/main/dotcom-rendering/src/components/Footer.tsx)
- **AP:** the AP scrape repeats the two link groups three times, the third time as a single "SECTIONS" row. This suggests separate markup per breakpoint (desktop, tablet and mobile variants) — [AP scrape](https://github.com/artur-shlyapnikov/hn-distill/blob/main/data/raw/articles/45347178.md)

### Inferences
- **Serving multiple footers:** large sites often ship several footer DOMs and show or hide them per breakpoint (WaPo, likely AP) rather than making one responsive block.
- **Accordions are the common mobile answer** for 4+ headed groups. Legal links stay expanded and always visible.

### Gaps
- No mobile user-agent fetch or screenshot was possible, so mobile behaviour for BBC, CNN, NYT, Reuters, NPR and The Economist is unverified.
- It is unconfirmed whether the Al Jazeera toggles are active on desktop too.

## Q4. Baseline elements vs distinctive ones

### Takeaway
**Baseline:** privacy policy, terms, cookie settings or policy, an accessibility link, an about/company link, and a copyright line appear on all 10 sites. Contact, advertise, careers and social links appear on 8–9 of 10.
**Distinctive:**
- Guardian: "Support the Guardian" ask, "Back to top", SecureDrop/tips, tax and modern-slavery statements.
- Reuters: LSEG product cross-sell and a mission blurb.
- AP: mission blurb and "News Values and Principles".
- NPR: Ethics, Finances and Public Editor.
- WaPo: "Request a Correction" and "Report a Vulnerability".
- Al Jazeera: "Our Channels" and "Our Network".
- The Economist: company registration details.
- BBC: external-linking disclaimer.

### Cited Findings
Tally across 10 sites. Sources are the per-site scrapes and code cited in Q1.

- **Privacy policy link (10/10):** BBC, CNN, Guardian, NYT, WaPo, Reuters, AP, AJE, NPR, Economist.
- **Terms of use/service (10/10):** all ten.
- **Cookie policy or cookie settings control (9–10/10):** BBC (Cookies), Guardian (Cookie policy + Privacy settings), NYT (Cookie Policy + Manage Privacy Preferences), WaPo (Cookie Settings), Reuters (Cookies), AP (Cookie Settings), AJE (Cookie Policy + Cookie Preferences), NPR (Your Privacy Choices), Economist (Cookie Policy + Manage cookies). CNN has an unlabelled icon link beside "Ad Choices", which is not confirmed as cookie settings.
- **US "Do Not Sell/Share" or "Your Privacy Choices" (6/10):**
  - BBC ("Do not share or sell my info"), Guardian (US only), WaPo, AP (plus "Limit Use…" and "CA Notice of Collection"), NPR, Economist.
  - NYT uses "Manage Privacy Preferences" instead. CNN has "Ad Choices".
- **Accessibility link (10/10):** BBC Accessibility Help, CNN Accessibility & CC, Guardian Accessibility settings, NYT, WaPo, Reuters Digital Accessibility, AP, AJE, NPR, Economist.
- **About or company link (10/10):** NYT's is "NYTCo".
- **Copyright line (10/10):** NPR's appears in the 2022 scrape.
- **Contact (9/10):** Reuters shows only "Site Feedback", with no contact link in the scrape.
- **Advertise (9/10):** not seen in the CNN footer. NPR's version is "Sponsor NPR".
- **Careers (9/10):** not seen on the BBC.
- **Social links (8/10):** BBC, CNN, Guardian (as text), Reuters, AP, AJE, NPR (as text), Economist. None were seen in the NYT or WaPo scrapes.
- **Newsletter link or signup (6/10):** CNN, Guardian (a real signup CTA plus a link), WaPo, Reuters, AJE, NPR. Not seen at BBC, NYT, AP or The Economist.
- **Section sitemap (6–7/10):** BBC, CNN, Guardian (pillars + regions), WaPo, Reuters, NPR, and probably the NYT Site Index. Absent at AP, AJE and The Economist.
- **Editorial standards, ethics, corrections or trust links (7/10):**
  - Guardian: Complaints & corrections.
  - WaPo: Newsroom Policies & Standards, Request a Correction.
  - Reuters: Corrections, Reuters Fact Check, Reuters and AI, Brand Attribution Guidelines.
  - AP: News Values and Principles, AP's Role in Elections.
  - AJE: Code of Ethics.
  - NPR: Ethics, Finances, Public Editor, Corrections.
  - BBC: external-linking statement (plus "Why you can trust the BBC" in the Simorgh config).
  - None seen at CNN, NYT or The Economist.
- **News tips or SecureDrop (4/10):** Guardian (Tip us off, SecureDrop), WaPo (Send a News Tip), AJE (Submit a Tip), Economist (SecureDrop).
- **App download link (3/10):** Reuters (iOS + Android), Economist (iOS/Android), WaPo (Mobile & Apps / Download the App).
- **Subscribe or support ask (8/10):** CNN, Guardian ("Support the Guardian… funded by readers"), NYT, WaPo, Reuters, Economist, NPR ("Support Public Radio"), BBC ("Subscription Terms"). Not seen at AP or AJE.
- **Edition or language switch (3/10 verified):** BBC ("BBC in other languages"), NYT (Canada, International), Guardian (edition-specific lists, but no switcher in the footer).
- **Back to top (1/10 verified):** Guardian.
- **Sister-brand or commercial cross-links:**
  - Reuters: LSEG Products with descriptions.
  - AJE: Our Channels / Our Network.
  - Economist: Economist Group.
  - CNN: Underscored, Games, CNN Max.
  - NYT: T Brand Studio.
  - Guardian: Guardian Labs, Patrons, jobs, digital newspaper archive.
  - BBC: BBC Shop, BritBox.
  - AP: AP Stylebook, blogs.
  - WaPo: WP Creative Group, WP Intelligence, Post Store.
- **Unusual regional or legal items:**
  - Guardian: Acknowledgement of Country (AU edition), Modern Slavery Act and Tax strategy PDFs.
  - Economist: Modern Slavery Statement and company registration/VAT line.
  - Reuters: Commercial Disclosure (Japan) and a quote-delay notice.
  - CNN: market-data attributions and "CNN Sans" font copyright.
  - AJE: EU/EEA Regulatory Notice.
  - NPR: "Text Only" (a low-bandwidth site).
  - WaPo: "Report a Vulnerability" (security disclosure) and RSS Terms.
- **Mission or trust blurb:** Reuters ("Information you can trust") and AP (mission paragraph).
- **Search box:** none seen in any footer.

### Inferences
- **A credible minimum footer for a small news site** mirrors the baseline:
  - About, Contact, Advertise and Careers.
  - Privacy, Cookies/Consent settings, Terms and Accessibility.
  - Social links.
  - A copyright line.
- **The cheapest "trust" upgrade** is a corrections/complaints link plus an ethics or standards page. It is common at quality outlets (Guardian, WaPo, Reuters, AP, NPR, AJE) and costs almost nothing.
- **Newsletter signup:** only the Guardian puts a real signup CTA in the footer; the others just link to a newsletters page. A single-button CTA like the Guardian's is a light, proven pattern.
- **Back to top** is rare among these sites. It is optional, but it helps on long mobile pages.

### Gaps
- The counts could be off by one or two for sites where client-side elements, such as social icons or privacy buttons, may not appear in text scrapes (NYT, WaPo, CNN).
- No quantitative data (for example footer click-through rates) was found for any publisher.
