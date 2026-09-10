// The body of the Catatmak case study — Figma 855:20535, everything below the
// hero. The hero itself lives in the shared case-study database; this is the
// long-form story, kept as data so the page is a renderer rather than a wall
// of markup. Block shapes and spacing rules are documented in retune.js.
//
// Gallery images carry the width and height they have in the 1440 frame. The
// pair sets the aspect ratio and, within a row, how the width is split — the
// Overview row is 900 beside 510, not two equal halves.
//
// Every frame the design names "Image" is exported as a flat asset rather than
// rebuilt in markup, so the persona cards, the flow diagram and the type
// specimen all arrive as pictures.

import overview01 from '../../assets/works/catatmak/overview-01.jpg'
import overviewTile from '../../assets/works/catatmak/overview-tile.jpg'
import overview02 from '../../assets/works/catatmak/overview-02.png'
import overview03 from '../../assets/works/catatmak/overview-03.jpg'
import persona01 from '../../assets/works/catatmak/persona-01.jpg'
import persona02 from '../../assets/works/catatmak/persona-02.jpg'
import challenge01 from '../../assets/works/catatmak/challenge-01.jpg'
import flow01 from '../../assets/works/catatmak/flow-01.png'
import wireframe01 from '../../assets/works/catatmak/wireframe-01.jpg'
import onboarding01 from '../../assets/works/catatmak/onboarding-01.jpg'
import onboarding02 from '../../assets/works/catatmak/onboarding-02.jpg'
import onboarding03 from '../../assets/works/catatmak/onboarding-03.jpg'
import onboarding04 from '../../assets/works/catatmak/onboarding-04.jpg'
import home01 from '../../assets/works/catatmak/home-01.jpg'
import home02 from '../../assets/works/catatmak/home-02.jpg'
import receipt01 from '../../assets/works/catatmak/receipt-01.jpg'
import receipt02 from '../../assets/works/catatmak/receipt-02.jpg'
import manual01 from '../../assets/works/catatmak/manual-01.jpg'
import split01 from '../../assets/works/catatmak/split-01.jpg'
import split02 from '../../assets/works/catatmak/split-02.jpg'
import split03 from '../../assets/works/catatmak/split-03.jpg'
import split04 from '../../assets/works/catatmak/split-04.png'
import reports01 from '../../assets/works/catatmak/reports-01.jpg'
import reports02 from '../../assets/works/catatmak/reports-02.jpg'
import notifications01 from '../../assets/works/catatmak/notifications-01.jpg'
import profile01 from '../../assets/works/catatmak/profile-01.jpg'
import profile02 from '../../assets/works/catatmak/profile-02.jpg'
import profile03 from '../../assets/works/catatmak/profile-03.jpg'
import visualType from '../../assets/works/catatmak/visual-type.png'
import visualSw1 from '../../assets/works/catatmak/visual-sw1.png'
import visualSw2 from '../../assets/works/catatmak/visual-sw2.png'
import visualSw3 from '../../assets/works/catatmak/visual-sw3.png'
import visualLogo from '../../assets/works/catatmak/visual-logo.jpg'
import visualIllo from '../../assets/works/catatmak/visual-illo.jpg'
import visual02 from '../../assets/works/catatmak/visual-02.jpg'

// `offsetTop` is how far the cell hangs below the top of its row in the 1440
// frame; the renderer applies it on desktop only.
const img = (src, w, h, alt, offsetTop) => ({ src, w, h, alt, offsetTop })

// A group is one cell holding several pictures. Children carry the x/y/w/h they
// have inside the group in the 1440 frame, so a nested block reads exactly as
// drawn — and each picture stays its own thing: separately zoomable, and on a
// phone it gets a line to itself instead of shrinking inside a flattened slab.
const group = (w, h, items, keep = false) => ({ w, h, items, keep })
const at = (x, y, w, h, cell) => ({ ...cell, x, y, w, h })

export default [
  // 855:20660
  { type: 'divider' },

  // 870:2765 — Overview and The Goals share one right-hand column.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Overview',
        body: [
          {
            paragraphs: [
              'Everyone knows tracking their finances matters, yet almost no one does it consistently. The problem isn’t intention, it’s friction. Most existing apps require filling in multiple fields for a single transaction, which becomes exhausting when it needs to happen several times a day. The result is predictable: enthusiastic use in week one, abandoned by week two.',
              'Catatmak was built on a different assumption. What needed to be designed wasn’t the app with the most features, but the app light enough to become a habit. Inside the app, logging can be done by simply photographing a receipt. Outside it, transactions can also be recorded through a WhatsApp message that syncs straight into the app. Beyond that, it also handles the social side of everyday money through its split bill feature.',
            ],
          },
        ],
      },
      {
        heading: 'The Goals',
        body: [
          {
            list: [
              'Reduce recording friction as much as possible, to the point where users don’t even need to open the app to log a transaction.',
              'Address bill splitting, which had been handled manually through chats and separate calculations.',
              'Help users understand their financial situation without having to interpret raw numbers.',
            ],
          },
        ],
      },
    ],
  },

  // 870:2774 — 952:2676 beside 952:2815, an uneven 900/510 split.
  {
    type: 'gallery',
    rows: [
      [
        // 952:2676. The two tiles left of the logo are empty white frames in the
        // design, so nothing is rendered for them — drawing them would only add
        // blank squares you could click on.
        group(900, 966.6666870117188, [
          at(613.3333740234375, 0, 286.66668701171875, 286.66668701171875,
            img(overviewTile, 286.66668701171875, 286.66668701171875, 'Catatmak app mark')),
          at(0, 296.66668701171875, 900, 670,
            img(overview01, 900, 670, 'Catatmak logging a transaction over WhatsApp')),
        ], true),
        // 952:2815 — two pictures with 10 between them, and the run of empty
        // below is what squares this column off against the 967 beside it.
        group(510, 966.6666870117188, [
          at(0, 0, 510, 510, img(overview02, 510, 510, 'Catatmak first-time logging prompt')),
          at(0, 520, 510, 250, img(overview03, 510, 250, 'Catatmak quick entry bar')),
        ]),
      ],
    ],
  },

  // 925:4299
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'User Persona',
        body: [
          {
            paragraphs: [
              'Research narrowed user needs down to two profiles with fundamentally different relationships to money.',
            ],
          },
        ],
      },
    ],
  },

  // 925:4313 — both cards are "Image" frames, so they ship as exports.
  {
    type: 'gallery',
    rows: [
      [img(persona01, 1420, 554, 'Rayhan, 26, office worker — persona card')],
      [img(persona02, 1420, 528, 'Dina, 24, fresh graduate — persona card')],
    ],
  },

  // 870:2779
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Challenge',
        body: [
          { paragraphs: ['From research and competitor analysis, three core problems needed to be addressed:'] },
          {
            list: [
              'Recording feels like a chore. The more steps required to log a single transaction, the more likely users abandon it midway. Recording usually happens in between other activities, while existing apps demand detailed input from the start.',
              'Bill splitting lives outside finance apps. Splitting a bill with friends is an extremely common financial activity, yet it’s almost always handled separately through chats, calculators, and memory. Nothing gets recorded, and it often ends with forgotten debts.',
              'Recorded data doesn’t mean anything. Even users who manage to log consistently often stop at the numbers. They know how much they spent, but not what it means, whether it’s reasonable, or what needs to change.',
            ],
          },
          {
            paragraphs: [
              'The key insight from this research: the biggest barrier isn’t understanding, it’s habit. Users don’t need more sophisticated features; they need a process light enough and pleasant enough to repeat every single day.',
            ],
          },
        ],
      },
    ],
  },

  // 870:2787
  {
    type: 'gallery',
    rows: [[img(challenge01, 1420, 900, 'Catatmak competitor and problem analysis')]],
  },

  // 975:39524
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

  // 997:11019
  {
    type: 'gallery',
    rows: [[img(flow01, 1420, 1180, 'Catatmak user flow diagram')]],
  },

  // 975:10488
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Wireframe',
        body: [
          {
            paragraphs: [
              'Once the flows were agreed on, every screen was laid out as wireframes to test information hierarchy before moving into the final interface. This stage was used to make sure the most frequently used actions sat within easiest reach, and that dense screens like split bill details stayed readable without overwhelming the user. With the structure tested first, building the final interface happened without major rework.',
            ],
          },
        ],
      },
    ],
  },

  // 975:36145
  {
    type: 'gallery',
    rows: [[img(wireframe01, 1420, 820, 'Catatmak wireframes across the core flows')]],
  },

  // 870:2797
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Solutions',
        body: [
          {
            list: [
              'Low-Friction Recording. Recording is offered through several paths with different levels of effort: receipt scanning for shopping transactions, manual input for everything else, and WhatsApp logging for users who can’t even spare the time to open the app. Users choose based on context rather than being forced into one path.',
              'Social Finance. Split bills were elevated into a core feature with its own navigation, rather than just a transaction category. The full cycle was designed end to end: creating a split, assigning items, confirming payments, and settling up.',
              'Personality as Retention. Finance apps tend to feel rigid and judgmental. Catatmak was deliberately designed with a warm, playful tone, so opening the app feels light rather than like being audited.',
            ],
          },
        ],
      },
    ],
  },

  // 870:2804
  {
    type: 'caption',
    heading: 'Onboarding & Sign In',
    body: [
      {
        paragraphs: [
          'First impressions decide whether users continue or drop off. Onboarding was kept brief, explaining only the core value without holding users up. To sign in, users simply enter their WhatsApp number and a verification code, with no new password to create and inevitably forget. Choosing the WhatsApp number here wasn’t just about easier signup. That number becomes the bridge for logging via messages, so one step at the start opens a channel used continuously afterward.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [img(onboarding01, 1420, 660, 'Catatmak onboarding screens')],
      // 1010:24371 — one wide shot beside a column of two.
      [
        group(1420, 744, [
          at(0, 0, 900, 744, img(onboarding02, 900, 744, 'Catatmak sign in screen')),
          at(910, 0, 510, 323, img(onboarding03, 510, 323, 'Catatmak country code picker')),
          at(910, 333, 510, 411, img(onboarding04, 510, 411, 'Catatmak verification code entry')),
        ]),
      ],
    ],
  },

  // 1010:24246
  {
    type: 'caption',
    heading: 'Home',
    body: [
      {
        paragraphs: [
          'People rarely open a finance app without a reason. The home screen was designed to provide one: a summary of today’s transactions, an alert when spending spikes in a particular category, and a greeting that changes daily. Rather than displaying raw numbers, the app translates them into sentences users immediately understand. For users with nothing logged yet, home appears with guidance pointing them toward their first transaction rather than just an empty page.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(home01, 705, 705, 'Catatmak home screen with the daily summary'),
        img(home02, 705, 705, 'Catatmak home screen with a spending alert'),
      ],
    ],
  },

  // 945:2347
  {
    type: 'caption',
    heading: 'Receipt Scan',
    body: [
      {
        paragraphs: [
          'Retyping the contents of a shopping receipt is what makes most users give up. Just photograph the receipt, and the system parses it into itemized entries with their amounts. Scanned results can be edited if anything is off, so automation never comes at the cost of user control.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(receipt01, 705, 660, 'Catatmak scanning a receipt'),
        img(receipt02, 705, 660, 'Catatmak parsed receipt items'),
      ],
    ],
  },

  // 923:4287. The wrapper frame is 1440 wide but the picture inside it is the
  // usual 1420 — exporting the wrapper carried its 10-unit inset in as white.
  {
    type: 'caption',
    heading: 'Manual Recording',
    body: [
      {
        paragraphs: [
          'Not every transaction comes with a receipt, and not every user wants to rely on automation. Manual entry remains available with a form designed to be as brief as possible: amount, category, and a short note. Every logged transaction can also be viewed in detail, edited, or deleted if something was wrong.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [[img(manual01, 1420, 820, 'Catatmak manual entry and transaction detail')]],
  },

  // 870:2818
  {
    type: 'caption',
    heading: 'Split Bill',
    body: [
      {
        paragraphs: [
          'Splitting bills with friends used to be handled through chats and manual math, often ending with forgotten debts. With this feature, a receipt can be scanned directly, items assigned to each person, and payment status tracked until fully settled, complete with confirmation from both sides.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      // 960:4828 — same shape as the onboarding row.
      [
        group(1420, 744, [
          at(0, 0, 900, 744, img(split01, 900, 744, 'Catatmak split bill in use')),
          at(910, 0, 510, 250, img(split03, 510, 250, 'Catatmak assigning items to friends')),
          at(910, 260, 510, 484, img(split04, 510, 484, 'Catatmak split bill summary')),
        ]),
      ],
      [img(split02, 1420, 660, 'Catatmak split bill assignment and settlement')],
    ],
  },

  // 974:8711
  {
    type: 'caption',
    heading: 'Reports & Budget Planning',
    body: [
      {
        paragraphs: [
          'Recording alone isn’t enough if users don’t know where their money went. Reports summarize the current month’s income and expenses alongside a comparison to the previous month, complete with full transaction history and an option to download reports by period. But looking backward isn’t enough on its own. Through budget planning, users can set a monthly allocation plan upfront, then track how far actual spending drifts from that plan. This is where logging changes purpose: from a passive archive into a tool for control.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(reports01, 705, 705, 'Catatmak monthly report'),
        img(reports02, 705, 705, 'Catatmak budget allocation'),
      ],
    ],
  },

  // 870:2832
  {
    type: 'caption',
    heading: 'Notifications',
    body: [
      {
        paragraphs: [
          'Split bills only work when everyone knows what they need to do. Notifications keep that flow moving, from new bill alerts and payment confirmations to reminders for anything still outstanding.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [[img(notifications01, 1420, 705, 'Catatmak split bill notifications')]],
  },

  // 997:11613
  {
    type: 'caption',
    heading: 'Profile',
    body: [
      {
        paragraphs: [
          'Everyone groups their spending differently, and default categories will never fit everyone. Through Transaction Categories, users can add and edit their own categories complete with emoji markers, so logging follows their habits rather than the other way around. Beyond that, the profile page holds account settings and the channels back to the team: changing name, photo, and WhatsApp number, leaving a review, reading the FAQ, sending feedback, and sharing the app with friends. That last one isn’t incidental, since split bills work best when a user’s friends are on the same app.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(profile01, 705, 810, 'Catatmak profile and account settings'),
        // 997:11693 — a column of two.
        group(705, 810, [
          at(0, 0, 705, 400, img(profile02, 705, 400, 'Catatmak custom transaction categories')),
          at(0, 410, 705, 400, img(profile03, 705, 400, 'Catatmak account settings')),
        ]),
      ],
    ],
  },

  // 997:13626
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Visual Direction',
        body: [
          {
            paragraphs: [
              'Finance apps slip easily into feeling cold, and Catatmak’s visual direction was built to counter that. SF Pro Display was chosen for its numeral clarity across sizes, which matters for an app where nearly every screen carries an amount. The palette rests on deep blue as the primary for a sense of stability and trust, balanced by pastel blue as background and pastel yellow as an accent that keeps the mood warm. Illustrations and the Mamih character were created by an illustrator on the team, while I determined their placement and the tone each moment should carry.',
            ],
          },
        ],
      },
    ],
  },

  // 997:15042
  {
    type: 'gallery',
    rows: [
      [
        // 1010:23873 — the specimen, three swatches (20 apart, not 10), then the
        // mark beside the illustration.
        group(705, 956, [
          at(0, 0, 705, 241, img(visualType, 705, 241, 'Catatmak type specimen, SF Pro Display')),
          at(0, 251, 228.3333282470703, 170, img(visualSw1, 228.3333282470703, 170, 'Catatmak primary blue, 003774')),
          at(238.33331298828125, 251, 228.33334350585938, 170, img(visualSw2, 228.33334350585938, 170, 'Catatmak accent blue, 3497F9')),
          at(476.66668701171875, 251, 228.33334350585938, 170, img(visualSw3, 228.33334350585938, 170, 'Catatmak accent yellow, FBD769')),
          at(0, 431, 170, 170, img(visualLogo, 170, 170, 'Catatmak app mark')),
          at(180, 431, 525, 525, img(visualIllo, 525, 525, 'Catatmak illustration and the Mamih character')),
        ], true),
        img(visual02, 705, 705, 'Catatmak illustration and character direction', 100),
      ],
    ],
  },

  // 870:2861
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Result',
        body: [
          {
            paragraphs: [
              'The complete app design was delivered in one month and is now live on the Play Store. Deliverables included user flows, full designs from onboarding through every core feature and its various states, and a component system used consistently throughout the app.',
              'But more meaningful than the screen count is what changed for the people using it. Recording a transaction that once required lengthy input now takes a single photo of a receipt, and when there isn’t even time to open the app, a single WhatsApp message will do. Split bills that used to end as forgotten debts now leave a clear trail until settled. And spending that used to be just a column of numbers now arrives as a sentence that tells users exactly what’s happening with their money.',
            ],
          },
        ],
      },
    ],
  },
]
