// The body of the Retune case study — Figma 686:2754, everything below the
// hero. The hero itself lives in the shared case-study database; this is the
// long-form story, kept as data so the page is a renderer rather than a wall
// of markup.
//
// Block shapes:
//   { type: 'divider' }                       full-bleed hairline
//   { type: 'prose', side, groups }           narrative, 30/36 headings
//   { type: 'caption', body }                 feature note, 20/28 heading
//   { type: 'gallery', rows }                 image rows
// A `caption` and the `gallery` under it are one section, 40 apart; every
// other section is 100 from its neighbours.
//
// Gallery images carry the width and height they have in the 1440 frame. The
// pair sets the aspect ratio and, within a row, how the width is split — the
// last row of The Result is 433.33 next to 886.67, not two equal halves.

import process01 from '../../assets/works/retune/process-01.png'
import process02 from '../../assets/works/retune/process-02.png'
import process03 from '../../assets/works/retune/process-03.png'
import challenge01 from '../../assets/works/retune/challenge-01.png'
import midfi01 from '../../assets/works/retune/midfi-01.png'
import generation01 from '../../assets/works/retune/generation-01.png'
import generation02 from '../../assets/works/retune/generation-02.png'
import generation03 from '../../assets/works/retune/generation-03.png'
import generation04 from '../../assets/works/retune/generation-04.png'
import automation01 from '../../assets/works/retune/automation-01.png'
import automation02 from '../../assets/works/retune/automation-02.png'
import automation03 from '../../assets/works/retune/automation-03.png'
import automation04 from '../../assets/works/retune/automation-04.png'
import dashboard01 from '../../assets/works/retune/dashboard-01.png'
import analytics01 from '../../assets/works/retune/analytics-01.png'
import editor01 from '../../assets/works/retune/editor-01.png'
import editor02 from '../../assets/works/retune/editor-02.png'
import result01 from '../../assets/works/retune/result-01.png'
import result02 from '../../assets/works/retune/result-02.png'
import result03 from '../../assets/works/retune/result-03.png'
import result04 from '../../assets/works/retune/result-04.png'

const img = (src, w, h, alt) => ({ src, w, h, alt })

export default [
  // 712:337
  { type: 'divider' },

  // 745:31295 — Overview and The Goals share one right-hand column, 60 apart.
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Overview',
        body: [
          {
            paragraphs: [
              'Content creators and marketing teams face the same problem every day: manually converting a single piece of content into different formats for different platforms. A 20-minute YouTube video can take an entire day just to be rewritten into a blog post, X/Twitter thread, Instagram caption, and newsletter, even though the core message is identical.',
              'Retune was built to solve this. An AI-powered platform that takes content from sources like YouTube and transforms it into 7 different formats: blogs, newsletters, LinkedIn posts, X/Twitter posts, Instagram posts, Facebook posts, and transcripts. The client came with a clear product vision but zero existing design. The entire user experience needed to be built from scratch in less than one month.',
            ],
          },
        ],
      },
      {
        heading: 'The Goals',
        body: [
          {
            list: [
              'Simplify content repurposing from a manual, hours-long workflow into an automated process that takes minutes.',
              'Build a centralized system where users can manage, track, and automate all their content from one place.',
              'Design an MVP mature enough to validate with early adopters and ready for the engineering team to develop.',
            ],
          },
        ],
      },
    ],
  },

  // 721:22328
  {
    type: 'gallery',
    rows: [
      [
        img(process01, 660, 660, 'Retune research and exploration board'),
        img(process02, 660, 660, 'Retune early concept exploration'),
      ],
      [img(process03, 1340, 1005, 'Retune design exploration overview')],
    ],
  },

  // 712:340
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Challenge',
        body: [
          { paragraphs: ['From research and competitor analysis, I identified three core problems that the product needed to address:'] },
          {
            list: [
              'Time-consuming repurposing process. Users had to rewrite content for each platform separately, adapting tone, format, and character limits every time. There was no fast way to turn one source into multiple outputs.',
              'No centralized system. Content was scattered across platforms with no single place to manage and track what had been repurposed and from which source. Users lost overview of their own content.',
              'Repetitive workflows that should be automated. Many creators routinely convert every new video into the same set of content (e.g. always blog + LinkedIn + Instagram), but had to do it one by one each time new content was published.',
            ],
          },
          {
            paragraphs: [
              'The key insight from this research: users don’t want to “create new content”; they want to “transform content that already exists.” This framing shift became the foundation for the entire design direction.',
            ],
          },
        ],
      },
    ],
  },

  // 712:298
  {
    type: 'gallery',
    rows: [[img(challenge01, 1340, 1059.306640625, 'Retune competitor and problem analysis')]],
  },

  // 721:31243
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'Middle-Fidelity',
        body: [
          {
            paragraphs: [
              'With a tight timeline, I chose to move straight into middle-fidelity so discussions with the client could be faster and more concrete. This stage was used to validate navigation structure, information hierarchy, and user flow before moving into visual detail. With the foundation agreed upon first, the transition to high-fidelity went smoothly without major rework.',
            ],
          },
        ],
      },
    ],
  },

  // 749:74435
  { type: 'gallery', rows: [[img(midfi01, 1340, 1005, 'Retune middle-fidelity wireframes')]] },

  // 749:74425
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Solutions',
        body: [
          { paragraphs: ['Each solution was designed to directly address the three problems identified above:'] },
          {
            list: [
              'Source-First Flow. Instead of starting from a blank page, every flow begins with source content selection (upload a file, paste a URL, or choose from YouTube integration). Users feel like they’re “transforming” something that already exists, not “writing from scratch.”',
              'Multi-Platform Generation. One source can be transformed into 7 different formats, each with a consistent layout but parameters tailored to its specific platform context.',
              'Automation-First. Automation is a first-class module, not a hidden feature. Users can create “automation recipes” that eliminate repetition entirely.',
            ],
          },
        ],
      },
    ],
  },

  // 753:74773
  {
    type: 'caption',
    heading: 'Content Generation',
    body: [
      {
        paragraphs: [
          'Users no longer need to rewrite content from scratch for every platform. Simply input one source, choose the target platform, and AI instantly generates content adapted to that platform’s format, tone, and context. Available for 7 platforms at once.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(generation01, 660, 660, 'Retune content generation form'),
        img(generation02, 660, 660, 'Retune generated blog output'),
      ],
      [
        img(generation03, 660, 660, 'Retune platform picker'),
        img(generation04, 660, 660, 'Retune generated social output'),
      ],
    ],
  },

  // 755:26685
  {
    type: 'caption',
    heading: 'Automation Workflow',
    body: [
      {
        paragraphs: [
          'Every time a creator uploads a new video, they used to repeat the same process: write a blog, draft a LinkedIn post, create an Instagram caption. With automation, that process only needs to be set up once. After that, every new piece of content is automatically repurposed without any manual effort.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(automation01, 660, 660, 'Retune automation list'),
        img(automation02, 660, 660, 'Retune automation settings'),
      ],
      [
        img(automation03, 660, 660, 'Retune automation source step'),
        img(automation04, 660, 660, 'Retune automation output step'),
      ],
    ],
  },

  // 779:39433
  {
    type: 'caption',
    heading: 'Content Dashboard',
    body: [
      {
        paragraphs: [
          'Previously, users lost track of which content had been repurposed and from which source. The dashboard gives them one place to view, search, and filter all generated content, so nothing falls through the cracks.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [[img(dashboard01, 1340, 840.1171875, 'Retune content dashboard')]],
  },

  // 755:33105
  {
    type: 'caption',
    heading: 'Analytics Dashboard',
    body: [
      {
        paragraphs: [
          'Creating content isn’t enough; users need to know whether their content is actually working. The Analytics Dashboard consolidates performance across all platforms into a single view: performance scores, follower growth, impressions, and engagement per platform. Without it, users would have to open each platform’s native dashboard one by one.',
          'What sets it apart is that it doesn’t stop at numbers. The AI Recommendation section translates data into concrete actions: which content types perform best, when to post, and how their performance compares to industry benchmarks. These recommendations connect directly to a “Create Content” button, so insights can be acted on immediately without switching context.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [[img(analytics01, 1340, 1273.26171875, 'Retune analytics dashboard')]],
  },

  // 755:39424
  {
    type: 'caption',
    heading: 'Content Editor',
    body: [
      {
        paragraphs: [
          'AI output is rarely perfect on the first try, and users still need control over what actually gets published. The Content Editor is where generated content can be reviewed, edited, and then published or scheduled. One place to close the loop from generation to going live.',
        ],
      },
    ],
  },
  {
    type: 'gallery',
    rows: [
      [
        img(editor01, 660, 660, 'Retune content editor'),
        img(editor02, 660, 660, 'Retune publish and schedule'),
      ],
    ],
  },

  // 797:46775 / 807:1199
  {
    type: 'prose',
    side: 'right',
    groups: [
      {
        heading: 'The Result',
        body: [
          {
            paragraphs: [
              'The complete product design, covering more than 40 unique screens with various states (empty, loading, filled, error, confirmation), was delivered in under one month. The client noted the result exceeded expectations, particularly in UX depth, as various edge cases were addressed during the design phase rather than added as afterthoughts during development.',
              'But more meaningful than the screen count is what changed for the people using it. A process that used to take a full day for a single video can now be done in minutes, and users no longer need to open seven different platforms to write, publish, and monitor their content. With automation, time that used to disappear into repetitive work goes back into what actually matters: making new content.',
            ],
          },
        ],
      },
    ],
  },

  // 797:50034 / 807:972
  {
    type: 'gallery',
    rows: [
      [
        img(result01, 660, 660, 'Retune final screens'),
        img(result02, 660, 660, 'Retune final screens'),
      ],
      [
        img(result03, 433.3333435058594, 660, 'Retune mobile view'),
        img(result04, 886.6666259765625, 660, 'Retune per-platform performance cards'),
      ],
    ],
  },
]
