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
import retuneThumbnail from '../assets/works/retune-thumbnail.png'
import catatmakLogo from '../assets/works/catatmak-logo.svg'
import catatmakThumbnail from '../assets/works/catatmak-thumbnail.png'
import digiverseLogo from '../assets/works/digiverse-logo.svg'
import digiverseThumbnail from '../assets/works/digiverse-thumbnail.png'
import jettLogo from '../assets/works/jett-logo.svg'
import jettThumbnail from '../assets/works/jett-thumbnail.png'

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
    variant: 'dark',
  },
  {
    id: 'catatmak',
    name: 'Catatmak',
    tagline: 'Lorem ipsum',
    headline: null,
    description: 'Lorem ipsum dolor sit amet consectetur. Hendrerit massa id pharetra.',
    role: null,
    // Figma 652:1140 — Catatmak carries a single tag.
    services: ['Mobile App Design'],
    logo: CATATMAK_TILE,
    thumbnail: catatmakThumbnail,
    variant: 'light',
  },
  {
    id: 'digiverse',
    name: 'DigiVerse Studio',
    tagline: 'Lorem ipsum',
    headline: null,
    description: 'Lorem ipsum dolor sit amet consectetur. Hendrerit massa id pharetra.',
    role: null,
    services: ['Web App Design', 'Visual Branding'],
    logo: DIGIVERSE_TILE,
    thumbnail: digiverseThumbnail,
    variant: 'dark',
  },
  {
    id: 'jett',
    name: 'JETT',
    tagline: 'Lorem ipsum',
    headline: null,
    description: 'Lorem ipsum dolor sit amet consectetur. Hendrerit massa id pharetra.',
    role: null,
    services: ['Website Design', 'Interaction Design', 'Visual Branding'],
    logo: JETT_TILE,
    thumbnail: jettThumbnail,
    variant: 'light',
  },
]

export const CASE_STUDY_BASE = '/work'

export function caseStudyPath(study) {
  return `${CASE_STUDY_BASE}/${study.id}`
}

export function getCaseStudy(id) {
  return caseStudies.find((study) => study.id === id) || null
}
