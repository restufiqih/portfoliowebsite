// The body of the Jett Plasma case study — Figma 1172:18324, everything below
// the hero. The hero itself lives in the shared case-study database; this is
// the long-form story, kept as data so the page is a renderer rather than a
// wall of markup. Block shapes and spacing rules are documented in retune.js.
//
// Straight apostrophes in the source are set as U+2019, which is what the
// other written studies use throughout.
//
// Gallery images carry the width and height they have in the 1440 frame. The
// pair sets the aspect ratio and, within a row, how the width is split.
//
// Every frame the design names "Image" is exported as a flat asset rather than
// rebuilt in markup, so the persona cards, the sitemap and the landing page
// itself all arrive as pictures.

import overview01 from '../../assets/works/jett/overview-01.jpg'
import overview02 from '../../assets/works/jett/overview-02.jpg'
import overview03 from '../../assets/works/jett/overview-03.jpg'
import overview04 from '../../assets/works/jett/overview-04.jpg'
import overview05 from '../../assets/works/jett/overview-05.jpg'
import overview06 from '../../assets/works/jett/overview-06.jpg'
import persona01 from '../../assets/works/jett/persona-01.jpg'
import sitemap01 from '../../assets/works/jett/sitemap-01.png'
import landing01 from '../../assets/works/jett/landing-01.jpg'
import responsive01 from '../../assets/works/jett/responsive-01.jpg'
import responsive02 from '../../assets/works/jett/responsive-02.jpg'
import responsive03 from '../../assets/works/jett/responsive-03.jpg'
import visualType from '../../assets/works/jett/visual-type.png'
import visualSw1 from '../../assets/works/jett/visual-sw1.png'
import visualSw2 from '../../assets/works/jett/visual-sw2.png'
import visualSw3 from '../../assets/works/jett/visual-sw3.png'
import visualMark from '../../assets/works/jett/visual-mark.png'
import visualIllo from '../../assets/works/jett/visual-illo.jpg'

// `offsetTop` is how far the cell hangs below the top of its row in the 1440
// frame; the renderer applies it on desktop only.
const img = (src, w, h, alt, offsetTop) => ({ src, w, h, alt, offsetTop })

// A group is one cell holding several pictures. Children carry the x/y/w/h
// they have inside the group in the 1440 frame, so a nested block reads as
// drawn — and each picture stays its own thing: separately zoomable, and on
// a phone it gets a line to itself instead of shrinking inside a slab.
const group = (w, h, items, keep = false) => ({ w, h, items, keep })
const at = (x, y, w, h, cell) => ({ ...cell, x, y, w, h })

export default [
  // 1172:18450
  { type: 'divider' },

  // 1172:18451 — Overview and The Goals share one right-hand column.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Overview',
        body: [
          {
            paragraphs: [
              'Jett Plasma is a medical device that uses direct current plasma technology for a range of procedures around the eye, from non-surgical blepharoplasty to treating MGD and Blepharitis and removing benign skin lesions. What sets it apart from similar devices is its use of DC, which produces a more stable and controlled energy output than the AC current most competitors rely on. The problem is that this advantage is technical and invisible from the outside. The client needed a site that could explain why the difference in current matters, show real patient results, and ultimately move medical professionals to get in touch. Beyond the main page, dedicated pages were needed for clinical studies, a treatment results gallery, a video library, testimonials, company background, and contact.',
            ],
          },
        ],
      },
      {
        heading: 'The Goals',
        body: [
          {
            list: [
              'Translate dense technical material into a readable flow without losing its scientific credibility.',
              'Present treatment evidence convincingly, since this is what weighs most heavily for buyers in a medical field.',
              'Guide visitors toward the same clear action from any page: contacting the team for further consultation.',
            ],
          },
        ],
      },
    ],
  },

  // 1172:18460 — three rows: the device, the site, and two treatment shots.
  {
    type: 'gallery',
    rows: [
      [
        img(overview01, 815, 820, 'The Jett Plasma pen in the hand'),
        group(595, 820, [
          at(0, 0, 595, 405, img(overview02, 595, 405, 'The site on a phone')),
          at(0, 415, 595, 405, img(overview03, 595, 405, 'A treatment in progress')),
        ]),
      ],
      [
        img(overview04, 1420, 1065, 'The landing page on a desktop screen'),
      ],
      [
        img(overview05, 523, 465, 'A before and after pair'),
        img(overview06, 887, 465, 'A treated eye area, close up'),
      ],
    ],
  },

  // 1172:18915
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'User Persona',
        body: [
          {
            paragraphs: [
              'Visitors here aren’t general consumers. They’re practitioners weighing an equipment purchase for their clinic.',
            ],
          },
        ],
      },
    ],
  },

  // 1172:18921 — Dr. Helena and Marco, one picture.
  {
    type: 'gallery',
    rows: [
      [
        img(persona01, 1420, 1274, 'Dr. Helena and Marco, the two research personas'),
      ],
    ],
  },

  // 1172:18941
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Challenge',
        body: [
          {
            paragraphs: [
              'From research and competitor analysis, three core problems needed to be addressed:',
            ],
          },
          {
            list: [
              'The technical content is too dense to stack in one place. The client’s material covered plasma physics, DC versus AC comparison, physiological effects on tissue, medical indications, clinical studies, a results gallery, a video library, and testimonials. Left unsorted, visitors would give up before reaching whatever they came for.',
              'The audience is skeptical of marketing language. Medical professionals judge claims by mechanism and evidence. The persuasive tone typical of landing pages risks undermining credibility with them.',
              'Visual evidence is hard to present fairly. Before-and-after photos are the strongest proof available, and also the easiest to doubt. Placed side by side, they make it difficult to compare the exact same area with any precision.',
            ],
          },
          {
            paragraphs: [
              'The key insight: this audience doesn’t need to be convinced, they need to be informed. The page’s job isn’t to sell, but to explain until readers reach the conclusion themselves.',
            ],
          },
        ],
      },
    ],
  },

  // 1229:30266 — the body and the map under it are one frame in the design.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Sitemap',
        body: [
          {
            paragraphs: [
              'Before touching layout, all client material was mapped and sorted into seven pages. The main page follows the questions forming in a reader’s head: what is this device, how is it different, what’s the proof, how does it work, what can it be used for, and who is behind it. Material too long to live there was given its own page: Videos, Studies, Testimonial, Before and After, and About Us, plus Contact Us as the final destination. This sorting also set two things that repeat across the site. The FAQ and the call to get in touch appear on every page carrying long-form material, so visitors landing from search on any page still find answers and a way forward. Studies and Videos point to each other as well, since both address the same doubt from different angles.',
            ],
          },
        ],
      },
    ],
  },

  // 1229:29855
  {
    type: 'gallery',
    rows: [
      [
        img(sitemap01, 1420, 1338, 'The seven pages, mapped'),
      ],
    ],
  },

  // 1172:19185
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Solutions',
        body: [
          {
            paragraphs: [
              'Because this audience judges by mechanism and evidence, the solutions focused on how the material is delivered: how easily the technical explanation can be followed, how convincingly the evidence is presented, and how comfortably material this dense holds up to the end.',
            ],
          },
          {
            list: [
              'Explain, Don’t Sell. The DC advantage isn’t listed as a feature but unpacked for what it means to the practitioner: lower complication risk and more predictable results in sensitive areas. How plasma works is broken into stages, each paired with a visual.',
              'Evidence as the Centerpiece. Treatment results occupy a primary part of the page, with a slider for examining the exact same area and a staged sequence running to three months. Each addresses a different doubt: precision of comparison, and consistency of results.',
              'Rhythm Over Density. Long text blocks are always broken by visuals, indications are split by procedure type, and overly specific questions moved into an accordion. Material still too long after that was given its own page.',
              'One Destination. All five pages funnel toward the same action: contacting the team. That call repeats at the close of every page, so visitors landing anywhere still have a way forward.',
            ],
          },
        ],
      },
    ],
  },

  // 1246:19323 — the landing page entire, inset 115 either side.
  {
    type: 'gallery',
    rows: [
      [
        group(1420, 10370.4091796875, [
          at(105, 0, 1210, 10370.4091796875, img(landing01, 1210, 10370.4091796875, 'The Jett Plasma landing page, top to bottom')),
        ]),
      ],
    ],
  },

  // 1232:30351 — again one frame: the body, then the screens 50 under it.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Responsive & Interaction',
        body: [
          {
            paragraphs: [
              'Every page was built at three screen sizes: 1440px, 744px, and 390px. Keeping them readable on small screens takes more than narrowing the columns. Layouts that alternate between text and image on desktop were restructured into vertical stacks, while the physiological effects that spread across the desktop as a cluster of pills became a stacked list. The before/after slider, FAQ accordion, mobile menu, and English/Czech language switcher were documented separately as interaction components so their behavior was unambiguous for developers.',
            ],
          },
        ],
      },
    ],
  },

  // 1232:30282
  {
    type: 'gallery',
    rows: [
      [
        img(responsive01, 1420, 865.1810913085938, 'The same page at 1440, 744 and 390'),
      ],
      [
        img(responsive02, 830, 780, 'The before and after slider'),
        img(responsive03, 580, 780, 'The FAQ accordion and the mobile menu'),
      ],
    ],
  },

  // 1246:19680 — and once more, the specimen 50 below its body.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Visual Direction',
        body: [
          {
            paragraphs: [
              'This page delivers medical material, so it needed to feel clean and trustworthy without turning sterile. Plus Jakarta Sans carries the typography across a wide range, from 70px for the main headline down to 18px for body text, creating firm contrast between big statements and long explanations. The palette rests on a deep charcoal for all text, comfortable to read over long stretches, with a bright light blue as the primary used sparingly on buttons, markers, and accents. A recurring curved line pattern adds character without interfering with legibility.',
            ],
          },
        ],
      },
    ],
  },

  // 1172:19712 — the specimen. Two columns in one group: the type and its
  // three swatches on the left, the mark and the pattern on the right.
  {
    type: 'gallery',
    rows: [
      [
        group(1420, 522, [
          at(0, 0, 705, 246, img(visualType, 705, 246, 'Plus Jakarta Sans, the interface typeface')),
          at(0, 256, 228.3333282470703125, 170, img(visualSw1, 228.3333282470703, 170, 'The deep charcoal the text rests on')),
          at(238.3333282470703125, 256, 228.333343505859375, 170, img(visualSw2, 228.33334350585938, 170, 'The light blue primary')),
          at(476.66668701171875, 256, 228.333343505859375, 170, img(visualSw3, 228.33334350585938, 170, 'The paper the pages are laid on')),
          at(715, 0, 170, 170, img(visualMark, 170, 170, 'The Jett Plasma mark')),
          at(715, 180, 705, 342, img(visualIllo, 705, 342, 'The curved line pattern')),
        ]),
      ],
    ],
  },

  // 1172:19817 — the last of the story; the Footer below it is the site’s own.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Result',
        body: [
          {
            paragraphs: [
              'Seven full pages across three breakpoints, along with all their interaction components, were delivered in under two weeks. Raw material that started as a collection of technical explanations became a structure that answers visitors’ questions in sequence, with supporting material too long to sit inline given a page of its own.',
              'But what matters more is the shift in how that material reaches readers. Explanations that previously required working through a technical document can now be followed while scrolling. Treatment evidence that usually amounts to photos placed side by side can now be compared precisely on the same area. And practitioners arriving with different questions, some looking for mechanism, some for clinical proof, some wanting to see results firsthand, each have a place to go rather than one long page to dig through.',
            ],
          },
        ],
      },
    ],
  },

]
