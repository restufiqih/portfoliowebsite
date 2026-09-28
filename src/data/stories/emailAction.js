// The body of the Email Action case study — Figma 1038:12171, everything below
// the hero. The hero itself lives in the shared case-study database; this is the
// long-form story, kept as data so the page is a renderer rather than a wall of
// markup. Block shapes and spacing rules are documented in retune.js.
//
// Straight apostrophes in the source have been set as U+2019, which is what the
// other two written case studies use throughout.
//
// Gallery images carry the width and height they have in the 1440 frame. The
// pair sets the aspect ratio and, within a row, how the width is split.
//
// Every frame the design names "Image" is exported as a flat asset rather than
// rebuilt in markup, so the persona cards, the flow diagram and the type
// specimen all arrive as pictures.

import mockup01 from '../../assets/works/email-action/mockup-01.jpg'
import mockup02 from '../../assets/works/email-action/mockup-02.jpg'
import mockup03 from '../../assets/works/email-action/mockup-03.jpg'
import features01 from '../../assets/works/email-action/features-01.jpg'
import mockup04 from '../../assets/works/email-action/mockup-04.png'
import mockup05 from '../../assets/works/email-action/mockup-05.jpg'
import persona01 from '../../assets/works/email-action/persona-01.jpg'
import personaCompact from '../../assets/works/email-action/persona-compact.jpg'
import challenge01 from '../../assets/works/email-action/challenge-01.jpg'
import flow01 from '../../assets/works/email-action/flow-01.png'
import wireframe01 from '../../assets/works/email-action/wireframe-01.jpg'
import signup01 from '../../assets/works/email-action/signup-01.jpg'
import signup02 from '../../assets/works/email-action/signup-02.png'
import signup03 from '../../assets/works/email-action/signup-03.jpg'
import signup04 from '../../assets/works/email-action/signup-04.jpg'
import dashboard01 from '../../assets/works/email-action/dashboard-01.png'
import dashboard02 from '../../assets/works/email-action/dashboard-02.jpg'
import rules01 from '../../assets/works/email-action/rules-01.jpg'
import rules02 from '../../assets/works/email-action/rules-02.jpg'
import rules03 from '../../assets/works/email-action/rules-03.jpg'
import rules04 from '../../assets/works/email-action/rules-04.png'
import rules05 from '../../assets/works/email-action/rules-05.jpg'
import senders01 from '../../assets/works/email-action/senders-01.png'
import senders02 from '../../assets/works/email-action/senders-02.png'
import senders03 from '../../assets/works/email-action/senders-03.jpg'
import senders04 from '../../assets/works/email-action/senders-04.jpg'
import senders05 from '../../assets/works/email-action/senders-05.jpg'
import history01 from '../../assets/works/email-action/history-01.jpg'
import visualMark from '../../assets/works/email-action/visual-mark.jpg'
import visualIllo from '../../assets/works/email-action/visual-illo.jpg'
import visualType from '../../assets/works/email-action/visual-type.png'
import visualSw1 from '../../assets/works/email-action/visual-sw1.png'
import visualSw2 from '../../assets/works/email-action/visual-sw2.png'
import visualLogo from '../../assets/works/email-action/visual-logo.jpg'

// `offsetTop` is how far the cell hangs below the top of its row in the 1440
// frame; the renderer applies it on desktop only.
const img = (src, w, h, alt, offsetTop) => ({ src, w, h, alt, offsetTop })

// A group is one cell holding several pictures. Children carry the x/y/w/h they
// have inside the group in the 1440 frame, so a nested block reads exactly as
// drawn — and each picture stays its own thing: separately zoomable, and on a
// phone it gets a line to itself instead of shrinking inside a flattened slab.
const group = (w, h, items, keep = false) => ({ w, h, items, keep })
const at = (x, y, w, h, cell) => ({ ...cell, x, y, w, h })

// A picture the design draws twice, once for each frame: the wide asset, and
// the one that replaces it below desktop. The narrow one is its own drawing
// rather than the same artwork reflowed, so it carries its own size.
const withCompact = (cell, src, w, h) => ({ ...cell, compact: { src, w, h } })

export default [
  // 1038:12297
  { type: 'divider' },

  // 1038:12298 — Overview and The Goals share one right-hand column.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Overview',
        body: [
          {
            paragraphs: [
              'A cluttered inbox is rarely caused by one big email. It’s caused by hundreds of small ones arriving continuously: promotions, newsletters, app notifications, recurring bills. Most people deal with it the most exhausting way possible, clearing them one by one, over and over, never actually finishing. Email Action was designed to break that cycle. Instead of cleaning up email that has already piled up, users set rules that work automatically on everything arriving next. They connect an email account, see who sends them the most, then decide what should happen to mail from those senders.',
            ],
          },
        ],
      },
      {
        heading: 'The Goals',
        body: [
          {
            list: [
              'Shift how users handle email, from manual cleanup to setting rules that run on their own.',
              'Make automated rules understandable to ordinary users, not just those comfortable with email filters.',
              'Give users a clear picture of what’s actually filling their inbox, along with the control to act on it.',
            ],
          },
        ],
      },
    ],
  },

  // 1148:33785 — three rows of product shots.
  {
    type: 'gallery',
    rows: [
      [
        img(mockup01, 897, 573, 'Email Action marketing page'),
        group(513, 573, [
          at(0, 0, 513, 271.5, img(mockup02, 513, 271.5, 'Email Action inbox summary')),
          at(0, 282, 513, 291.5, img(mockup03, 513, 291.5, 'Email Action rule card')),
        ]),
      ],
      [
        img(features01, 1420, 524, 'The three things Email Action promises'),
      ],
      [
        img(mockup04, 705, 440, 'Email Action clearing a folder'),
        img(mockup05, 705, 440, 'Email Action in the browser'),
      ],
    ],
  },

  // 1038:12762
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'User Persona',
        body: [
          {
            paragraphs: [
              'Research narrowed down to two user profiles with different sources of the same problem.',
            ],
          },
        ],
      },
    ],
  },

  // 1038:12768
  {
    type: 'gallery',
    rows: [
      [
        // 1038:12769 at 1440, 1152:54267 at 390. One picture again rather than
        // the two it was briefly split into. The two cards overlap on purpose
        // -- Sarah's photograph is set above her own card and rises over
        // David's -- and the narrow frame redraws the block rather than
        // reflowing it, so each width is given the asset drawn for it instead
        // of one being made to stand in for the other.
        withCompact(
          img(persona01, 1420, 1318, 'David and Sarah, the two research personas'),
          personaCompact, 358, 342.35211181640625,
        ),
      ],
    ],
  },

  // 1038:12788
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
              'Inbox cleanup is work that never ends. However many emails get deleted today, more arrive tomorrow. Users need something that works forward, not just clears what’s already there.',
              'Built-in filters are too technical. Nearly every email provider already offers rules, yet they go unused because the interface feels like assembling logical conditions. Users give up before finishing their first rule.',
              'Users don’t know what’s filling their inbox. Without a view of who sends the most and how much arrives from each, there’s no obvious place to start.',
            ],
          },
          {
            paragraphs: [
              'The key insight from this research: users have no trouble understanding automated rules; they have trouble creating them. The problem lies in how rules are assembled, not in the concept itself.',
            ],
          },
        ],
      },
    ],
  },

  // 1148:33835
  {
    type: 'gallery',
    rows: [
      [
        img(challenge01, 1420, 860, 'Email Action on a desktop screen'),
      ],
    ],
  },

  // 1038:12805
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'User Flow',
        body: [
          {
            paragraphs: [
              'All user flows were mapped before moving into design. This mapping determined where the process could be trimmed and where users actually needed confirmation.',
            ],
          },
        ],
      },
    ],
  },

  // 1038:12811 — the whole flow diagram, exported flat.
  {
    type: 'gallery',
    rows: [
      [
        img(flow01, 1420, 1460, 'The full Email Action user flow'),
      ],
    ],
  },

  // 1038:13023
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Wireframe',
        body: [
          {
            paragraphs: [
              'Once the flows were agreed on, every screen was laid out as wireframes to test information hierarchy before moving into the final interface. The most attention went to data-dense pages like the sender list and rule details, keeping them readable even when holding many rows at once.',
            ],
          },
        ],
      },
    ],
  },

  // 1038:13029
  {
    type: 'gallery',
    rows: [
      [
        img(wireframe01, 1420, 836.5380859375, 'Wireframes for the sender list and rule details'),
      ],
    ],
  },

  // 1038:13032
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Solutions',
        body: [
          {
            paragraphs: [
              'Since the problem lies in how rules are assembled rather than in the concept itself, the solutions focus on lowering the barrier at three points: how a rule gets built, where users begin, and how they come to trust the result.',
            ],
          },
          {
            list: [
              'Rules as Guided Steps. Rule creation was broken into sequential steps rather than one long form of conditions. Users answer one question at a time, so a technically complex rule feels simple to assemble.',
              'Senders as the Starting Point. Instead of asking users to imagine a rule from nothing, the product starts from the real senders already in their inbox. Rules emerge from something concrete rather than a blank page.',
              'Visible Consequences. Every automated action leaves a trace users can inspect through History. This matters because people only trust an automated system with their inbox once they can see what it has actually done.',
            ],
          },
        ],
      },
    ],
  },

  // 1038:13413
  {
    type: 'caption',
    heading: 'Sign Up & Log In',
    body: [
      {
        paragraphs: [
          'Registration was designed to merge with linking the first email account, since the app isn’t useful until an account is connected. Beyond standard flows like signing in and password recovery, every possible failure is handled with a specific message, from malformed email addresses and mismatched passwords to IMAP configurations that fail to connect.',
        ],
      },
    ],
  },

  // 1124:21820 — an uneven 900/510 split, twice.
  {
    type: 'gallery',
    rows: [
      [
        img(signup01, 900, 780, 'Email Action sign up'),
        img(signup02, 510, 780, 'Email Action linking a first account'),
      ],
      [
        img(signup03, 900, 552, 'Email Action log in'),
        img(signup04, 510, 552, 'Email Action password recovery'),
      ],
    ],
  },

  // 1038:13039
  {
    type: 'caption',
    heading: 'Dashboard',
    body: [
      {
        paragraphs: [
          'Before taking action, users need to know what’s happening. The dashboard shows an overview of connected inboxes, and for users with several accounts, the data can be filtered per account. For new users with no data yet, the view points them toward the first step they need to take.',
        ],
      },
    ],
  },

  // 1096:108161
  {
    type: 'gallery',
    rows: [
      [
        img(dashboard01, 705, 603.125, 'Email Action dashboard'),
        img(dashboard02, 705, 603.125, 'Email Action dashboard with no data yet'),
      ],
    ],
  },

  // 1038:13184
  {
    type: 'caption',
    heading: 'Rules',
    body: [
      {
        paragraphs: [
          'This is what stops the work from repeating. Users define once what should happen to mail from a given sender, whether moved to a folder, labeled, archived, or deleted, and the rule then runs on its own for everything that follows. Rules can be deactivated temporarily without deleting them, so users can experiment without losing their configuration.',
        ],
      },
    ],
  },

  // 1127:27638
  {
    type: 'gallery',
    rows: [
      [
        img(rules01, 705, 603.125, 'Email Action choosing a sender for a rule'),
        img(rules02, 705, 603.125, 'Email Action choosing what the rule does'),
      ],
      [
        img(rules03, 705, 603.125, 'Email Action rule summary'),
        img(rules04, 705, 603.125, 'Email Action rule list'),
      ],
      [
        img(rules05, 1420, 875, 'Email Action rule details'),
      ],
    ],
  },

  // 1038:13106
  {
    type: 'caption',
    heading: 'Senders & Segments',
    body: [
      {
        paragraphs: [
          'The root of a cluttered inbox is senders, not individual emails. The Senders page shows exactly who is sending mail, turning a pattern that was previously invisible into something obvious. Senders can be grouped into segments so a set of similar senders is handled at once, or acted on directly through unsubscribe.',
        ],
      },
    ],
  },

  // 1135:17173
  {
    type: 'gallery',
    rows: [
      [
        img(senders01, 705, 603.125, 'Email Action sender list'),
        img(senders02, 705, 603.125, 'Email Action sender details'),
      ],
      [
        img(senders03, 1420, 875, 'Email Action segments'),
      ],
      [
        img(senders04, 705, 603.125, 'Email Action creating a segment'),
        img(senders05, 705, 603.125, 'Email Action unsubscribing from a sender'),
      ],
    ],
  },

  // 1038:13203
  {
    type: 'caption',
    heading: 'History',
    body: [
      {
        paragraphs: [
          'Handing the inbox over to automation requires trust, and that trust only grows when users can check the results. History records every action carried out along with its details, letting users confirm their rules are working as intended.',
        ],
      },
    ],
  },

  // 1139:21979
  {
    type: 'gallery',
    rows: [
      [
        img(history01, 1420, 875, 'Email Action history of every automated action'),
      ],
    ],
  },

  // 1038:13553
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Visual Direction',
        body: [
          {
            paragraphs: [
              'An app that handles someone’s inbox needs to feel trustworthy without feeling tense. SF Pro Display carries the interface on a tight scale, from small supporting data up to headings, keeping hierarchy clear on data-dense pages. The palette rests on black for text and primary elements, giving the interface a firm, legible base that holds up across information-heavy views. Pastel green works as the accent, marking actions and running states, soft enough to keep things light without losing its function as a signal. Every visual decision was structured as a design system rather than applied page by page. Color, typography, and corner radii were defined as tokens with structured naming, so a single change propagates across the entire app. On top of that sits a set of reusable components, from input fields and tables to dialogs and navigation, each with its full range of variants. This mattered because the product was built by several designers at once: a shared system kept the output consistent across many hands while speeding up handoff to the development team.',
            ],
          },
        ],
      },
    ],
  },

  // 1038:13559 — the specimen. Two columns of unequal height: the left runs
  // the full 1025, the right stops at 919.
  {
    type: 'gallery',
    rows: [
      [
        group(705, 1025, [
          at(535, 140, 170, 170, img(visualMark, 170, 170, 'Email Action app mark')),
          at(0, 320, 705, 705, img(visualIllo, 705, 705, 'Email Action empty state illustration')),
        ]),
        group(705, 919, [
          at(0, 0, 705, 241, img(visualType, 705, 241, 'SF Pro Display, the interface typeface')),
          at(0, 251, 347.5, 170, img(visualSw1, 347.5, 170, 'The pastel green accent')),
          at(358, 251, 347.5, 170, img(visualSw2, 347.5, 170, 'The near-black the palette rests on')),
          at(0, 431, 488, 488, img(visualLogo, 488, 488, 'The Email Action logo')),
        ]),
      ],
    ],
  },

  // 1038:13664 — the last of the story; the Footer below it is the site's own.
  // One text node in the frame, taken as two paragraphs at the turn the other
  // two studies break on, where the delivery gives way to what changed for the
  // people using it.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Result',
        body: [
          {
            paragraphs: [
              'The complete app design was delivered in under one month. Its coverage went beyond the happy path: every module includes empty states, loading states, empty search results, and error states specific to each type of failure, so the development team never had to guess when encountering conditions outside the main scenario.',
              'But what matters more is the shift in working method it offers users. Inbox cleanup that used to be endless repetitive work is now settled once through rules that keep running. Senders that were only ever felt as noise are now visible as a list that can be acted on. And every automated action leaves a trace that can be inspected, so users keep control of the inbox they’ve handed over to the system.',
            ],
          },
        ],
      },
    ],
  },
]
