/* Silence Acoustic — single source of truth for every page.
   NOTE: technical values below follow industry norms for each product type.
   Confirm them against your own test reports before publishing. */

const SITE = {
  name: 'Silence Acoustic',
  domain: 'silenceacoustic.com',
  url: 'https://silenceacoustic.com',
  tagline: 'Acoustic design, treatment and soundproofing',
  phone: '+91 81084 00566',
  phoneHref: '+918108400566',
  /* WhatsApp is a DIFFERENT number from the phone line (confirmed 1 Oct
     2026: 90044 08289). Never label the phone number as WhatsApp. */
  wa: '+91 90044 08289',
  waHref: 'https://wa.me/919004408289',
  email: 'info@silenceacoustic.com',
  emailProjects: 'projects@silenceacoustic.com',
  addr1: '501, 5th Floor, Ijmima Complex',
  addr2: 'Behind Infinity Mall, Mindspace',
  addr3: 'Mumbai, Maharashtra 400064',
  /* THE FOOTER SHOWS ONLY THIS, by request — the street address is not on the
     page. addr1/addr2/addr3 are kept because the JSON-LD PostalAddress in
     src/build.js still carries the full address, which is what a local
     business listing is matched on. If the intent is that the street address
     should not be published anywhere, the structured data has to be cut too,
     and that costs local search visibility — it is a separate decision. */
  addrShort: 'Mumbai, Maharashtra',
  /* GOOGLE MAPS (contact page). The query is the client's OWN, copied from
     the map embedded on silenceacoustic.com/contact-us — it is their Google
     business listing, so the pin is the one they already publish. Note that
     this does show the office's exact location, which the address-in-footer
     note above deliberately avoided in text; it was asked for on 1 Oct 2026
     ("so if someone clicks there they get the exact location"). */
  mapQuery: 'Silence Acoustics Pvt. Ltd., malad',
  /* The client's social accounts, read off the footer of silenceacoustic.com
     on 1 Oct 2026. Rendered as an icon row in the site footer (src/build.js).
     Do not add a network they do not link to themselves. */
  social: [
    { id: 'facebook',  name: 'Facebook',  href: 'https://www.facebook.com/silenceacousticofficial' },
    { id: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/silenceacoustic/' },
    { id: 'linkedin',  name: 'LinkedIn',  href: 'https://www.linkedin.com/company/42698711/' },
    { id: 'youtube',   name: 'YouTube',   href: 'https://www.youtube.com/@silenceacoustic' },
    { id: 'x',         name: 'X',         href: 'https://x.com/silenceacoustic' },
  ],
  /* NO OPENING HOURS. They were 'Mon–Sat, 10:00–19:00 IST' and were invented:
     the live site publishes email, phone and address in its footer and states
     opening hours nowhere. Verified against silenceacoustic.com. Do not put
     them back without the client supplying them. */

  /* The client's own published figure, from the About page: "2035+ successful
     projects across India" / "2035+ completed projects across India".
     PROJECTS.length is NOT this number — it is how many photographs are in
     the gallery (170). Do not use one where the other belongs. */
  projectsCompleted: '2035+',

  /* ---- THE HERO STAT RAIL ----------------------------------------------
     These four are the client's own homepage counters, transcribed from the
     band on silenceacoustic.com: "2035+ Project Completed / 20+ Years of
     Experience / 20+ Team Strength / 7 Project Running". Their labels are
     kept in the client's own wording (singular "Project Completed", not
     "Projects") because they are quoted figures, not our copy.

     Two of them are NOT derivable from anything else in this file and cannot
     be checked from the repo: team strength and projects currently running.
     `running` in particular goes stale on its own — it is a snapshot of one
     week's workload, not a cumulative total. Ask the client before a rebuild
     if it has been a while, and do not "round it up" here.

     `years` is derived from FOUNDED in src/pages.js and passes through here
     only so the four sit together; do not type a number into it.

     THERE ARE NO SUB-CAPTIONS AND THERE MUST NOT BE. Each counter is a figure
     and the client's own label, nothing else, because that is all their band
     carries. A first pass added a line under each one ("Across India since
     2006", "Designers, fabricators and installers", "On site at the time of
     writing") and every one of those was written here rather than taken from
     the client — the third was an outright invention about their current
     workload. They are removed. If a caption is wanted, get the words from
     the client; do not compose one. */
  stats: [
    { v: '2035+', label: 'Project Completed' },
    { v: null,    label: 'Years of Experience', years: true },
    { v: '20+',   label: 'Team Strength' },
    { v: '7',     label: 'Project Running' },
  ],

  /* ---- CONTACT FORM: the one setting that makes enquiries arrive ----
     Paste either a Web3Forms access key (https://web3forms.com, free) or a
     full Formspree URL (https://formspree.io/f/xxxx). Rebuild and it is live.
     Left empty, the form opens the visitor's own mail app with everything
     they typed pre-filled — nothing is lost, but nothing reaches an inbox
     automatically either. */
  formEndpoint: '',
};

/* ---- CLIENTS ------------------------------------------------------------
   THE FIFTY LOGOS THE CLIENT ALREADY PUBLISHES on the homepage of
   silenceacoustic.com, in their own order (theirs is alphabetical by
   filename, which is why 98.3 FM leads). Artwork is theirs, downloaded from
   their own uploads and converted to WebP at 402x162.

   THESE ARE OTHER COMPANIES' TRADEMARKS. They are on this site because they
   are on the client's site — porting a page the client already publishes,
   not making a new claim on their behalf. If a listed organisation ever asks
   to come off, the fix is to delete the row here and the file in
   assets/img/marks; nothing else references either.

   `n` IS A DISPLAY NAME, NOT THE CLIENT'S ALT TEXT. Theirs is the WordPress
   filename ("accenture", "Babique-nation", "Clients page images-12") and it
   goes straight into the alt attribute, so it had to be readable. Each name
   here was read off the artwork itself. Two were not recoverable from the
   filename at all and are recorded so nobody "corrects" them back:
     Clients-page-images-12.png  is the DBS bank logo
     Doorsha.jpg                 is Doordarshan
   Three more were misspellings fixed against the artwork: Babique -> Barbeque
   Nation, Bajaj-finserve -> Bajaj Finserv, Gitam-univerity -> GITAM.

   THE COUNT IS NEVER TYPED. The section head reads CLIENTS.length. */
const CLIENTS = [
  { s: 'radio-mirchi',             n: '98.3 FM Radio Mirchi' },
  { s: 'accenture',                n: 'Accenture' },
  { s: 'aegon-religare',           n: 'Aegon Religare Life Insurance' },
  { s: 'abp-ananda',               n: 'ABP Ananda' },
  { s: 'atlas-copco',              n: 'Atlas Copco' },
  { s: 'awfis',                    n: 'Awfis' },
  { s: 'barbeque-nation',          n: 'Barbeque Nation' },
  { s: 'bajaj-finserv',            n: 'Bajaj Finserv' },
  { s: 'balaji-telefilms',         n: 'Balaji Telefilms' },
  { s: 'bd-somani',                n: 'B. D. Somani International School' },
  { s: 'bnhs',                     n: 'BNHS India' },
  { s: 'bombay-gymkhana',          n: 'Bombay Gymkhana' },
  { s: 'bookmyshow',               n: 'BookMyShow' },
  { s: 'chatrabhuj-narsee',        n: 'Chatrabhuj Narsee School' },
  { s: 'dbs',                      n: 'DBS' },
  { s: 'doordarshan',              n: 'Doordarshan' },
  { s: 'edelweiss',                n: 'Edelweiss Broking' },
  { s: 'euroschool',               n: 'EuroSchool' },
  { s: 'federal-bank',             n: 'Federal Bank' },
  { s: 'gaudium',                  n: 'The Gaudium School' },
  { s: 'gitam',                    n: 'GITAM University' },
  { s: 'iit-bombay',               n: 'IIT Bombay' },
  { s: 'ict',                      n: 'Institute of Chemical Technology' },
  { s: 'jai-hind-college',         n: 'Jai Hind College' },
  { s: 'jaro-education',           n: 'Jaro Education' },
  { s: 'jbcn',                     n: 'JBCN International School' },
  { s: 'kk-cinemas',               n: 'KK Cinemas' },
  { s: 'larsen-toubro',            n: 'Larsen & Toubro' },
  { s: 'lodha',                    n: 'Lodha' },
  { s: 'mithibai-college',         n: 'Mithibai College' },
  { s: 'mscert',                   n: 'MSCERT' },
  { s: 'mumbai-university',        n: 'University of Mumbai' },
  { s: 'nsci',                     n: 'National Sports Club of India' },
  { s: 'pepsico',                  n: 'PepsiCo' },
  { s: 'piramal-realty',           n: 'Piramal Realty' },
  { s: 'prudential',               n: 'Prudential' },
  { s: 'radio-city',               n: 'Radio City' },
  { s: 'radio-nasha',              n: 'Radio Nasha' },
  { s: 'rbl-bank',                 n: 'RBL Bank' },
  { s: 'red-fm',                   n: 'Red FM 93.5' },
  { s: 'reliance-entertainment',   n: 'Reliance Entertainment' },
  { s: 'sahara-star',              n: 'Sahara Star' },
  { s: 'sbi',                      n: 'State Bank of India' },
  { s: 'sm-shetty',                n: 'S. M. Shetty' },
  { s: 'starwing',                 n: 'Starwing Developers' },
  { s: 'tata-cliq',                n: 'Tata CLiQ' },
  { s: 'tata-power',               n: 'Tata Power' },
  { s: 'teleperformance',          n: 'Teleperformance' },
  { s: 'thakur',                   n: 'Thakur' },
  { s: 'times-of-india',           n: 'The Times of India' },
];

/* ---- HERO BANNERS -------------------------------------------------------
   THE CLIENT'S OWN HOMEPAGE SLIDER, ported by request. Photographs, sector
   labels and headlines are all transcribed from silenceacoustic.com — the
   three `pxl-item` slides in their hero. Do not rewrite the headlines: they
   are the client's marketing copy, capitalisation included.

     Banner-4.jpg            -> banners/auditorium.webp

   1 Oct 2026, by request: the set is now home-theatre and boardroom
   (two images supplied directly, not from the live site) plus the
   client's own auditorium (Banner-4.jpg), which stays in slot three with
   its original sector and headline. office-conference (Banner-5.jpg) and
   recording-studio (Recording-studio-1.jpg) were removed; both are in git
   history. The supplied two carry the room types they show ('Home
   Theatres', 'Conference Room & Cabin' in SECTORS) and the other two
   client headlines. KEEP THREE SLIDES: the cross-fade timing in motion.css
   and theme.css is written for exactly three.

   THE SCRIM DOES NOT GUARANTEE AN ARBITRARY PHOTOGRAPH (see the hero notes in
   CLAUDE.md). Every one of these three was measured against the real
   composite before it went in, at 1440 and at 375, and the figures are
   recorded beside `.hero-media::after` in site.css. If you swap one, measure
   the replacement the same way — a darker picture than these will take the
   headline under the floor and nothing automated will catch it.

   `w`/`h` are the intrinsic pixels of the WebP, needed so the banner reserves
   its box before the image lands. */
const BANNERS = [
  /* No `alt` field: the banner photographs are decorative. `.hero-media`
     carries aria-hidden and each <img> ships alt="", which is correct — the
     sector and the headline beside the picture already say what it is. An
     alt written here would also have been a description composed rather than
     taken from the client, which is the thing this file exists to prevent. */
  { img: 'home-theatre',      w: 1536, h: 864, sector: 'Home Theatre',     title: 'Silence That Speaks Style' },
  { img: 'boardroom',         w: 1672, h: 941, sector: 'Conference Room',  title: 'Designed for Sound. Crafted for Spaces.' },
  { img: 'auditorium',        w: 1600, h: 731, sector: 'Auditorium',       title: 'Where Superior Acoustics Meet Elegant Design' },
];

/* ---- FOUNDER ------------------------------------------------------------
   CLIENT-SUPPLIED COPY. Verbatim from the change brief, including the figures
   ("more than 20 years", "over 2,035 projects"). Ravi Sebastian is a real,
   named person; do not embellish his biography, invent credentials, or add a
   portrait. Everything here came from the client in writing.

   The 2,035 figure is the same number as SITE.projectsCompleted, stated the
   client's own way for prose. Do not wire one to the other — the brief writes
   it with a comma and no plus, and that is their sentence. */
const FOUNDER = {
  /* The homepage intro's paragraph — CLIENT-SUPPLIED, verbatim from the
     7 Oct 2026 change list. It is body[0] plus one further sentence, so it
     lives separately rather than editing the About page's text. */
  home: 'Ravi Sebastian, Founder of Silence Acoustic, brings more than 20 years of industry experience in acoustics and soundproofing and has successfully delivered over 2,035 projects across a wide range of spaces and applications. His extensive hands-on background provides deep technical insight into the functional and aesthetic challenges of creating acoustically efficient environments. He ensures that the right acoustic materials are carefully selected for each space based on its specific requirements, while integrating thoughtful and aesthetically appealing designs that complement the overall look and functionality of the environment.',
  name: 'Ravi Sebastian',
  role: 'Founder, Silence Acoustic',
  body: [
    'Ravi Sebastian, Founder of Silence Acoustic, brings more than 20 years of industry experience in acoustics and soundproofing and has successfully delivered over 2,035 projects across a wide range of spaces and applications. His extensive hands-on background provides deep technical insight into the functional and aesthetic challenges of creating acoustically efficient environments.',
    'His practical expertise and technical leadership have shaped Silence Acoustic into a trusted provider of professional acoustic treatment and soundproofing solutions. Our team leverages this experience to diagnose unique acoustic problems and to design solutions that balance performance, functionality, aesthetics, and durability.',
    'Built on a foundation of industry knowledge and proven project delivery, the Silence Acoustic product range is engineered to deliver optimal acoustic performance while meeting the specific requirements of each space. We offer tailored solutions that integrate seamlessly with architects, deliver measurable acoustic improvements, and stand up to long-term use.',
  ],
};

/* ---- ABOUT-PAGE INTRO ---------------------------------------------------
   CLIENT-SUPPLIED COPY, verbatim from the change brief. One paragraph; it
   replaced three of ours that made the supplier-and-installer argument. The
   figures ("20+ years", "2,035+ projects") are theirs as written. */
const ABOUT_INTRO = {
  h1: 'Two Decades of Expertise in Acoustic Product and Solutions',
  h2: 'Two decades of expertise,\nin product and in solutions.',
  body: 'Silence Acoustic is a professionally driven acoustic and soundproofing solutions company, built on 20+ years of industry expertise under the leadership of our Founder, Ravi Sebastian. With 2,035+ projects successfully delivered, we bring extensive experience in acoustic treatment, soundproofing, and high-performance acoustic products across diverse applications. From offices, auditoriums, studios, hospitality spaces, and commercial environments to specialised projects, we combine technical expertise, quality materials, precision installation, and innovative design to create spaces with superior sound control, clarity, comfort, and privacy. Our commitment is to deliver engineered acoustic solutions that perform, endure, and seamlessly integrate with the aesthetics of every space.',
};

/* ---- OUR VISION ---------------------------------------------------------
   CLIENT-SUPPLIED COPY ONLY. Asked for on 30 Sep 2026; no vision statement
   exists on silenceacoustic.com (checked: home and About), so none is
   written here. Paste the client's own words as `body` (one string, or an
   array of paragraphs) and rebuild — the About page and the homepage show
   the section only while this is non-empty. Do NOT compose one. */
const VISION = { body: '' };

const NAV = [
  { href: 'index.html', label: 'Home' },
  { href: 'products.html', label: 'Products' },
  { href: 'projects.html', label: 'Projects' },
  { href: 'about.html', label: 'About' },
  { href: 'blog.html', label: 'Blog' },
  { href: 'contact.html', label: 'Contact' },
];

/* `surf` is the surface the family is represented by on the homepage rail —
   the most recognisable member of the family, not a sixth invented texture. */
const CATEGORIES = [
  { id: 'panels',  name: 'Acoustic Panels',    surf: 's-groove',  img: 'acoustic-designer-panel',  note: 'Wall-mounted absorbers, decorative and plain' },
  { id: 'ceiling', name: 'Acoustic Ceilings',  surf: 's-baffle',  img: 'acoustic-ceiling-baffle',  note: 'Suspended clouds and baffles for open volumes' },
  { id: 'foam',    name: 'Acoustic Foam',      surf: 's-wedge',   img: 'acoustic-foam',   note: 'Profiled PU foam for critical listening rooms' },
  { id: 'wood',    name: 'Acoustic Wood',      surf: 's-slat',    img: 'acoustic-wooden-slats',    note: 'Slatted, perforated and wood-wool systems' },
  { id: 'proof',   name: 'Soundproofing',      surf: 's-door',    img: 'soundproof-door',    note: 'Blocking sound between rooms, not inside one' },
];

/* ---------------------------------------------------------------------------
   PRODUCTS
   Every `specs` block below is transcribed from the matching product page on
   silenceacoustic.com (crawled from the site's own portfolio sitemap).
   Do not invent values here. If a figure is not published, leave it out.

   Four figures are transcribed exactly as published but look like unit errors
   on the source pages — see README before quoting them to a client:
     · foam density "23 kg/cm³"          (kg/m³ would be plausible)
     · foam tensile "0.97 kg/cm²"
     · wooden slats weight "12 kg/cm"
     · perforated wooden panel "32 kg/m³" (MDF/HDF is ~700–800 kg/m³)
   --------------------------------------------------------------------------- */

/* The PET board behind most of the panel and ceiling range. Their product pages
   publish this same block for polyester, tile, designer, printed, cloud and
   baffle — those products are all made from it. */
const PET = {
  'Material': '100% polyester fibre, recycled PET',
  'Panel size': '2420 × 1220 mm',
  'Thickness': '9 mm / 12 mm',
  'Weight': '4 kg (9 mm) / 5 kg (12 mm) per panel',
  'Density': '150.5 kg/m³ (9 mm) / 200.6 kg/m³ (12 mm)',
  'NRC': 'up to 0.6 (9 mm) / up to 0.85 (12 mm)',
};

/* `cut: true` MARKS A CARD SHOT THAT IS A CUT-OUT ON PURE WHITE, as opposed
   to a photograph of a finished room. Twelve of the nineteen are; the other
   seven (both ceilings, screen partitions, micro-perforated, parametric,
   polysynth wool and the soundproof door) are room photography.

   It is a fact about the ASSET, not about the product, and it is recorded
   here because Node cannot decode a WebP without a dependency this project
   does not have. It drives `.card-surface.is-cut` in site.css, which drops
   the white out of the shot and floats the sample on its own material — the
   move that makes a page of cards read as a materials library. Get it wrong
   in one direction and a room photograph is multiplied into mud; wrong in
   the other and a white rectangle punches a hole in the card.

   RECOMPUTE IT rather than guessing, whenever a card image is replaced:

     python3 -c "
     from PIL import Image; import glob, os
     for f in sorted(glob.glob('assets/img/products/*-card.webp')):
         im = Image.open(f).convert('RGB'); w, h = im.size
         b  = [im.getpixel((x, 0)) for x in range(0, w, 3)]
         b += [im.getpixel((x, h - 1)) for x in range(0, w, 3)]
         b += [im.getpixel((0, y)) for y in range(0, h, 3)]
         b += [im.getpixel((w - 1, y)) for y in range(0, h, 3)]
         white = sum(1 for p in b if min(p) >= 246) / len(b)
         print(f'{os.path.basename(f)[:-11]:34}{white:6.0%}', 'cut' if white > 0.90 else '')
     "

   Anything above ~90% white border is a cut-out. The threshold is 90 and not
   99 because the designer panel's board runs off one edge and scores 93. */
const PRODUCTS = [
  {
    slug: 'acoustic-polyester-panel', name: 'Acoustic Polyester Panel', cat: 'panels', surf: 's-felt', cut: true, shots: [1, 2, 3],
    tag: 'PET felt board for walls and ceilings',
    lead: 'A dense polyester fibre board that absorbs mid and high frequencies across a wide band. It is the panel we specify most often, because it does the acoustic work without asking for a specialist installer.',
    body: [
      'Engineered from 100% polyester fibre and made from recycled PET, the board has no loose fibre and no formaldehyde. It can be cut, routed and handled on site without protective gear, which matters when the ceiling contractor is fitting it at eleven at night before a Monday handover.',
      'The 12 mm board reaches an NRC of up to 0.85 against up to 0.6 for the 9 mm. If the budget allows only one upgrade on a project, going from 9 to 12 mm is usually the one that pays.',
      'Fixed with synthetic rubber adhesive applied in dots or beads at 25–30 mm spacing and pressed firmly to a plastered wall, or screwed to a batten frame. Where an air gap is possible, leave a cavity behind the board — it lifts low-frequency absorption at no extra material cost.',
    ],
    specs: { ...PET, 'Finish': 'Fire retardant, formaldehyde-free, 100% recyclable' },
    apps: ['Offices', 'Classrooms', 'Conference rooms', 'Studios', 'Home theatres'],
  },
  {
    slug: 'acoustic-tile-panel', name: 'Acoustic Tile Panel', cat: 'panels', surf: 's-tile', cut: true, shots: [1, 2, 3],
    tag: 'Modular tiles for grids and feature walls',
    lead: 'The same PET absorber cut to module sizes that drop into a suspended grid or tile up a wall in a repeating pattern.',
    body: [
      'Tiles suit two situations: a false ceiling that already has a grid and needs better absorption than mineral fibre gives, and a wall where the client wants a visible rhythm rather than a flat expanse.',
      'Because the module is small, damaged tiles are replaced individually. In a school corridor or a co-working floor that is worth more than it sounds.',
      'Module sizes are cut to your setting-out from the full 2420 × 1220 mm board, so the tile size is a drawing decision rather than a catalogue one. We set the pattern out before anything is cut so the joints land where you want them.',
    ],
    specs: { ...PET, 'Module': 'Cut to your setting-out from the full board' },
    apps: ['Offices', 'Classrooms', 'Retail', 'Reception areas'],
  },
  {
    slug: 'acoustic-designer-panel', name: 'Acoustic Designer Panels', cat: 'panels', surf: 's-groove', cut: true, shots: [1, 2, 3],
    tag: 'CNC-cut patterns: V-groove, U-groove, fluted, bespoke',
    lead: 'Absorption with a cut pattern in it. The routing is done from your drawing, so the panel reads as part of the interior rather than as acoustic treatment bolted onto it.',
    body: [
      'V-groove and U-groove profiles break up the flat plane and scatter the first reflection, which helps in rooms where a hard mirror-point would otherwise need a thicker absorber.',
      'Fluted and custom profiles are cut to a supplied vector file. Send us the DXF and we will come back with a cutting layout, a material take-off and a price before anything is committed.',
      'Cut from the same recycled PET board as the plain panel, so the absorption figures below are the starting point — the routing adds surface area rather than taking it away.',
    ],
    specs: { ...PET, 'Cutting': 'CNC laser and router, from DXF', 'Patterns': 'V-groove, U-groove, fluted, custom' },
    apps: ['Boardrooms', 'Hotel lobbies', 'Auditoriums', 'Premium offices'],
  },
  {
    slug: 'acoustic-printed-panel', name: 'Acoustic Printed Panel', cat: 'panels', surf: 's-print', cut: true, shots: [1, 2, 3],
    tag: 'UV-printed artwork on an absorbing substrate',
    lead: 'Your artwork, logo or photograph printed directly onto the acoustic panel. The wall keeps absorbing; it just stops looking like a wall of grey rectangles.',
    body: [
      'We print with UV-cured ink straight onto the PET face. There is no laminate film over the top, so the surface stays open and the absorption holds.',
      'Useful in the places where treatment and branding compete for the same wall: a reception, a training room, a clinic waiting area, a stadium concourse.',
      'Supply artwork at high resolution, sized to the finished wall. We proof the layout across panel joints before printing so faces and text do not land on a seam.',
    ],
    /* No 'Artwork: 150 dpi' row. The live product page says only "print any
       high-resolution image" and states no resolution anywhere — the figure
       was invented. Do not restore it without the client confirming a number. */
    specs: { ...PET, 'Printing': 'Direct UV, custom brand, photo or logo' },
    apps: ['Receptions', 'Training rooms', 'Clinics', 'Retail', 'Sports venues'],
  },
  {
    slug: 'acoustic-screen-partitions', name: 'Screen Partitions', cat: 'panels', surf: 's-screen', shots: [1, 2, 3],
    tag: 'Desk and floor screens for open-plan floors',
    lead: 'Screens that cut the direct path between people sitting near each other. The cheapest way to make an open office quieter without touching the base build.',
    body: [
      'A screen works on line of sight. Raise it above seated ear height and the conversation two desks away drops noticeably; leave it below and it does very little.',
      'Cut from the recycled PET board, so the screen is doing real absorption rather than just blocking a sightline — both faces are working.',
      'Sizes are cut from the 2400 × 1200 mm board to your desk layout, which keeps a leased floor free of drilling and lets the screen height follow the furniture rather than a catalogue.',
    ],
    specs: {
      'Material': '100% polyester fibre, recycled PET',
      'Panel size': '2400 × 1200 mm',
      'Thickness': '9 mm / 12 mm',
      'Weight': '4 kg (9 mm) / 5 kg (12 mm) per panel',
      'Density': '150.5 kg/m³ (9 mm) / 200.6 kg/m³ (12 mm)',
      'NRC': 'up to 0.6 (9 mm) / up to 0.85 (12 mm)',
    },
    apps: ['Open-plan offices', 'Call centres', 'Co-working', 'Libraries'],
  },
  {
    slug: 'acoustic-3d-embossed-panel', name: 'Acoustic 3D Panels', cat: 'panels', surf: 's-emboss', cut: true, shots: [1, 2, 3],
    tag: 'Moulded relief that scatters as well as absorbs',
    lead: 'A pressed three-dimensional face on a recycled polyester board, reaching an NRC of 0.85. The relief adds scatter to what would otherwise be a purely absorptive surface, which keeps a room from going dead.',
    body: [
      'Rooms treated only with flat absorbers can end up lifeless — speech gets clear but the space loses its sense of size. A relief face returns some energy to the room, scattered rather than reflected straight back.',
      'The moulding is part of the board rather than a skin applied to it, so it will not peel or delaminate in Mumbai humidity.',
      'Supplied in a free choice of colours, which makes it the panel to reach for when the treatment has to carry the interior rather than disappear into it.',
    ],
    specs: {
      'Composition': 'Recycled polyester fibre',
      'Use': 'Wall claddings / ceiling',
      'Panel size': '2400 × 1180 mm',
      'Thickness': '3 mm – 8 mm',
      'NRC': '0.85',
      'Colours': 'Free choice of colours',
    },
    apps: ['Feature walls', 'Lobbies', 'Restaurants', 'Boardrooms'],
  },
  {
    slug: 'parametric-design', name: 'Parametric Design', cat: 'panels', surf: 's-param', shots: [1, 2, 3],
    tag: 'Flowing CNC-cut wall and ceiling geometry',
    lead: 'Sculpted wall and ceiling forms built from a stack of CNC-cut ribs. Each rib is a different profile, so the assembled surface moves.',
    body: [
      'These are made-to-drawing pieces. We take a 3D model or a surface definition, slice it into ribs at the spacing the material allows, nest the cutting on sheet, and number every piece so it assembles in one order on site.',
      'Three substrates are available and they behave differently. Polyester absorbs, so a PET build does acoustic work as well as visual. MDF and acrylic are dense and reflective — those builds are diffusers, and need absorption elsewhere in the room to balance them.',
      'Expect a longer lead time than a flat panel; the cutting alone runs to several days on a large ceiling. Plan the site sequence around it.',
    ],
    specs: {
      'Polyester 9 mm': '2420 × 1220 mm · 4 kg/panel · 150.5 kg/m³ · NRC up to 0.6',
      'Polyester 12 mm': '2420 × 1220 mm · 5 kg/panel · 200.6 kg/m³ · NRC up to 0.85',
      'MDF 8–12 mm': '2440 × 1220 mm · 680–780 kg/m³',
      'Acrylic 6–12 mm': '2440 × 1220 mm · 1.18–1.20 g/cm³',
      'Input': '3D model or DXF',
    },
    apps: ['Auditoriums', 'Hotel lobbies', 'Showrooms', 'Atriums'],
  },
  {
    slug: 'micro-perforated-panel', name: 'Micro Perforated Panel', cat: 'panels', surf: 's-perf', shots: [1, 2, 3],
    tag: 'Fine perforation over a tuned cavity',
    lead: 'A rigid panel perforated at 0.5–1.5 mm across 3–8% of its face. Set over an air cavity it behaves as a resonant absorber, and the cavity depth can be sized to the frequency a room actually has a problem at.',
    body: [
      'Unlike porous absorbers, which work broadly across the top of the spectrum, a micro-perforated panel is selective. Change the open area or the depth of the cavity behind it and the absorption peak moves.',
      'Two cores are available. The MDF core takes a decorative paper veneer in wood grain or plain, with optional UV or melamine coating, and is the one to specify when the panel has to match a joinery package. The polyester core is lighter, recyclable and formaldehyde-free.',
      'It is also the choice where hygiene rules out exposed fibre: hospitals, food production, laboratories. There is nothing on the face to shed.',
      'We calculate the cavity depth against your room measurements. Send us the RT or a recording and we will size it.',
    ],
    specs: {
      'MDF core': '700–850 kg/m³ · 9 / 12 / 15 / 18 mm · emission grade E1 / E0',
      'Polyester core': '9 / 12 / 18 / 25 mm · lightweight, recyclable, formaldehyde-free',
      'Perforation': '0.5 – 1.5 mm hole diameter',
      'Open area': '3% – 8%',
      'Surface finish': 'Decorative paper veneer (wood grain or plain); UV or melamine coating optional',
    },
    apps: ['Hospitals', 'Laboratories', 'Halls with a specific ring', 'Food production'],
  },

  {
    slug: 'acoustic-ceiling-cloud', name: 'Acoustic Ceiling Clouds', cat: 'ceiling', surf: 's-cloud', shots: [1, 2, 3],
    tag: 'Horizontal absorbers hung below a hard soffit',
    lead: 'Flat PET panels suspended below the slab. They treat the largest untreated surface in most rooms while leaving services, lighting and sprinklers reachable.',
    body: [
      'In a typical office fit-out the ceiling is the biggest hard surface and the hardest one to give up, because everything runs through it. Clouds solve that: cover part of the area, leave the rest open for access, and take most of the reverberation out anyway.',
      'A cloud absorbs on both faces, which is why partial coverage works so well. The gap between clouds is not wasted area — sound reaches the top face through it.',
      'Hung on cable with adjustable grips, so they level quickly and re-level after the ceiling contractor has been back through. Cut to size from the full board.',
    ],
    /* Suspension detail transcribed from the client's installation steps, not
       summarised: GI/SS hanging wire at 2.5-3 mm, run to anchor fasteners,
       with eye bolts or clips on the panel frame and wire lengths trimmed to
       level. An earlier pass said "cable with adjustable grips", which is the
       right mechanism described in the wrong words and with no figure. */
    specs: { ...PET, 'Suspension': 'GI / SS wire, 2.5–3 mm, to eye bolts on the panel frame', 'Absorption': 'Horizontal, both faces exposed' },
    apps: ['Open-plan offices', 'Restaurants', 'Classrooms', 'Atriums'],
  },
  {
    slug: 'acoustic-ceiling-baffle', name: 'Acoustic Ceiling Baffles', cat: 'ceiling', surf: 's-baffle', shots: [1, 2, 3],
    tag: 'Vertical fins for tall, hard rooms',
    lead: 'PET panels hung on edge in rows. They present far more absorbing area per square metre of ceiling than a flat cloud does, which is what a gym or a warehouse-style office needs.',
    body: [
      'Baffles earn their place in high-volume rooms. Sound in a tall space travels a long way before it meets anything soft, and a vertical fin catches it from both sides on the way past.',
      'Running the rows perpendicular to the long axis of the room breaks up the flutter that develops between parallel end walls.',
      'Spacing is the variable that matters most. Tight rows absorb more but cost more and block more light; we set the spacing against a target reverberation time rather than a look.',
    ],
    /* Same correction as the cloud above. The published method is threaded
       rod to a carrier channel, not "cable or track". */
    specs: { ...PET, 'Suspension': 'GI threaded rod, 6–8 mm, to a carrier channel', 'Orientation': 'Suspended vertically, clipped at the top edge' },
    apps: ['Indoor sports halls', 'Gyms', 'Warehouse offices', 'Canteens', 'Auditoriums'],
  },

  /* ONE FOAM PRODUCT, by request (7 Oct 2026 change list: "Pyramid and
     Wedge, make it 1 as Acoustic Foam"). The two shared one published
     specification; only the profile differed, so the spec row "Shape" now
     names both. The copy below is the two old entries' own sentences,
     combined — nothing new was written. The old URLs redirect here
     (vercel.json). Images: card, hero and shots 1/3 are the pyramid's,
     shot 2 the wedge's. */
  {
    slug: 'acoustic-foam', name: 'Acoustic Foam', cat: 'foam', surf: 's-pyramid', cut: true, shots: [1, 2, 3],
    tag: 'Profiled PU foam in pyramid and wedge profiles',
    lead: 'Open-cell polyurethane foam cut into a field of pyramids or as parallel wedges at 50 mm, reaching an NRC of up to 0.9. The profile increases surface area and gives the wave a graded entry into the material instead of a hard face.',
    body: [
      'Foam is the standard answer inside a small critical-listening room — a vocal booth, a control room, a podcast studio — where the distances are short and the reflections arrive early enough to smear what you are hearing.',
      'Wedge and pyramid share the same specification and perform the same on paper. Choose on appearance and on how the tiles will be laid out, not on the datasheet. The wedge profile is directional, so orienting alternate tiles at ninety degrees evens out the response across the wall.',
      'It is not a soundproofing material. Foam on the wall will not stop your neighbour hearing the mix; that is a job for mass and isolation. Foam changes how the room sounds from the inside.',
      'Supplied in 305 × 305 mm and 610 × 610 mm tiles. The smaller tile is easier to work around switches and sockets; the larger one goes up faster on a clear wall.',
    ],
    specs: {
      'Item': 'Polyurethane acoustic foam',
      'Shape': 'Pyramid & Wedge',
      'Tile size': '305 × 305 mm & 610 × 610 mm',
      'Thickness': '50 mm',
      'NRC': 'up to 0.9',
      'Cell size': '77 PPI',
      'Density': '23 kg/cm³ (as published)',
      'Tensile strength': '0.97 kg/cm²',
      'Elongation': '135%',
    },
    apps: ['Recording studios', 'Vocal booths', 'Podcast rooms', 'Control rooms', 'Rehearsal rooms', 'Editing suites', 'Home studios'],
  },

  {
    slug: 'acoustic-wood-wool-panel', name: 'Acoustic Wood Wool Board', cat: 'wood', surf: 's-wool', cut: true, shots: [1, 2, 3],
    tag: 'Magnesite-bonded wood fibre, robust and paintable',
    lead: 'Long wood fibres bound with magnesite into a rigid, open board reaching an NRC of up to 0.9. It is the toughest absorber we supply, and the one to use where panels will be kicked, leaned on or hosed down.',
    body: [
      'A school corridor, a sports hall, a plant room, a car park — anywhere a soft panel would be destroyed in a season — wood wool survives. It takes an impact without denting through.',
      'The open fibre face can be sprayed in any colour without closing the surface, so it can be redecorated later along with the rest of the room.',
      'At 25 mm it does useful work lower down the spectrum than the 15 mm board. In a hall with a boomy low end, specify up rather than adding area.',
    ],
    specs: {
      'Material': 'Magnesite bonded wood fibres',
      'Panel size': '1200 × 610 mm',
      'Thickness': '15 / 20 / 25 mm',
      'Density': '400 kg/m³',
      'NRC': 'up to 0.9',
      'Finish': 'Natural or sprayed to colour',
    },
    apps: ['Schools', 'Sports halls', 'Basements', 'Plant rooms', 'Car parks'],
  },
  {
    slug: 'acoustic-wooden-slats', name: 'Acoustic Wooden Slats', cat: 'wood', surf: 's-slat', cut: true, shots: [1, 2, 3],
    tag: 'Veneered slat planks on an acoustic felt backing',
    lead: 'Pre-assembled slat planks — real wood veneer over an MDF or HDF core, mounted on a high-density acoustic felt backing. Sound passes between the slats and is absorbed behind; the room reads as a warm timber wall.',
    body: [
      'This is the system most architects arrive already wanting, and it deserves the reputation. It gives a room material warmth and a strong vertical line while quietly doing real acoustic work — up to an NRC of 0.85.',
      'It is supplied as a finished plank, 2420 mm long and 128 mm wide, with a tongue-and-groove edge. Planks lock into each other, so a wall goes up quickly and the joints stay closed. The slat spacing is set in the factory rather than on site, which is what keeps the acoustic performance consistent across a wall.',
      'Fixed by nailing into wall studs at roughly 40–50 cm intervals. On a masonry wall it goes onto battens first.',
    ],
    specs: {
      'Material': 'MDF / HDF core, real wood veneer, acoustic felt backing',
      'Plank size': '2420 × 128 mm',
      'Thickness': '15 mm',
      'Density': '750 kg/m³',
      'NRC': 'up to 0.85',
      'Fire class': '1 & P',
      'Edge': 'Tongue and groove',
      'Weight': '12 kg/cm (as published)',
    },
    apps: ['Auditoriums', 'Boardrooms', 'Hotel interiors', 'Home theatres', 'Restaurants'],
  },
  {
    slug: 'acoustic-wooden-panel', name: 'Acoustic Wooden Panel', cat: 'wood', surf: 's-woodperf', cut: true, shots: [1, 2, 3],
    tag: 'Perforated MDF or HDF board with a fleece backing',
    lead: 'A solid timber-faced board perforated on a regular grid, with acoustic fleece bonded behind, reaching an NRC of up to 0.9. It looks like joinery and performs like an absorber.',
    body: [
      'Where slats are too informal or too open for the interior, a perforated board gives the same warmth with a near-solid face. The perforation grid can be fine enough to read as texture from two metres away.',
      'Supplied in 2400 × 1200 mm sheets at 8, 10 or 12 mm, so it sits flush with most joinery thicknesses and can be matched to the finish schedule rather than standing proud of it.',
      'Fire properties comply with UL94, which is usually the line item that decides whether a timber-faced panel can be used in a public assembly space at all — check it against your local authority requirement early.',
    ],
    specs: {
      'Material': 'MDF / HDF, acoustic fleece backing',
      'Panel size': '2400 × 1200 mm',
      'Thickness': '8 / 10 / 12 mm',
      'NRC': 'up to 0.9',
      'Fire properties': 'Comply to UL94',
      'Density': '32 kg/m³ (as published)',
    },
    apps: ['Auditoriums', 'Lecture halls', 'Boardrooms', 'Libraries', 'Places of worship'],
  },

  {
    slug: 'polysynth-wool', name: 'Polysynth Wool', cat: 'proof', surf: 's-batt', shots: [1, 2, 3],
    tag: 'Non-itch polyester insulation roll for cavities',
    lead: 'Polyester insulation supplied in 15 metre rolls for filling stud walls, ceiling voids and the cavity behind panels. It replaces glass and mineral wool without the fibre.',
    body: [
      'A partition wall that is only plasterboard on both sides is largely hollow, and a hollow cavity resonates. Filling it damps that resonance and adds several points of sound reduction for very little money — it is the highest-value item in most soundproofing budgets.',
      'Polyester rather than mineral means no gloves, no mask and no complaints from the site team, which in practice means it actually gets installed properly rather than stuffed in loose. It is 90% recycled content.',
      'Tested to IS 8225, ISO 354 and ASTM 423C for absorption, IS 3346-1980 for thermal conductivity and ASTM D 635 for fire retardancy. Ask us for the reports if your specification needs them on file.',
    ],
    specs: {
      'Material': 'Polyester fibre, non-itch',
      'Roll dimensions': '15 m × 1.2 m × 50 mm',
      'Basic weight': '1000 GSM at 50 mm',
      'Weight per roll': '14.2 kg (average)',
      'Thermal conductivity': '0.03 W/mK',
      'Fire retardancy (FRT)': '100',
      'Recycled content': '90%',
      'Tested to': 'IS 8225 / ISO 354 / ASTM 423C · IS 3346-1980 · ASTM D 635',
    },
    apps: ['Partition walls', 'Ceiling voids', 'Behind panels', 'Ducting'],
  },
  {
    slug: 'polyblock-membrane', name: 'Polyblock Membrane', cat: 'proof', surf: 's-mlv', cut: true, shots: [1, 2, 3],
    tag: 'Mass-loaded vinyl for blocking sound transfer',
    lead: 'A limp, heavy sheet that adds mass to a wall, floor or ceiling without adding bulk. Where a partition has to stop sound rather than absorb it, this is the layer that does it — Rw 20 dB at 2 mm, 30 dB at 4 mm.',
    body: [
      'Absorption and isolation are different problems and they need different materials. Panels on a wall make the room you are standing in sound better. They do almost nothing for the person on the other side of that wall. Mass does.',
      'Polyblock is limp rather than rigid, which is the point: a stiff heavy board couples the two sides of a partition and passes vibration straight through. A limp one does not.',
      'Installed between the studs and the board, under a floating floor, or wrapped around a noisy duct or riser. Seal every joint and edge — an unsealed gap of even one percent of the area costs most of the benefit.',
    ],
    specs: {
      'Material': 'Mass-loaded vinyl (MLV)',
      'Thickness': '2 mm & 4 mm',
      'Surface mass': '4.5 kg/m² & 10 kg/m²',
      'Roll size': '1.2 × 10 m',
      'Soundproofing (Rw)': '20 dB & 30 dB',
      'Install': 'Seal all joints and perimeter',
    },
    apps: ['Partition walls', 'Floating floors', 'Duct wrap', 'Risers', 'Home theatres'],
  },
  {
    slug: 'soundproof-door', name: 'Soundproof Door', cat: 'proof', surf: 's-door', shots: [1, 2, 3],
    tag: 'Sealed heavy doorset, 60 or 100 mm leaf',
    lead: 'A heavy, gasketed door and frame supplied as one set, weighing between 100 and 250 kg. In almost every room we survey, the door is the weakest point in the wall, and no amount of wall treatment gets past it.',
    body: [
      'A standard flush door in a standard frame leaks sound around all four edges. You can build a partition to a high rating and then hang a door that brings the whole wall back down. Rating the wall without rating the door is wasted money.',
      'The leaf comes at 60 mm or 100 mm — the thicker one for studios and cinemas, the 60 mm where a meeting room needs privacy rather than isolation. The frame is solid wood and is supplied with the leaf, because the seal only works if the two were made for each other. Hardware and suspension are stainless steel, which matters on a 250 kg leaf that will swing several times a day for years.',
      'Fire resistance is Class 1, A2-s1, d0, rated to 60 minutes. A laminated acoustic vision panel is available where a control room or classroom needs sightlines.',
    ],
    specs: {
      'Door thickness': '60 mm, 100 mm',
      'Gross weight': '100 kg – 250 kg',
      'Frame construction': 'Solid wood',
      'Hardware & suspension': 'Stainless steel',
      'Fire resistance': 'Class 1, A2-s1, d0 — 60 minutes',
      'STC': '45–60 dB',
      'Rw': '30–50',
      'Vision panel': 'Available (optional)',
      'Door size': 'Custom sizes available',
    },
    apps: ['Recording studios', 'Home theatres', 'Auditoriums', 'Boardrooms', 'Clinics'],
  },
  {
    slug: 'soundproof-window', name: 'Soundproof Window', cat: 'proof', surf: 's-glass', cut: true, shots: [1, 2, 3],
    tag: 'Acoustic glazing, STC 30–60 dB',
    lead: 'Sealed glazing units built for sound rather than for heat, in wood or uPVC frames and made to your opening. Depending on the build, they reach an STC of between 30 and 60 dB.',
    body: [
      'Two panes of the same thickness resonate together and let a band of frequencies straight through. Making them different thicknesses moves those two resonances apart so neither one is a hole in the performance.',
      'Cavity width does more than glass thickness past a point. Where the reveal allows it we go wider; where it does not, we use laminated glass to damp the pane itself. The spread from 30 to 60 dB is almost entirely down to how much depth the opening can give us — bring us the reveal dimension early and it will shape what is achievable.',
      'On a Mumbai arterial road, a good acoustic window is usually the single largest improvement available to a bedroom or a studio. It is also the one item where a poor install undoes the product entirely, so we fit our own.',
    ],
    specs: {
      'STC': '30 – 60 dB, build-dependent',
      'Frame options': 'Wood, uPVC',
      'Window size': 'Custom sizes available',
      'Install': 'Fitted and sealed by our team',
    },
    apps: ['Road-facing bedrooms', 'Recording studios', 'Offices', 'Hotels', 'Clinics'],
  },
];

/* THE CLIENT'S PRODUCT SEQUENCE (7 Oct 2026 change list). Every list of
   products on the site — the products page, the homepage carousel, the
   footer and "related" rows — follows this order. It deliberately crosses
   the five families, which is why the products page is now one grid with
   family filters rather than five family sections. A slug missing from
   this list throws at build time instead of silently dropping a product. */
const PRODUCT_ORDER = [
  'acoustic-ceiling-baffle', 'acoustic-ceiling-cloud', 'acoustic-designer-panel',
  'parametric-design', 'micro-perforated-panel', 'acoustic-wooden-slats',
  'acoustic-printed-panel', 'acoustic-wood-wool-panel', 'acoustic-wooden-panel',
  'acoustic-3d-embossed-panel', 'acoustic-screen-partitions', 'acoustic-polyester-panel',
  'acoustic-tile-panel', 'acoustic-foam', 'polysynth-wool', 'polyblock-membrane',
  'soundproof-door', 'soundproof-window',
];
PRODUCTS.forEach(p => {
  if (!PRODUCT_ORDER.includes(p.slug)) throw new Error('PRODUCT_ORDER is missing ' + p.slug);
});
PRODUCTS.sort((a, b) => PRODUCT_ORDER.indexOf(a.slug) - PRODUCT_ORDER.indexOf(b.slug));

/* NO RT / STC / NC TARGETS HERE. Each sector used to carry one — "RT 1.2-1.6 s
   target", "RT < 0.3 s target", "STC 50+ between rooms", "NC 20-25 target" —
   and all ten were invented. Checked against eight of the ten live room-type
   pages: none publishes a target figure. The auditorium page mentions RT60
   only as something measured during a site survey, and the TV/radio and
   hotel pages carry no NC or STC figure at all.

   They were the worst of the fabrications on this site because they read as
   design targets the company commits to, in a column of their own, on two
   pages. Do not reintroduce a performance figure here unless the client
   supplies it. */
const SECTORS = [
  { name: 'Auditorium & Halls', surf: 's-slat', note: 'Speech clarity front to back, with enough life for music.' },
  { name: 'Recording Studio', surf: 's-wedge', note: 'Dead enough to hear the source, not the room.' },
  { name: 'Home Theatres', surf: 's-emboss', note: 'Controlled early reflections and a clean centre image.' },
  { name: 'Office Space', surf: 's-felt', note: 'Fewer overheard conversations across an open floor.' },
  { name: 'Classroom & Training Rooms', surf: 's-perf', note: 'Every seat hears the teacher without strain.' },
  { name: 'Conference Room & Cabin', surf: 's-param', note: 'Video calls that do not sound like a stairwell.' },
  { name: 'Multiplex & Cinema', surf: 's-baffle', note: 'Dialogue intelligibility and isolation between screens.' },
  /* Deliberately not `s-print`: the printed panel is the one saturated surface
     in the set, and next to nine monochrome tiles it reads as an error rather
     than as a room type. Hotels are a soundproofing job — show the door. */
  { name: 'Hotels & Clubs', surf: 's-door', note: 'Music contained, guest rooms quiet.' },
  { name: 'Indoor Sports', surf: 's-baffle', note: 'Whistles and shouting that do not turn to noise.' },
  { name: 'TV Channels & Radio Station', surf: 's-pyramid', note: 'Studios quiet enough for an open mic.' },
];

const PROCESS = [
  { h: 'Site survey', p: 'We come to the room, measure it, and listen to it. Free within Mumbai and the MMR, and chargeable against travel elsewhere in India — refunded if the project proceeds.' },
  { h: 'Measurement & report', p: 'Reverberation time by octave band, background noise level, and the transfer paths between rooms. You get the numbers, not an opinion.' },
  { h: 'Design & specification', p: 'A treatment layout drawn to your architect\'s plan, with the material, area and expected result stated per surface. Two rounds of revision are included.' },
  { h: 'Quotation', p: 'Itemised by product and area, with installation, transport and taxes separated. No lump sums that hide what you are paying for.' },
  /* "in our own facility" was cut here. The client asked twice in one brief to
     stop publishing the in-house-manufacturing claim — once on the homepage
     rail, once on the About bento — and a process step asserting a facility
     is the same claim in a quieter place. What the step actually promises the
     buyer is the proofing, and that is untouched. */
  { h: 'Manufacture', p: 'Cutting, routing, printing and assembly to the signed-off design. Custom work is proofed with you before it goes on the machine.' },
  { h: 'Installation', p: 'Fitted by our own crews across Mumbai and Maharashtra, and by certified installation teams elsewhere in India. Either way they work to the drawing and to your site timings, including nights and weekends.' },
  { h: 'Verification', p: 'We measure the finished room against the design target and hand over the report. If it misses, we fix it — that is what the design fee bought.' },
];

/* Verbatim from silenceacoustic.com — do not edit these; they are real
   people's words. Correct them only against a written source from the client. */
const TESTIMONIALS = [
  { q: 'It was great working experience with Silence Acoustics team for my acoustic project design every time. Their finishing work and skill technician leads the project work every time smoothly with my clients', n: 'Urmil Vaidhya', r: 'AV & Architecture Acoustics Design Consultant' },
  { q: 'The Acoustic have Improved Tremendously and our speaker System also working Good. Well Job done and in a limited Timeframe. We appreciate your Humble and Dedicated Service.', n: 'Jatin Patel', r: 'President, Rotary Club of Bombay North West- Malad' },
  { q: 'Silence Acoustic provided complete design and construction supervision. We described our requirements, and they suggested several ideas. We selected one and the project turned out to be excellent. They were very good with their work. Before plans were drawn, they had a site survey, elevations, views, etc. It was joy working with Silence Acoustic', n: 'Hudson Taylor', r: 'Owner, Hummingbird & Professor in Audio & Acoustics, XIM university' },
];

/* Real completed projects go here. Left empty deliberately: the site renders an
   honest "case studies in preparation" state rather than placeholder client work.
   Add entries as { n: name, l: location, s: sector, surf: css class, d: description }
   and the Projects page and homepage will pick them up automatically. */
/* Real completed projects, taken from the projects gallery on silenceacoustic.com.
   `s` is the image slug in assets/img/projects/<s>.webp, `sec` is the client's own
   sector label. Captions are theirs; only stray punctuation has been tidied. */
const PROJECTS = [
  { s: 'artillery-museum-nashik', n: 'Artillery Museum', l: 'Nashik', sec: 'Auditorium & Halls' },
  { s: 'vartak-college', n: 'Vartak College', l: '', sec: 'Auditorium & Halls' },
  { s: 'tibi-college-patna', n: 'Tibi College', l: 'Patna', sec: 'Auditorium & Halls' },
  { s: 'shade-design-studio-aroli', n: 'Shade Design Studio', l: 'Aroli', sec: 'Auditorium & Halls' },
  { s: 'sena-bhavan-dadar', n: 'Sena Bhavan', l: 'Dadar', sec: 'Auditorium & Halls' },
  { s: 'rvg-school-andheri', n: 'RVG school', l: 'Andheri', sec: 'Auditorium & Halls' },
  { s: 'rotary-club-of-bombay-north-west-malad', n: 'Rotary Club of Bombay North West', l: 'Malad', sec: 'Auditorium & Halls' },
  { s: 'romania-hall-malad', n: 'Romania Hall', l: 'Malad', sec: 'Auditorium & Halls' },
  { s: 'ravindra-natya-mandir-prabhadevi', n: 'Ravindra Natya mandir', l: 'Prabhadevi', sec: 'Auditorium & Halls' },
  { s: 'ramdev-meditation-center-mira-road', n: 'Ramdev Meditation Center', l: 'Mira Road', sec: 'Auditorium & Halls' },
  { s: 'ram-ganesh-gadkari-rangayatan-thane', n: 'Ram Ganesh Gadkari Rangayatan', l: 'Thane', sec: 'Auditorium & Halls' },
  { s: 'mit-college-pune', n: 'MIT College', l: 'Pune', sec: 'Auditorium & Halls' },
  { s: 'india-international-convention-expo-centre-dwarka', n: 'India International Convention & Expo Centre', l: 'Dwarka', sec: 'Auditorium & Halls' },
  { s: 'h-p-apartment-mumbai', n: 'H.P Apartment', l: 'Mumbai', sec: 'Auditorium & Halls' },
  { s: 'euroschool-balkum-thane', n: 'EuroSchool', l: 'Balkum Thane', sec: 'Auditorium & Halls' },
  { s: 'ckp-club-khar-mumbai', n: 'CKP Club', l: 'Khar Mumbai', sec: 'Auditorium & Halls' },
  { s: 'bnhs-bombay-mumbai', n: 'BNHS Bombay', l: 'Mumbai', sec: 'Auditorium & Halls' },
  { s: 'bharmakunari-vasai', n: 'Bharmakunari', l: 'Vasai', sec: 'Auditorium & Halls' },
  { s: 'barc-mankhud', n: 'BARC', l: 'Mankhud', sec: 'Auditorium & Halls' },
  { s: 'balasaheb-thackeray-rashtriya-smarak-dadar', n: 'Balasaheb Thackeray Rashtriya Smarak', l: 'Dadar', sec: 'Auditorium & Halls' },
  { s: 'accenture-vikroli', n: 'Accenture', l: 'Vikroli', sec: 'Classroom & Training Rooms' },
  { s: 'uno-minda-pune', n: 'UNO Minda', l: 'Pune', sec: 'Classroom & Training Rooms' },
  { s: 'thakur-school-dahisar', n: 'Thakur School', l: 'Dahisar', sec: 'Classroom & Training Rooms' },
  { s: 'iit-powai', n: 'IIT', l: 'Powai', sec: 'Classroom & Training Rooms' },
  { s: 'i-think-lodha-dombivli', n: 'I think Lodha', l: 'Dombivli', sec: 'Classroom & Training Rooms' },
  { s: 'bori-jamat-nalasopara', n: 'Bori Jamat', l: 'Nalasopara', sec: 'Classroom & Training Rooms' },
  { s: 'bd-somani-school-kharghar', n: 'BD Somani School', l: 'Kharghar', sec: 'Classroom & Training Rooms' },
  { s: 'anish-tutorial-mumbai', n: 'Anish Tutorial', l: 'Mumbai', sec: 'Classroom & Training Rooms' },
  { s: '88-pictures-mumbai', n: '88 Pictures', l: 'Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'z3-powai', n: 'Z3', l: 'POWAI', sec: 'Conference Room & Cabin' },
  { s: 'vns-industrial-delhi', n: 'VNS Industrial', l: 'Delhi', sec: 'Conference Room & Cabin' },
  { s: 'upl-metro-juinagar-navi-mumbai', n: 'UPL Metro', l: 'Juinagar Navi Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'upl-metro-aventura-navi-mumbai', n: 'UPL Metro, Aventura', l: 'Navi Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'tenerity-zinnov-pune', n: 'Tenerity Zinnov', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'tata-power-bhandup', n: 'Tata power Bhandup', l: '', sec: 'Conference Room & Cabin' },
  { s: 'supreme-business-park-powai', n: 'Supreme Business Park', l: 'Powai', sec: 'Conference Room & Cabin' },
  { s: 'sterling-pune', n: 'Sterling', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'state-bank-of-india-airoli', n: 'State Bank of India', l: 'Airoli', sec: 'Conference Room & Cabin' },
  { s: 'smart-city-hubli', n: 'Smart City', l: 'Hubli', sec: 'Conference Room & Cabin' },
  { s: 'silence-acoustic-malad-mumbai', n: 'Silence Acoustic', l: 'Malad Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'shanti-one-gensol-pune', n: 'Shanti One', l: 'Gensol Pune', sec: 'Conference Room & Cabin' },
  { s: 'rai-powai', n: 'RAI', l: 'Powai', sec: 'Conference Room & Cabin' },
  { s: 'raheja-chembers-nariman-point-mumbai', n: 'Raheja Chembers', l: 'Nariman point Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'parameter-design-powai', n: 'Parameter Design', l: 'Powai', sec: 'Conference Room & Cabin' },
  { s: 'optum-gansoli', n: 'Optum', l: 'Gansoli', sec: 'Conference Room & Cabin' },
  { s: 'one-international-center-dadar-mumbai', n: 'One International Center', l: 'Dadar Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'merck-limited-vikroli', n: 'Merck Limited', l: 'Vikroli', sec: 'Conference Room & Cabin' },
  { s: 'mascot-business-solutions-thane', n: 'Mascot Business Solutions', l: 'Thane', sec: 'Conference Room & Cabin' },
  { s: 'manayata-tech-park-bangalore', n: 'Manayata Tech Park', l: 'Bangalore', sec: 'Conference Room & Cabin' },
  { s: 'majestic-signia-noida', n: 'Majestic Signia', l: 'Noida', sec: 'Conference Room & Cabin' },
  { s: 'linework-chembur', n: 'Linework', l: 'Chembur', sec: 'Conference Room & Cabin' },
  { s: 'knowledge-boulevard-noida', n: 'Knowledge Boulevard', l: 'Noida', sec: 'Conference Room & Cabin' },
  { s: 'khadi-gram-udyog-mumbai', n: 'Khadi Gram Udyog', l: 'Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'idfc-bank-airoli', n: 'IDFC Bank', l: 'Airoli', sec: 'Conference Room & Cabin' },
  { s: 'hempel-vikhroli', n: 'Hempel', l: 'Vikhroli', sec: 'Conference Room & Cabin' },
  { s: 'health-prime-andheri-mumbai', n: 'Health Prime', l: 'Andheri Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'goyal-real-estate-borivali', n: 'Goyal Real Estate', l: 'Borivali', sec: 'Conference Room & Cabin' },
  { s: 'godrej-2-vikroli', n: 'Godrej 2', l: 'Vikroli', sec: 'Conference Room & Cabin' },
  { s: 'elpro-city-square-mall-pune', n: 'Elpro City Square Mall', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'e-bike-go-andheri-mumbai', n: 'E- Bike GO', l: 'Andheri Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'dsl-it-park-hyderabad', n: 'DSL IT Park', l: 'Hyderabad', sec: 'Conference Room & Cabin' },
  { s: 'dr-gokhale-s-urology-gynaecology-borivali', n: 'Dr.Gokhale\'s Urology & Gynaecology', l: 'Borivali', sec: 'Conference Room & Cabin' },
  { s: 'accelerator-limited-pune', n: 'Accelerator Limited', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'dbs-bank-vikhroli', n: 'DBS Bank', l: 'Vikhroli', sec: 'Conference Room & Cabin' },
  { s: 'co-working-space-mumbai', n: 'Co-working Space', l: 'Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'ceejay-house-worli', n: 'Ceejay House', l: 'Worli', sec: 'Conference Room & Cabin' },
  { s: 'bosh-banglore', n: 'Bosh', l: 'Banglore', sec: 'Conference Room & Cabin' },
  { s: 'bank-of-baroda-bkc-mumbai', n: 'Bank of Baroda', l: 'BKC Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'bajaj-pune', n: 'Bajaj', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'bajaj-trion-pune', n: 'Bajaj Trion', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'bajaj-finserve-pune', n: 'Bajaj Finserve', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'bajaj-finserv-pune', n: 'Bajaj Finserv', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'bajaj-finance-limited-delhi', n: 'Bajaj Finance Limited', l: 'Delhi', sec: 'Conference Room & Cabin' },
  { s: 'bajaj-amc-pune', n: 'Bajaj AMC', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'aurum-q-parc-thane', n: 'Aurum Q Parc', l: 'Thane', sec: 'Conference Room & Cabin' },
  { s: 'aurobindo-orbit-hyderabad', n: 'Aurobindo Orbit', l: 'Hyderabad', sec: 'Conference Room & Cabin' },
  { s: 'atlas-pune', n: 'Atlas', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'archer-chem-malad', n: 'Archer Chem', l: 'Malad', sec: 'Conference Room & Cabin' },
  { s: 'adani-bkc-mumbai', n: 'Adani', l: 'BKC Mumbai', sec: 'Conference Room & Cabin' },
  { s: 'accenture-indore', n: 'Accenture', l: 'Indore', sec: 'Conference Room & Cabin' },
  { s: 'accenture-pune', n: 'Accenture', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'accenture-nagpur', n: 'Accenture', l: 'Nagpur', sec: 'Conference Room & Cabin' },
  { s: 'accelya-service-india-pune', n: 'Accelya Service India', l: 'Pune', sec: 'Conference Room & Cabin' },
  { s: 'residential-home-theater-hyderabad', n: 'Residential Home Theater', l: 'Hyderabad', sec: 'Home Theatres' },
  { s: 'residential-home-theater-amravati', n: 'Residential Home Theater', l: 'Amravati', sec: 'Home Theatres' },
  { s: 'devang-shah-residential-malad', n: 'Devang Shah Residential', l: 'Malad', sec: 'Home Theatres' },
  { s: 'bhoomi-celestia-club-malad', n: 'Bhoomi Celestia Club', l: 'Malad', sec: 'Home Theatres' },
  { s: 'bay-view-andheri', n: 'BAY VIEW', l: 'ANDHERI', sec: 'Home Theatres' },
  { s: 'ashok-residential-hyderabad', n: 'Ashok Residential', l: 'Hyderabad', sec: 'Home Theatres' },
  { s: 'abletone-gorakhpur', n: 'Abletone', l: 'Gorakhpur', sec: 'Home Theatres' },
  { s: 'amethhyyst-lounge-bar-mumbai', n: 'Amethhyyst Lounge Bar', l: 'Mumbai', sec: 'Hotels & Clubs' },
  { s: 'open-house-club-hyderabad', n: 'Open house Club', l: 'Hyderabad', sec: 'Hotels & Clubs' },
  { s: 'kokino-restaurant-mumbai', n: 'Kokino Restaurant', l: 'Mumbai', sec: 'Hotels & Clubs' },
  { s: 'club-house-bungalow-lonavala', n: 'Club House - Bungalow Lonavala', l: '', sec: 'Hotels & Clubs' },
  { s: 'circuit-house-pune', n: 'Circuit House', l: 'Pune', sec: 'Hotels & Clubs' },
  { s: 'barrel-banquet-mumbai', n: 'Barrel Banquet', l: 'Mumbai', sec: 'Hotels & Clubs' },
  { s: 'bhoomi-celestia-malad', n: 'Bhoomi Celestia', l: 'Malad', sec: 'Indoor Sports' },
  { s: 'the-gaudium-school-hyderabad', n: 'The Gaudium School', l: 'Hyderabad', sec: 'Indoor Sports' },
  { s: 'pushpavinod-gaming-room-borivali', n: 'Pushpavinod, Gaming Room', l: 'Borivali', sec: 'Indoor Sports' },
  { s: 'chatrabhuj-narsee-school-mumbai', n: 'Chatrabhuj Narsee school', l: 'Mumbai', sec: 'Indoor Sports' },
  { s: 'k-k-cinema-navi-mumbai', n: 'K K Cinema', l: 'Navi Mumbai', sec: 'Multiplex & Cinema' },
  { s: 'abc-fitness-orbit-hyderabad', n: 'ABC Fitness Orbit', l: 'Hyderabad', sec: 'Office Space' },
  { s: 'upl-metro-navi-mumbai', n: 'UPL Metro', l: 'Navi Mumbai', sec: 'Office Space' },
  { s: 'tusker-workspace-bangalore', n: 'Tusker Workspace', l: 'Bangalore', sec: 'Office Space' },
  { s: 'teleperformance-mumbai', n: 'Teleperformance', l: 'Mumbai', sec: 'Office Space' },
  { s: 'teleperformance-hyderabad', n: 'Teleperformance', l: 'Hyderabad', sec: 'Office Space' },
  { s: 'tata-unistore-thane', n: 'Tata Unistore', l: 'Thane', sec: 'Office Space' },
  { s: 'suroj-builcon-amravati', n: 'Suroj Builcon', l: 'Amravati', sec: 'Office Space' },
  { s: 'shukra-pharmaceuticals-ltd-pune', n: 'Shukra Pharmaceuticals Ltd', l: 'Pune', sec: 'Office Space' },
  { s: 'sdkp-design-technologies-navi-mumbai', n: 'SDKP Design Technologies', l: 'Navi Mumbai', sec: 'Office Space' },
  { s: 'scert-mumbai', n: 'SCERT', l: 'Mumbai', sec: 'Office Space' },
  { s: 'rmz-millenia-chennai', n: 'RMZ Millenia', l: 'Chennai', sec: 'Office Space' },
  { s: 'pesico-vijayawada-pune', n: 'Pesico', l: 'Vijayawada Pune', sec: 'Office Space' },
  { s: 'mindspace-juinagar-navi-mumbai', n: 'Mindspace', l: 'Juinagar Navi Mumbai', sec: 'Office Space' },
  { s: 'microsoft-bangalore', n: 'Microsoft -Bangalore', l: '', sec: 'Office Space' },
  { s: 'meraki-arean-mumbai', n: 'Meraki Arean', l: 'Mumbai', sec: 'Office Space' },
  { s: 'lupin-pharmaceutical-santacruz-mumbai', n: 'Lupin Pharmaceutical', l: 'Santacruz Mumbai', sec: 'Office Space' },
  { s: 'lodha-ithink-vikroli', n: 'Lodha iThink', l: 'Vikroli', sec: 'Office Space' },
  { s: 'hsnc-university-mumbai', n: 'HSNC University', l: 'Mumbai', sec: 'Office Space' },
  { s: 'hot-star-malad', n: 'Hot Star', l: 'Malad', sec: 'Office Space' },
  { s: 'honeywell-hyderabad', n: 'Honeywell', l: 'Hyderabad', sec: 'Office Space' },
  { s: 'health-prime-vadodara', n: 'Health Prime', l: 'Vadodara', sec: 'Office Space' },
  { s: 'gigaplex-airoli', n: 'Gigaplex', l: 'Airoli', sec: 'Office Space' },
  { s: 'flipspace-mumbai', n: 'Flipspace', l: 'Mumbai', sec: 'Office Space' },
  { s: 'dbs-bank-chennai', n: 'Dbs Bank', l: 'Chennai', sec: 'Office Space' },
  { s: 'dbs-bank-mumbai', n: 'DBS Bank - Mumbai', l: '', sec: 'Office Space' },
  { s: 'cognizant-shakti-bhawan-bhubaneswar', n: 'Cognizant Shakti Bhawan', l: 'Bhubaneswar', sec: 'Office Space' },
  { s: 'capital-park-hyderabad', n: 'Capital Park', l: 'Hyderabad', sec: 'Office Space' },
  { s: 'bright-pharma-engineering-mumbai', n: 'Bright Pharma Engineering', l: 'Mumbai', sec: 'Office Space' },
  { s: 'bajaj-finance-limited-coimbatore', n: 'Bajaj Finance Limited', l: 'Coimbatore', sec: 'Office Space' },
  { s: 'bajaj-cerebrum-pune', n: 'Bajaj Cerebrum', l: 'Pune', sec: 'Office Space' },
  { s: 'avani-enterprises-airoli', n: 'Avani Enterprises', l: 'Airoli', sec: 'Office Space' },
  { s: 'arrcus-prestige-tech-park-bengaluru', n: 'Arrcus Prestige Tech Park', l: 'Bengaluru', sec: 'Office Space' },
  { s: 'ambit-house-worli', n: 'Ambit House', l: 'Worli', sec: 'Office Space' },
  { s: 'accenture-bangalore', n: 'Accenture', l: 'Bangalore', sec: 'Office Space' },
  { s: '3n-studio-andheri-mumbai', n: '3n Studio Andheri', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'varsha-bungalow-mumbai', n: 'Varsha Bungalow', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'tiger-studio-mumbai', n: 'Tiger Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'swarsamwad-studio-mumbai', n: 'Swarsamwad Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'swaroop-studio-thane', n: 'Swaroop Studio', l: 'Thane', sec: 'Recording Studio' },
  { s: 'studio-9-mumbai', n: 'Studio 9', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'sidharth-singer-studio-mumbai', n: 'Sidharth Singer Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'shaan-singer-studio-mumbai', n: 'Shaan Singer Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'ribbit-mickey-mccleary-studio-mumbai', n: 'Ribbit Mickey Mccleary Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'pritesh-kamat-bhandup', n: 'Pritesh kamat', l: 'Bhandup', sec: 'Recording Studio' },
  { s: 'playhead-studio-andheri-mumbai', n: 'Playhead Studio', l: 'Andheri Mumbai', sec: 'Recording Studio' },
  { s: 'orange-busines-aurum-gansoli', n: 'Orange Busines Aurum', l: 'Gansoli', sec: 'Recording Studio' },
  { s: 'ocean-wav-studio-mumbai', n: 'Ocean Wav Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'nilesh-mistry-recording-studio-mumbai', n: 'Nilesh Mistry Recording Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'naadbhramha-dance-studio-borivali', n: 'Naadbhramha Dance Studio', l: 'Borivali', sec: 'Recording Studio' },
  { s: 'mika-singh-studio-mumbai', n: 'Mika Singh Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'mickey-mcleary-santacruz-mumbai', n: 'Mickey Mcleary', l: 'Santacruz Mumbai', sec: 'Recording Studio' },
  { s: 'kosmik-beats-studio-pune', n: 'Kosmik Beats Studio', l: 'Pune', sec: 'Recording Studio' },
  { s: 'jigna-studio-mumbai', n: 'Jigna Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'jai-hind-college-mumbai', n: 'Jai Hind College', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'geetham-university-vizag', n: 'Geetham University', l: 'Vizag', sec: 'Recording Studio' },
  { s: 'gaurav-chatterjee-studio-mumbai', n: 'Gaurav Chatterjee Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'ganga-jamuna-studio-bandra', n: 'Ganga Jamuna Studio', l: 'Bandra', sec: 'Recording Studio' },
  { s: 'boss-studio-mumbai', n: 'Boss Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'audio-castle-studio-mumbai', n: 'Audio Castle Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'amit-trivedi-studio-mumbai', n: 'Amit Trivedi Studio', l: 'Mumbai', sec: 'Recording Studio' },
  { s: 'ambedkar-university-aurangabad', n: 'Ambedkar University', l: 'Aurangabad', sec: 'Recording Studio' },
  { s: 'action-voice-studio-khar-mumbai', n: 'Action Voice Studio', l: 'Khar Mumbai', sec: 'Recording Studio' },
  { s: 'red-fm-mumbai', n: 'Red FM', l: 'Mumbai', sec: 'TV Channels & Radio Station' },
  { s: 'radio-mirchi-mumbai', n: 'Radio Mirchi', l: 'Mumbai', sec: 'TV Channels & Radio Station' },
  { s: 'radio-fever-chennai', n: 'Radio Fever', l: 'Chennai', sec: 'TV Channels & Radio Station' },
  { s: 'radio-city-kanpur', n: 'Radio City', l: 'Kanpur', sec: 'TV Channels & Radio Station' },
  { s: 'fever-lucknow', n: 'Fever', l: 'Lucknow', sec: 'TV Channels & Radio Station' },
  { s: 'fever-delhi', n: 'Fever', l: 'Delhi', sec: 'TV Channels & Radio Station' },
  { s: 'doordarshan-shimla', n: 'Doordarshan', l: 'Shimla', sec: 'TV Channels & Radio Station' },
];

const POSTS = [
  {
    slug: 'what-are-acoustic-polyester-panels-and-how-do-they-work-a-beginners-guide',
    t: 'What Are Acoustic Polyester Panels and How Do They Work? A Beginner\u2019s Guide',
    d: 'What PET acoustic panels are, the physics of how a porous fiber absorber turns sound into heat, where they are used, and how to choose thickness, NRC and fire performance.',
    tag: 'Fundamentals', read: '7 min', date: '2026-07-30', dateLabel: '30 July 2026',
    body: [
      ['p', 'Excessive noise and echo can make offices, classrooms, auditoriums, restaurants, and meeting rooms uncomfortable. Conversations become difficult, concentration decreases, and overall productivity is affected.'],
      ['p', 'One of the most effective solutions is installing acoustic polyester panels. These sound absorbing panels reduce echo, improve speech clarity, and enhance the acoustic comfort of any interior without compromising aesthetics.'],
      ['p', 'In this beginner’s guide, we’ll explain what acoustic polyester panels are, how they work, their benefits, applications, and why they have become one of the most popular acoustic panels for commercial and residential spaces.'],
      ['h2', 'What are acoustic polyester panels?'],
      ['p', 'Acoustic polyester panels, also known as PET acoustic panels, are high-performance acoustical panels made from compressed polyester fibers. They are designed to absorb sound waves and minimize reverberation within a room.'],
      ['p', 'Unlike soundproofing products that block sound transmission, polyester acoustic panels improve the acoustic quality inside a space by absorbing reflected sound.'],
      ['ul', ['Lightweight', 'Durable', 'Eco-friendly', 'Easy to install', 'Available in various colors, textures, and custom designs']],
      ['p', 'Most premium polyester panels are manufactured using recycled PET (polyethylene terephthalate) fibers, making them a sustainable choice for modern interiors.'],
      ['h2', 'How do they work?'],
      ['p', 'Sound travels through the air as waves. When these waves strike hard surfaces such as glass, concrete, marble or gypsum walls, they bounce back into the room, creating echoes and reverberation.'],
      ['p', 'Acoustic polyester panels are made from thousands of fine polyester fibers that create a porous structure. As sound waves enter the panel, the sound passes into the porous fiber structure, the fibers slow the movement of the waves, friction within the fibers converts a small portion of the sound energy into heat, and less sound is reflected back into the room.'],
      ['ul', ['Reduced echo', 'Better speech intelligibility', 'Improved meeting room acoustics', 'Enhanced listening experience', 'Lower background noise']],
      ['h2', 'Benefits of acoustic polyester panels'],
      ['p', 'Installing acoustic polyester panels provides several advantages:'],
      ['ul', ['Excellent sound absorption', 'Reduces echo and reverberation', 'Improves speech clarity', 'Creates a quieter working environment', 'Enhances productivity in offices', 'Modern decorative appearance', 'Lightweight and easy to install', 'Environmentally friendly', 'Low maintenance', 'Long service life', 'Available in custom CNC-cut patterns', 'Can be digitally printed with custom artwork']],
      ['h2', 'Key features'],
      ['ul', ['Manufactured from polyester fibers', 'Excellent Noise Reduction Coefficient (NRC)', 'Available in multiple thicknesses such as 9 mm and 12 mm', 'Wide range of colors', 'Fire-retardant options', 'Moisture resistance', 'Formaldehyde-free construction', 'Recyclable material', 'Easy fabrication using CNC cutting']],
      ['h2', 'Where they are used'],
      ['p', 'Corporate offices, conference and meeting rooms, auditoriums, educational institutions, libraries, restaurants and caf\u00e9s, hotels, home theatres, recording and podcast rooms, hospitals, open-plan and coworking workspaces, and exhibition booths.'],
      ['h2', 'Why they are popular'],
      ['p', 'Compared to traditional fiberglass panels, polyester acoustic panels are safer to handle with no loose fibers, look finished without additional fabric wrapping, come in vibrant colors, are lighter to install, and can be cut into creative shapes and patterns for walls, ceilings, partitions and decorative features. That combination of performance and design flexibility is what makes them a preferred solution for architects and interior designers.'],
      ['h2', 'How to choose the right panel'],
      ['ul', ['Thickness \u2014 thicker panels generally provide better sound absorption, particularly for lower frequencies', 'NRC rating \u2014 choose panels with a higher Noise Reduction Coefficient for better acoustic performance', 'Fire performance \u2014 ensure the panels meet the fire safety standards required for your project', 'Color and design \u2014 select colors and patterns that complement your interior', 'Installation method \u2014 panels can be fixed directly to walls or suspended from ceilings as baffles or clouds']],
      ['h2', 'Maintenance'],
      ['p', 'Acoustic polyester panels require very little maintenance. Dust regularly with a soft brush or vacuum, clean stains using a damp microfiber cloth, avoid abrasive cleaners or harsh chemicals, and replace damaged panels individually if needed.'],
      ['h2', 'Frequently asked questions'],
      ['qa', 'Are acoustic polyester panels soundproof?', 'No. They are designed to absorb sound and reduce echo, not to completely block sound transmission.'],
      ['qa', 'Can they be installed on ceilings?', 'Yes. They are suitable for both wall and ceiling installations, including suspended ceiling baffles and acoustic clouds.'],
      ['qa', 'Are they eco-friendly?', 'Yes. Many products are manufactured using recycled PET fibers and are fully recyclable.'],
      ['qa', 'Are they safe?', 'Yes. High-quality panels are non-toxic, low in VOC emissions, and free from harmful loose fibers.'],
      ['qa', 'Can they be customized?', 'Yes. Polyester acoustic panels can be CNC cut into decorative patterns and digitally printed with custom graphics, branding or artwork.'],
      ['h2', 'Conclusion'],
      ['p', 'Acoustic polyester panels are an effective and stylish solution for improving indoor acoustics. By absorbing reflected sound waves, they reduce echo, improve speech clarity, and create quieter, more comfortable environments.'],
      ['p', 'Whether you\u2019re designing a corporate office, auditorium, classroom, restaurant, or home theatre, acoustic panels, acoustical panels, and sound absorbing panels made from polyester fiber offer excellent acoustic performance, durability, and modern aesthetics.'],
      ['p', 'If you\u2019re looking for a sustainable, decorative, and high-performance acoustic solution, polyester acoustic panels are one of the best choices available.'],
    ],
  },
];

/* Originally verbatim from the FAQ block on silenceacoustic.com's About page
   (/about-acoustic-solutions-company-india/). Condensed by request — the
   client's answers ran long for this page's format — but every figure below
   (pricing, timelines, warranty terms) is still theirs; nothing was added or
   changed, only shortened. Moved from the About page to the Notes page by
   request. */
const FAQ = [
  { q: 'How much do acoustic treatments cost?', a: 'From ₹150/sq ft for basic treatments up to ₹400–800/sq ft for premium installations, depending on size, material and performance target. We quote after a free site assessment.' },
  { q: 'What’s the difference between soundproofing and acoustic treatment?', a: 'Soundproofing blocks sound between spaces; acoustic treatment controls reflections within one. Most projects need both — we work out the right mix for yours.' },
  { q: 'How long does acoustic installation take?', a: '1–2 days for a small room, 3–5 days for a medium space, 1–2 weeks for a large facility (500+ sq m). Bigger or more complex projects run to a custom timeline.' },
  { q: 'Do you provide warranties on acoustic products?', a: 'Yes — 5–10 years on materials, 2 years on installation, plus a performance guarantee against your contracted targets. Annual maintenance packages are available.' },
  { q: 'Can acoustic treatments be customized for interior design?', a: 'Yes. Our fabric-wrapped panels and acoustic tiles come in hundreds of colours, patterns and textures, and we work directly with interior designers on the look.' },
];

/* ---- CONTACT-PAGE ESTIMATE CALCULATOR (7 Oct 2026 change list) ----------
   The four products and every heading, label and the note under the
   calculator are the client's own words from the change list.

   RATES ARE NOT SET, ON PURPOSE. The brief asks for an "estimated price"
   but gives no prices, and a made-up rate published on the site would be a
   quotation the client never gave. Put each product's material rate in
   rupees per square foot as `rate` (a number) and rebuild; until then the
   calculator shows the area and says the price is given on request.

   Area is the WALL area of the room — 2 × (length + width) × height, in
   square feet — which is the surface these four wall products cover. */
const CALC = {
  products: [
    { slug: 'acoustic-polyester-panel', name: 'Acoustic Polyester Panel', rate: null },
    { slug: 'acoustic-printed-panel',   name: 'Acoustic Printed Panel',   rate: null },
    { slug: 'acoustic-designer-panel',  name: 'Acoustic Designer Panel',  rate: null },
    { slug: 'acoustic-foam',            name: 'Acoustic Foam',            rate: null },
  ],
};

module.exports = { CALC, SITE, CLIENTS, BANNERS, FOUNDER, ABOUT_INTRO, VISION, NAV, CATEGORIES, PRODUCTS, SECTORS, PROCESS, TESTIMONIALS, PROJECTS, POSTS, FAQ };
