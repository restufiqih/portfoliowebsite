// The concept sites on the gallery rings. They are hand-built static pages under
// /public/gallery, so they open with a real page load rather than through the
// app's router. The card is a muted 4:3 clip of the site itself, looping.
// Newest first: the first project sits at the front of the upper ring.
export const galleryProjects = [
  {
    id: 'hangfive',
    name: 'hangfive',
    description: 'Surf-town cold brew',
    href: '/gallery/hangfive',
    video: '/gallery/media/hangfive.mp4',
  },
  {
    id: 'saraya',
    name: 'Saraya Partners',
    description: 'Healthcare operating partner',
    href: '/gallery/saraya',
    video: '/gallery/media/saraya.mp4',
  },
  {
    id: 'lumi',
    name: 'Lumi',
    description: 'AI leasing agent',
    href: '/gallery/lumi/',
    video: '/gallery/media/lumi.mp4',
  },
]

// Two rings, one above the other, each carrying the same number of cards. The
// lower one is turned half a step on, so its cards sit in the gaps of the upper
// one and the two read as a zigzag rather than a grid.
export const RING_ROWS = 2
export const RING_PANELS = 8

// Projects are dealt across the rows in turn, so the work is spread over both
// rings instead of filling one and leaving the other empty. Every slot with no
// site yet is a plain brand-blue card.
export const galleryRows = Array.from({ length: RING_ROWS }, (_, row) =>
  Array.from({ length: RING_PANELS }, (_, i) => {
    const project = galleryProjects[i * RING_ROWS + row]
    return project
      ? { ...project, blank: false, row }
      : { id: `blank-${row}-${i}`, blank: true, row }
  })
)
