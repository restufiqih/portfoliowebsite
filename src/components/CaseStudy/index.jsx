import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Navbar from '../Navbar'
import FooterWash from '../FooterWash'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluidBetween, fluidSpace, fluidType, scaleCompact } from '../../utils/fluid'
import { getStory } from '../../data/stories'

// The Retune detail page. Two frames are drawn — 1440 (Figma 686:2754) and 390
// (807:844) — and the page is built the way every section of the landing page
// is: desktop interpolates between a 1024 figure and the 1440 one, and below
// that a value is the 390 frame's own figure at 390, growing with the viewport
// all the way to 1024. Sizes still step at 1024 — the layout changes there too,
// from one column to two — but nothing is flat in between.

// Which step of the shared scale in utils/fluid each piece sits on. `mobile` is
// the 390 frame's own pair, which tablet grows from. Every tracked size here is
// the same -2%, so it is an em and stays correct at whatever the ramp resolves
// to.
const TRACKING = '-0.02em'
const TYPE = {
  // 40/46 at 1440 (686:2851), 30/36 at 390 (807:826).
  headline: { size: 40, line: 46, mobile: [30, 36], tracked: true },
  // 30/36 at 1440 (745:31315), 24/34 at 390 (807:1144).
  heading: { size: 30, line: 36, mobile: [24, 34], tracked: true },
  subheading: { size: 20, line: 28, mobile: [20, 28], tracked: true },
  body: { size: 16, line: 22, mobile: [16, 22], tracked: false },
  // Already at the scale's floor; it holds on every frame.
  chip: { size: 14, line: 20, mobile: [14, 20], tracked: true },
}

// Desktop only: the hero fills the viewport, with the header band at the top,
// the 50 foot the frame carries held back, and the row centred in what is left.
// At the design's own 790px frame that reproduces it exactly (636 of room, the
// 520 column centred with 58 above and below). The 390 frame is not a viewport
// tall — it simply runs to its content.
const VIEWPORT = '100vh'
const HERO_TOP_MOBILE = 30

// The navbar renders absolutely positioned, so the hero reserves the header
// band itself. Flat pixels, because the navbar's own height is.
const HEADER_H = 104
const HEADER_H_MOBILE = 74

// Frame 686:2833 — the desktop copy column, flat 460 at 1440.
const COLUMN_W = 460

// Widest the content ever gets, matching the wrapper the landing page uses.
const CONTENT_MAX = 1440

// Side padding. 50 at 1440 and 16 at 390, running as one ramp in between so
// there is no step at the tablet breakpoint; 53.33 is where the compact ramp
// tops out at 1024, and it passes through ~38 at 768 — the inset the landing
// page gives its tablet content.
const SIDE_PAD = 50
const SIDE_PAD_MOBILE = 16
const SIDE_PAD_COMPACT_MAX = 53.33

// Text and screens both run to the side padding on every breakpoint. Below
// desktop the copy is capped as well: screens want the full width once there is
// some, a measure that wide does not.
const TEXT_MAX_TABLET = 500

// The mark on its tile, 686:2845 / 807:817 — the same 56 on both frames.
// The chip line the Services label is centred against, and the chips' own box.
const CHIP_H = 34

const NEUTRAL_200 = '#E3E6EB'
const LABEL_COLOR = 'rgba(0,0,0,0.7)'
// base/black in the design file — headings sit a shade off pure black.
const HEADING_COLOR = '#212121'

// The note's dots, as a progress cycle: none, one, two, three, hold, over
// again. `DOT_STEP` is how long each one waits before the next appears and
// `DOT_HOLD` how long all three stand before it restarts.
const DOT_STEP = 0.32
const DOT_HOLD = 0.5

// Every section sits 100 from its neighbours at 1440 and 80 at 390. The one
// exception on both frames is a feature note and the screens it introduces:
// those are one unit, 40 apart.
const SECTION_GAP = 100
const SECTION_GAP_MOBILE = 80
const CAPTION_GAP = 40

// Builds the ramps for a breakpoint. `L` is for anything structural, `T` for a
// named type token, and the rest are the figures the two frames disagree on.
function buildRamp({ isDesktop, isTablet }) {
  // Structure. The two frames agree on almost every one of these — the tile is
  // 56 and the gallery gap 20 at both 1440 and 390 — so below desktop the
  // figure is taken as drawn and grown from 768. The handful the frames do
  // disagree on (side padding, section gap, and the hero's own spacing) are
  // named separately rather than being run through here.
  const L = (x) => (isDesktop ? fluidSpace(x) : scaleCompact(x))
  const T = (name) => {
    const token = TYPE[name]
    const desktop = fluidType(token.size, token.line)
    return {
      fontSize: isDesktop ? desktop.fontSize : scaleCompact(token.mobile[0]),
      lineHeight: isDesktop ? desktop.lineHeight : scaleCompact(token.mobile[1]),
      letterSpacing: token.tracked ? TRACKING : 0,
    }
  }

  const sidePad = isDesktop
    ? fluidSpace(SIDE_PAD)
    : fluidBetween(SIDE_PAD_MOBILE, SIDE_PAD_COMPACT_MAX, 390, 1024)

  // The cap applies below desktop at every width rather than switching on at
  // the tablet breakpoint: at 390 the column is 358 wide so it is inert, and it
  // starts to bite on its own as the viewport opens up.
  const textMax = isDesktop ? fluidSpace(500) : `${TEXT_MAX_TABLET}px`

  const sectionGap = isDesktop ? fluidSpace(SECTION_GAP) : scaleCompact(SECTION_GAP_MOBILE)

  return { L, T, sidePad, textMax, sectionGap, isDesktop, isTablet }
}

// 813:22536 — the line a case study carries while its write-up is unwritten.
// The trailing dots are split off and run as a progress cycle: they arrive one
// after another, hold, and start over, which is the page saying the writing is
// still happening rather than that it has stalled.
//
// `visibility` rather than opacity or the text itself: a hidden element still
// takes its space, so the three dots always occupy the same width and the
// centred line never shifts as they come and go. Fading them in place read as
// a blink instead of as progress.
function Note({ text, ui }) {
  const rootRef = useRef(null)
  const dotRefs = useRef([])

  const trailing = text.match(/\.+$/)
  const dots = trailing ? trailing[0] : ''
  const lead = dots ? text.slice(0, -dots.length) : text

  useLayoutEffect(() => {
    const marks = dotRefs.current.filter(Boolean)
    if (!marks.length) return
    const ctx = gsap.context(() => {
      // Hidden outright, before the timeline exists. A `set` at position 0
      // only lands on the timeline's first tick, which is after the first
      // paint — long enough to flash all three dots on arrival.
      gsap.set(marks, { visibility: 'hidden' })

      const tl = gsap.timeline({ repeat: -1 })
      tl.set(marks, { visibility: 'hidden' }, 0)
      marks.forEach((mark, i) => {
        tl.set(mark, { visibility: 'visible' }, (i + 1) * DOT_STEP)
      })
      // An empty tween, purely to hold the finished line before the cycle
      // starts over — without it the third dot would vanish the moment it
      // arrived.
      tl.to({}, { duration: DOT_HOLD })
    }, rootRef)
    return () => ctx.revert()
  }, [text])

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center w-full"
      style={{ maxWidth: CONTENT_MAX, margin: '0 auto', padding: `0 ${ui.sidePad}` }}
    >
      <p
        className="font-light font-['Geist'] text-center"
        style={{ ...ui.T('body'), color: '#000', width: ui.textMax, maxWidth: '100%' }}
      >
        {lead}
        {dots.split('').map((dot, i) => (
          <span key={i} ref={(el) => (dotRefs.current[i] = el)}>
            {dot}
          </span>
        ))}
      </p>
    </div>
  )
}

// One item of body copy: either a run of paragraphs or a numbered list. The
// list has no space between its items — in both frames the whole list is a
// single text block, so the lines run on at a flat line height.
function BodyItem({ item, ui }) {
  const body = ui.T('body')
  if (item.list) {
    return (
      <ol
        className="font-light font-['Geist'] w-full"
        style={{ ...body, color: '#000', listStyle: 'decimal outside', paddingLeft: ui.L(24) }}
      >
        {item.list.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ol>
    )
  }
  return (
    // A paragraph break is a blank line in both frames, so the gap is the body's
    // own line height — not the block gap around it, which is smaller inside a
    // feature note.
    <div className="flex flex-col w-full" style={{ gap: ui.L(22) }}>
      {item.paragraphs.map((paragraph, i) => (
        <p key={i} className="font-light font-['Geist']" style={{ ...body, color: '#000' }}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function TextGroup({ heading, body, headingToken, gap, ui }) {
  return (
    <div
      className="flex flex-col items-start w-full"
      style={{ maxWidth: ui.textMax, gap }}
    >
      <p
        className="font-normal font-['Geist'] w-full"
        style={{ ...ui.T(headingToken), color: HEADING_COLOR }}
      >
        {heading}
      </p>
      {body.map((item, i) => (
        <BodyItem key={i} item={item} ui={ui} />
      ))}
    </div>
  )
}

// The two-column split the text sections are laid out on at 1440. Both halves
// are flexible and equal; only one of them carries anything. Below desktop the
// halves would be narrower than the copy itself, so the column runs alone.
function SplitRow({ side, children, ui }) {
  const spacer = <div style={{ flex: '1 0 0', minWidth: 0 }} />
  return (
    <div
      className="flex items-start w-full"
      style={{ maxWidth: CONTENT_MAX, margin: '0 auto', padding: `0 ${ui.sidePad}` }}
    >
      {ui.isDesktop && side === 'right' && spacer}
      <div className="flex flex-col items-center" style={{ flex: '1 0 0', minWidth: 0 }}>
        {children}
      </div>
      {ui.isDesktop && side === 'left' && spacer}
    </div>
  )
}

function Gallery({ rows, ui }) {
  const gap = ui.L(20)
  // The 390 frame stacks every screen; only 1440 sets them side by side.
  const laidOut = ui.isDesktop ? rows : rows.flatMap((row) => row.map((image) => [image]))
  return (
    <div
      className="flex flex-col w-full"
      style={{ maxWidth: CONTENT_MAX, margin: '0 auto', padding: `0 ${ui.sidePad}`, gap }}
    >
      {laidOut.map((row, i) => (
        <div key={i} className="flex w-full" style={{ gap }}>
          {row.map((image, j) => (
            <div
              key={j}
              className="relative overflow-hidden"
              style={{
                // Grow in proportion to the width the image has in the frame,
                // so an uneven row (433 beside 887) keeps its split at any size.
                flex: `${image.w} 1 0`,
                minWidth: 0,
                aspectRatio: `${image.w} / ${image.h}`,
                borderRadius: ui.L(6),
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function StoryBlock({ block, ui }) {
  if (block.type === 'divider') {
    // The rule takes no height of its own. In both frames it is a zero-height
    // vector with the stroke straddling it, and the gap to the section below is
    // measured from that line — give the box a height and everything under it
    // shifts a pixel down.
    return (
      <div
        style={{ maxWidth: CONTENT_MAX, margin: '0 auto', padding: `0 ${ui.isDesktop ? '0px' : ui.sidePad}` }}
      >
        <div style={{ height: 0, position: 'relative' }}>
          <div
            className="absolute left-0 w-full"
            style={{ top: -0.5, height: 1, background: NEUTRAL_200 }}
          />
        </div>
      </div>
    )
  }

  if (block.type === 'gallery') {
    return <Gallery rows={block.rows} ui={ui} />
  }

  // A single centred line, across the whole content width rather than in one
  // half of the split the prose blocks use.
  if (block.type === 'note') {
    return <Note text={block.text} ui={ui} />
  }

  if (block.type === 'caption') {
    return (
      <SplitRow side="left" ui={ui}>
        <TextGroup
          heading={block.heading}
          body={block.body}
          headingToken="subheading"
          gap={ui.L(14)}
          ui={ui}
        />
      </SplitRow>
    )
  }

  return (
    <SplitRow side={block.side} ui={ui}>
      <div className="flex flex-col items-center w-full" style={{ gap: ui.L(60), maxWidth: ui.textMax }}>
        {block.groups.map((group, i) => (
          <TextGroup
            key={i}
            heading={group.heading}
            body={group.body}
            headingToken="heading"
            gap={ui.L(22)}
            ui={ui}
          />
        ))}
      </div>
    </SplitRow>
  )
}

export default function CaseStudy({ study }) {
  const tile = study.logo
  const story = getStory(study.id)
  const { isDesktop, isTablet } = useBreakpoint()
  const ui = buildRamp({ isDesktop, isTablet })
  const { L, T } = ui

  const rootRef = useRef(null)
  // The three copy blocks, in the order they read.
  const heroPartRefs = useRef([])
  const artworkRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The hero arrives as one move: the copy blocks rise and clear in turn,
      // with the artwork coming in under them. Same entrance the landing hero,
      // the About page and the work index use.
      //
      // Set the start state outright rather than leaning on fromTo's
      // immediateRender: a fromTo placed later than 0 on a timeline does not
      // reliably paint its own start, which left the hero already resolved on
      // first paint at some sizes. This is the shape the navbar already uses.
      const parts = heroPartRefs.current.filter(Boolean)
      const art = artworkRef.current

      gsap.set(parts, { y: 40, opacity: 0, filter: 'blur(10px)' })
      if (art) gsap.set(art, { y: 60, opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(parts, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12 }, 0.15)
      if (art) {
        // Opacity and lift only — a blur across an image this size is far more
        // expensive than across a line of type, and reads no differently.
        tl.to(art, { y: 0, opacity: 1, duration: 1 }, 0.25)
      }
    }, rootRef)
    return () => ctx.revert()
  }, [isDesktop])

  // 686:2854 / 807:816 — the mark, with the project's name beside it. The tile
  // is 56 on both frames, and the mark keeps a fixed share of it.
  const markRow = (
    <div
      ref={(el) => (heroPartRefs.current[0] = el)}
      className="flex items-center w-full"
      style={{ gap: L(18) }}
    >
      <div
        className="flex items-center justify-center shrink-0 overflow-hidden"
        style={{
          width: L(56),
          height: L(56),
          borderRadius: L(12),
          // The project's own tile fill, and an edge only where the fill is
          // white — a coloured tile carries its own.
          background: tile.fill,
          // outline rather than border: a border would shrink the content box
          // and with it the mark, which is sized as a fraction of the tile.
          // Inset by its own width so it draws exactly where a border would.
          outline: tile.outlined ? `1px solid ${NEUTRAL_200}` : 'none',
          outlineOffset: '-1px',
        }}
      >
        <img
          src={tile.src}
          alt=""
          style={{ width: `${tile.markW * 100}%`, height: `${tile.markH * 100}%` }}
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1" style={{ gap: L(2) }}>
        <p className="text-black font-normal font-['Geist']" style={T('subheading')}>
          {study.name}
        </p>
        <p className="text-black font-light font-['Geist']" style={T('body')}>
          {study.tagline}
        </p>
      </div>
    </div>
  )

  // 686:2907 / 807:829 — a labelled row. Desktop sets the label beside the body
  // in a fixed 100 column; the 390 frame stacks it above instead.
  //
  // `labelBox` is the height the label is centred in, for a row whose body is
  // taller than a line of type — 824:23539 gives Services a 34 box so the word
  // sits level with the chips rather than at their top. Desktop only: on the
  // 390 frame the label is above the chips, where there is nothing to centre
  // against. A row without it keeps the label at the top, which is right where
  // the body runs to several lines.
  const metaRow = (label, children, labelBox) => (
    <div
      className="flex w-full"
      style={{
        flexDirection: isDesktop ? 'row' : 'column',
        gap: isDesktop ? L(10) : scaleCompact(10),
      }}
    >
      <div
        className="shrink-0 flex"
        style={{
          width: isDesktop ? L(100) : '100%',
          // Centred only where there is a box to centre in. Left to itself the
          // wrapper stretches to the row, and centring there would drop the
          // Role label into the middle of its three lines instead of sitting it
          // on the first.
          ...(isDesktop && labelBox
            ? { height: L(labelBox), alignItems: 'center' }
            : { alignItems: 'flex-start' }),
        }}
      >
        <p className="w-full font-medium font-['Geist']" style={{ ...T('body'), color: LABEL_COLOR }}>
          {label}
        </p>
      </div>
      {children}
    </div>
  )

  const heroCopy = (
    <div
      className="flex flex-col items-start w-full"
      style={{
        maxWidth: isDesktop ? L(COLUMN_W) : ui.textMax,
        gap: isDesktop ? L(60) : scaleCompact(30),
      }}
    >
      {/* On the 390 frame the mark sits above the artwork, so it is rendered
          separately there and only joins the copy column on desktop. */}
      {isDesktop && markRow}

      {/* 686:2855 / 807:825 — what the project is. */}
      <div
        ref={(el) => (heroPartRefs.current[1] = el)}
        className="flex flex-col w-full"
        style={{ gap: isDesktop ? L(24) : scaleCompact(16) }}
      >
        <h1 className="text-black font-light font-['Geist']" style={T('headline')}>
          {study.headline}
        </h1>
        <p className="text-black font-light font-['Geist']" style={T('body')}>
          {study.description}
        </p>
      </div>

      {/* 686:2928 — what I did on it. */}
      <div
        ref={(el) => (heroPartRefs.current[2] = el)}
        className="flex flex-col w-full"
        style={{ gap: isDesktop ? L(40) : scaleCompact(30) }}
      >
        {metaRow(
          'Role',
          <p
            className="flex-1 min-w-0 w-full text-black font-light font-['Geist']"
            style={T('body')}
          >
            {study.role}
          </p>
        )}
        {metaRow(
          'Services',
          <div
            className="flex flex-1 min-w-0 w-full flex-wrap items-start"
            style={{ gap: L(4) }}
          >
            {study.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center justify-center shrink-0 whitespace-nowrap bg-white text-black font-light font-['Geist']"
                style={{
                  ...T('chip'),
                  height: L(CHIP_H),
                  padding: `0 ${L(12)}`,
                  // A pill, so the corner holds while the box rides the ramp.
                  borderRadius: 30,
                  // Same reason as the tile above: the frame's 125x34 already
                  // contains its stroke (12 + label + 12), so a border — which
                  // would push the chip 2px wider — is an inset outline.
                  outline: `1px solid ${NEUTRAL_200}`,
                  outlineOffset: '-1px',
                }}
              >
                {service}
              </span>
            ))}
          </div>,
          CHIP_H
        )}
      </div>
    </div>
  )

  // 712:210 / 807:839 — the artwork. Runs the full column below desktop rather
  // than being capped with the copy: screens want the width, a measure does not.
  const artwork = (
    <div
      ref={artworkRef}
      className="relative overflow-hidden self-center w-full"
      style={{
        ...(isDesktop ? { flex: '1 0 0', minWidth: 0, maxHeight: '100%' } : {}),
        aspectRatio: '4 / 3',
        borderRadius: L(6),
      }}
    >
      <img src={study.thumbnail} alt={study.name} className="w-full h-full object-cover" />
    </div>
  )

  return (
    <div className="bg-white" ref={rootRef}>
      <Navbar onLight />

      <section
        className="flex flex-col"
        style={isDesktop ? { minHeight: VIEWPORT } : undefined}
      >
        <div style={{ height: isDesktop ? HEADER_H : HEADER_H_MOBILE, flexShrink: 0 }} />

        <div
          className="flex w-full"
          style={{
            ...(isDesktop
              ? {
                  flex: 1,
                  minHeight: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: L(50),
                  padding: `0 ${ui.sidePad} ${L(50)}`,
                }
              : {
                  // 807:814 — a column that runs to its content, artwork between
                  // the mark and the copy.
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: scaleCompact(50),
                  padding: `${scaleCompact(HERO_TOP_MOBILE)} ${ui.sidePad} 0`,
                }),
            justifyContent: 'center',
            maxWidth: CONTENT_MAX,
            margin: '0 auto',
          }}
        >
          {!isDesktop && (
            <div className="w-full" style={{ maxWidth: ui.textMax }}>
              {markRow}
            </div>
          )}
          {isDesktop ? heroCopy : artwork}
          {isDesktop ? artwork : heroCopy}
        </div>
      </section>

      <FooterWash>
        {story && (
          // A column rather than a plain block: the divider is zero-height, and
          // in normal flow its margin would collapse with the next section's,
          // swallowing a whole gap of the rhythm.
          <div className="relative z-10 flex flex-col">
            {story.map((block, i) => (
              <div
                key={i}
                style={{
                  // A feature note and the screens under it are one unit.
                  marginTop:
                    i > 0 && story[i - 1].type === 'caption' && block.type === 'gallery'
                      ? L(CAPTION_GAP)
                      : ui.sectionGap,
                }}
              >
                <StoryBlock block={block} ui={ui} />
              </div>
            ))}
          </div>
        )}
      </FooterWash>
    </div>
  )
}
