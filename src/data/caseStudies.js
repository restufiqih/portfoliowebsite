// The one place a case study is described. Both the cards in the Works section
// on the landing page and the hero at the top of a detail page read from here,
// so a title, a blurb, or a tag is written once and cannot drift between them.
//
// Everything in an entry comes off the detail page's hero (Figma 686:2833): the
// card is a shorter retelling of the same block, not a separate set of copy.
// `id` is the slug the detail route is built from -- /work/retune -- and also
// the key its long-form story is filed under. Whether a card links anywhere is
// not recorded here: it is simply whether that story exists, so the two can
// never disagree.

import retuneLogo from '../assets/works/retune-logo.svg'
import retuneThumbnail from '../assets/works/retune-thumbnail.jpg'
import catatmakLogo from '../assets/works/catatmak-logo.svg'
import catatmakThumbnail from '../assets/works/catatmak-thumbnail.png'
import digiverseLogo from '../assets/works/digiverse-logo.svg'
import digiverseThumbnail from '../assets/works/digiverse-thumbnail.png'
import emailActionLogo from '../assets/works/email-action-logo.svg'
import emailActionThumbnail from '../assets/works/email-action-thumbnail.jpg'
import jettLogo from '../assets/works/jett-logo.svg'
import jettThumbnail from '../assets/works/jett-thumbnail.jpg'

// Each project brings its own tile: the fill behind the mark, how much of the
// tile the mark takes up, and whether the tile needs an outline to read. A mark
// on a coloured tile carries its own edge and never does.
//
// The fractions are the mark's share of its tile, not a size, so one set covers
// every place a tile is drawn -- the 62px tile on a desktop card, the 40px one
// overlaid on a stacked card's thumbnail, and the 56px one in the detail hero.
const RETUNE_TILE = {
  src: retuneLogo,
  fill: '#fff',
  markW: 26.571 / 62,
  markH: 33.214 / 62,
  outlined: true,
}

const DIGIVERSE_TILE = {
  src: digiverseLogo,
  fill: '#fff',
  markW: 25.333 / 62,
  markH: 38 / 62,
  outlined: true,
}

// Figma 1038:14033 — like JETT, the artwork is the whole tile, rounded corner
// and all. The exported mark is orange on black at rx 12 of 56, which is the
// same corner-to-tile ratio the other marks are drawn at.
const EMAIL_ACTION_TILE = {
  src: emailActionLogo,
  fill: '#000',
  markW: 1,
  markH: 1,
  outlined: false,
}

// Figma 709:49311 — the artwork is the whole tile, rounded corner and all, so
// it fills the box and the fill behind it only guards against a seam.
const JETT_TILE = {
  src: jettLogo,
  fill: '#000',
  markW: 1,
  markH: 1,
  outlined: false,
}

const CATATMAK_TILE = {
  // Exported whole rather than rebuilt: the mark is a dozen vector layers with
  // container-relative transforms, and the tile fill is part of the artwork.
  src: catatmakLogo,
  fill: '#3497F9',
  // 56 of the tile's 62, so the tile's own fill draws the rounded edge rather
  // than the artwork — the whole-tile export baked white corners into it.
  markW: 56 / 62,
  markH: 56 / 62,
  outlined: false,
}

export const caseStudies = [
  {
    id: 'email-action',
    // Figma 1038:12194 — the hero of the Email Action detail page.
    name: 'Email Action',
    tagline: 'Inbox Automation Tool',
    headline: 'Email Automation & Inbox Management Platform',
    description:
      'Email Action is a web application that helps users take control of their inbox through automated rules, from moving and labeling to archiving and unsubscribing from specific senders.',
    role: 'UI/UX Designer. Worked alongside other designers in the product team, focusing on research, user flow, and interface design across the core modules.',
    services: ['Web App Design', 'Visual Branding'],
    logo: EMAIL_ACTION_TILE,
    thumbnail: emailActionThumbnail,
    variant: 'light',
  },
  {
    id: 'catatmak',
    // Figma 855:20558 — the hero of the Catatmak detail page.
    name: 'Catatmak',
    tagline: 'Financial Tracking App',
    headline: 'Everyday Financial Tracking App',
    description:
      'Catatmak is a personal finance app designed to be used every day, with receipt-scan recording and a split bill feature for sharing expenses with friends.',
    role: 'UI/UX Designer. Worked within the product team, leading research, user flow, and interface design across both personal and business experiences.',
    services: ['Mobile App Design', 'Visual Branding'],
    logo: CATATMAK_TILE,
    thumbnail: catatmakThumbnail,
    variant: 'dark',
  },
  {
    id: 'retune',
    // Figma 686:2833 — the hero of the Retune detail page.
    name: 'Retune',
    tagline: 'AI Content Generator',
    headline: 'AI-Powered Content Repurposing Platform',
    description:
      'Retune is an AI-powered SaaS platform that transforms a single piece of content (such as a YouTube video) into ready-to-publish formats for 7 different platforms automatically, including blogs, newsletters, and social media.',
    role: 'UI/UX Designer. Led end-to-end product design, from research through visual design, component architecture, and developer handoff.',
    services: ['Web App Design', 'Visual Branding'],
    logo: RETUNE_TILE,
    thumbnail: retuneThumbnail,
    // The one field that is not detail-page content: how the landing page
    // paints this project's card. See CARD_SURFACES in Works.
    variant: 'light',
  },
  {
    id: 'jett',
    // Figma 1172:18347 — the hero of the Jett Plasma detail page. The write-up
    // rewrote all of this: the title now carries the live domain, the services
    // dropped from three chips to two, and the body is its own.
    name: 'Jett Plasma – jetteyes.ca',
    // The title names the site that was built, so on the detail page that part
    // of it is the link to it. `label` has to appear in `name` verbatim: the
    // hero splits the title on it rather than storing the title twice.
    site: { label: 'jetteyes.ca', href: 'https://jetteyes.ca' },
    tagline: 'Medical Device Website',
    headline: 'Website for an Eye Care Medical Device',
    description:
      'Jett Plasma is a plasma pen built specifically for eye care procedures. This website introduces the technology to professionals working in ophthalmology, dermatology, and aesthetics.',
    role: 'UI/UX Designer. Handled the project end to end, from research and information architecture through responsive design and developer handoff.',
    services: ['Landing Page', 'Visual Branding'],
    logo: JETT_TILE,
    thumbnail: jettThumbnail,
    variant: 'light',
  },
  {
    id: 'digiverse',
    // Figma 823:23033 — the hero of the DigiVerse Studio detail page.
    name: 'DigiVerse Studio',
    tagline: 'Business Intelligence Tool',
    headline: 'Self-Service Data Visualization Platform',
    description:
      'DigiVerse Studio is a business intelligence tool within the Telkom Corporate University LMS ecosystem, enabling internal teams to process and visualize data on their own without depending on the technical team.',
    role: 'UI/UX Designer. Worked within the product team on research, interaction design, and interface systems, while also shaping the product’s visual identity and design language.',
    services: ['Web App Design', 'Visual Branding'],
    logo: DIGIVERSE_TILE,
    thumbnail: digiverseThumbnail,
    variant: 'dark',
  },]

// The work index lists every study above, in the order they are written here.
// DigiVerse sits last because it is the one still unwritten: its page carries a
// hero and nothing under it, so it closes the grid rather than interrupting the
// four that have something to open.
//
// The landing page carries only four, because the stack is a pitch rather than
// a catalogue and a fifth card costs a whole screen of scrolling to reach the
// section below it. DigiVerse is the one held back there too, for the same
// reason it is last here.
//
// Order is the landing page's own, not a slice of the list above: Email Action
// takes the third slot DigiVerse used to hold. It is painted white rather than
// inheriting the black that slot used to carry, so the stack runs one dark card
// and then three light ones.
const HOME_IDS = ['catatmak', 'retune', 'email-action', 'jett']

export const homeCaseStudies = HOME_IDS.map((id) =>
  caseStudies.find((study) => study.id === id)
)

export const CASE_STUDY_BASE = '/work'

export function caseStudyPath(study) {
  return `${CASE_STUDY_BASE}/${study.id}`
}

export function getCaseStudy(id) {
  return caseStudies.find((study) => study.id === id) || null
}
