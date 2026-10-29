---
name: On-site
description: Check-in and robot-hours tracker for the Centific team on the Google DeepMind on-site project.
colors:
  ground: "#f3f4f6"
  surface: "#ffffff"
  surface-raised-tint: "#f6f7f8"
  fill: "#e8eaed"
  fill-hover: "#dfe1e5"
  separator: "rgb(60 64 67 / 0.13)"
  edge: "rgb(60 64 67 / 0.14)"
  edge-strong: "rgb(60 64 67 / 0.22)"
  ink: "#1f1f1f"
  ink-secondary: "#5f6368"
  ink-tertiary: "#72777d"
  action-blue: "#1a73e8"
  action-blue-hover: "#1765cc"
  action-blue-text: "#1967d2"
  action-blue-soft: "#e8f0fe"
  on-site-green: "#188038"
  on-site-green-dot: "#1e8e3e"
  on-site-green-soft: "#e6f4ea"
  attention-yellow: "#f9ab00"
  attention-yellow-text: "#a15800"
  attention-yellow-soft: "#fef7e0"
  early-red: "#d93025"
  early-red-hover: "#c5221f"
  early-red-soft: "#fce8e6"
  ground-dark: "#131314"
  surface-dark: "#1e1f20"
  surface-raised-tint-dark: "#242527"
  fill-dark: "#333537"
  ink-dark: "#e8eaed"
  ink-secondary-dark: "#a9adb3"
  ink-tertiary-dark: "#8f9399"
  action-blue-dark: "#8ab4f8"
  action-blue-text-dark: "#a8c7fa"
  on-action-blue-dark: "#062e6f"
  on-site-green-dark: "#81c995"
  attention-yellow-dark: "#fdd663"
  early-red-dark: "#f28b82"
  early-red-text-dark: "#f6aea9"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Segoe UI Variable Display\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "3.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Segoe UI Variable Display\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "2.125rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Segoe UI Variable Display\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  group-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  subtitle:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0em"
  micro:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
rounded:
  control-inner: "8px"
  icon-tile: "9px"
  nav: "10px"
  segmented: "11px"
  field: "12px"
  card: "14px"
  button-large: "16px"
  sheet: "22px"
  pill: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  group: "28px"
  page-desktop-y: "40px"
  page-desktop-x: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface}"
    typography: "{typography.group-title}"
    rounded: "{rounded.card}"
    padding: "0 20px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.action-blue-hover}"
  button-primary-large:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button-large}"
    height: "58px"
    width: "100%"
  button-danger:
    backgroundColor: "{colors.early-red}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
    height: "50px"
  button-danger-hover:
    backgroundColor: "{colors.early-red-hover}"
  button-plain:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "50px"
  button-plain-hover:
    backgroundColor: "{colors.fill-hover}"
  button-small:
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "34px"
  grouped-list:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  list-row:
    typography: "{typography.body}"
    padding: "10px 16px"
    height: "52px"
  search-field:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "44px"
  segmented:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.segmented}"
    padding: "3px"
  segmented-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control-inner}"
    height: "32px"
  robot-tile:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "14px"
    height: "84px"
  robot-tile-selected:
    backgroundColor: "{colors.action-blue-soft}"
    textColor: "{colors.action-blue-text}"
  tag-on-site:
    backgroundColor: "{colors.on-site-green-soft}"
    textColor: "{colors.on-site-green}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  tag-attention:
    backgroundColor: "{colors.attention-yellow-soft}"
    textColor: "{colors.attention-yellow-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  tag-left-early:
    backgroundColor: "{colors.early-red-soft}"
    textColor: "{colors.early-red-hover}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  avatar:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    size: "34px"
  sidebar-link-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.action-blue-text}"
    rounded: "{rounded.nav}"
    height: "38px"
  tab-active:
    textColor: "{colors.action-blue-text}"
    typography: "{typography.micro}"
    height: "48px"
---

# Design System: On-site

## Overview

**Creative North Star: "The Robot's Lane"**

On-site speaks Apple's system grammar (user-pinned): system type with large bold titles, inset grouped lists floating on a cool grey ground, hairline separators, sheets that rise from the bottom on phones and settle centred on larger screens, a sidebar on desktop and a translucent tab bar on phones. Nothing is decorated; every surface is either a list, a control, or the robot lanes. The unit of the world is the robot, so the one signature drawing in the system is a timeline of robots, not a dashboard of people.

Color is borrowed lightly from Google's four (user-pinned) and assigned jobs, never used as branding: blue acts and selects, green means on site, yellow asks for attention, red means left early. Light and dark are separately tuned palettes, not an inversion: dark mode swaps to the lighter Google tints (#8ab4f8 family) with dark ink on blue fills.

Depth is the Twilight/Atlas definition (user-pinned): a 0.5px edge on every surface, a soft paired-shadow raise on the few tactile objects (robot tiles, the shift ring), inset wells for inputs and tracks, and a three-step sm/md/lg elevation for cards, folded bars and sheets. Motion and interaction behaviour are governed by `ux-behavior-spec.md`; this file does not restate them.

**Key Characteristics:**
- System font stack only (SF Pro on Apple devices), bold large titles, tabular numerals for every time and hour figure.
- Inset grouped lists on a grey ground; separators are 0.5px inset hairlines, never full borders.
- Four job colors, each with a solid, a text-safe tone and a soft tint; separately tuned in dark mode.
- 0.5px edges everywhere, paired raise on tactile objects, wells on inputs and tracks.
- Robot lanes: thin initialled person lines over a merged blue hours-worked bar.

## Colors

A cool, near-neutral Google grey world where four job colors carry all meaning.

### Primary
- **Action Blue** (action-blue; dark: action-blue-dark): Primary buttons, selected robot tile ring, focus outlines, caret, the merged hours-worked bar in robot lanes, the hours-worked bar in Hours. Hover deepens to action-blue-hover. Text-on-ground uses action-blue-text (active tab, active sidebar link, links, selected tile name). Selection backgrounds use action-blue-soft.

### Secondary
- **On-Site Green** (on-site-green; dot variant on-site-green-dot): Live person lines and their breathing end dot, the shift ring's progress, on-site avatars, the station chip under the ring, "saved" text, the client's successful-hours bar.

### Tertiary
- **Attention Yellow** (attention-yellow for dots; attention-yellow-text for words): Short-staffed robots ("1 of 2 on site"), warning row icons, the Demo badge. Yellow is never used as text at its solid value in light mode; it fails contrast. Use the -text tone.
- **Left-Early Red** (early-red; early-red-hover doubles as the light text tone): Left-early tags and avatars, the red end-tick on an early person line, the Check out early (danger) button, sync errors, error toasts.

### Neutral
- **Cool Grey Ground** (ground / ground-dark): The page behind every grouped list; also the sheet background, so sheets read as a lifted piece of ground.
- **Surface White** (surface / surface-dark): Grouped-list bodies, robot tiles, the ring, plain buttons, active sidebar link.
- **Raised Tint** (surface-raised-tint): Sidebar background, row hover, focused field row.
- **Fill** (fill, fill-hover): Wells (search, reason field, segmented track, compare tracks, ring track), neutral avatars, skeletons.
- **Ink, Secondary Ink, Tertiary Ink** (ink, ink-secondary, ink-tertiary): Titles and values; subtitles and ledes; ticks, placeholders, empty states.
- **Hairlines** (separator, edge, edge-strong): Row separators; the 0.5px outline on every surface; the sidebar's right edge and the sheet outline.

### Named Rules
**The Four Jobs Rule.** Blue, green, yellow and red each have exactly one job (act/select, on site, attention, left early). A color never appears for decoration or for a job that is not its own; a new status gets a neutral treatment before it gets a fifth hue.

**The Three Tones Rule.** Every job color ships as a solid (fills, bars, dots), a text tone (words on surface or ground) and a soft tint (chip and icon backgrounds). Words always use the text tone.

**The Tuned Dark Rule.** Dark mode is its own palette (ground-dark #131314 with lighter Google tints and dark ink on blue fills), defined for both `prefers-color-scheme: dark` and `[data-theme="dark"]`. Never derive dark by inverting light.

## Typography

**Display Font:** SF Pro Display via the system stack (Segoe UI Variable Display, Roboto fallbacks)
**Body Font:** SF Pro Text via the system stack (Segoe UI Variable Text, Roboto fallbacks)

**Character:** Native and quiet: the device's own face, set tight (-0.01em body, down to -0.03em on big numerals) so it reads like the OS rather than a website.

### Hierarchy
- **Display** (600, 3.25rem, 1): The elapsed time inside the shift ring; 3rem for the checked-in/out time. Always tabular.
- **Headline** (700, 2.125rem, 1.12, -0.025em): The large title that opens every view; folds into the top bar on scroll on phones. 2.75rem on the shared tablet.
- **Title** (700, 1.375rem, -0.02em): Sheet titles and the sidebar app name.
- **Group title** (600, 1.0625rem): Section names above grouped lists; also button text and the lede size (400, ink-secondary).
- **Body** (400 / 500 for row titles, 1rem, 1.4): Rows, fields.
- **Subtitle** (400, 0.8125rem): Row subtitles, lane meta, group footers (max 68ch), tooltips.
- **Label** (600, 0.75rem): Tags, avatar initials, sidebar section names, week-grid day heads. Sentence case, no tracking.
- **Micro** (500, 0.6875rem): Tab labels, lane hour ticks, person initials on lanes (600, +0.02em).

### Named Rules
**The Tabular Time Rule.** Every clock, duration and hour figure uses tabular numerals so columns and counters never jitter.

**The Native Face Rule.** Type is the system stack only. No webfonts, no display face; hierarchy comes from size and weight.

## Layout

Mobile-first single column with 16px page gutters; phones carry a 52px translucent top bar (title folds into it on scroll) and a fixed four-tab bar, with the main column padded to clear it. At 768px the shell becomes a 248px sidebar plus content, and page padding opens to 40px / 48px. Views cap at 1040px; narrow flows (welcome, check-in) cap at 460px. At 900px paired groups split into two columns (24px gutter). At 1100px Check in gains a desktop layout: the 460px primary column beside a 540px aside holding the robot's own lane and robots right now (56px gap). Below 640px lanes stack their label above the track and the week grid collapses to name plus total.

On phones the primary Check in / Check out button docks at thumb height just above the tab bar. The shared tablet (`.is-shared`, 640px and up) widens the column to 640px and scales rows to 72px, avatars to 48px and the search field to 56px for arm's-length reading.

Rhythm is a 4px base: 4, 8, 12, 16, 20, 24, with 28px between groups and 24px under the page head.

## Elevation & Depth

A hybrid, user-pinned from Twilight/Atlas: everything is defined by a 0.5px edge, most surfaces sit at sm elevation, a few tactile objects use a paired-shadow raise, and inputs and tracks are inset wells. Bars use translucency (82% ground, saturate 180%, blur 20px) instead of shadow until content scrolls under them.

### Shadow Vocabulary
- **Edge** (`box-shadow: 0 0 0 0.5px var(--edge)`): On every surface; paired with whatever elevation it has.
- **sm** (`0 1px 2px rgb(32 33 36 / 0.06), 0 2px 8px rgb(32 33 36 / 0.05)`): Grouped-list cards, plain buttons, active sidebar link, the top bar once collapsed.
- **md** (`0 6px 20px rgb(32 33 36 / 0.09), 0 1px 3px rgb(32 33 36 / 0.06)`): Reserved middle step for floating surfaces between card and sheet.
- **lg** (`0 16px 44px rgb(32 33 36 / 0.16)`): Sheets, with edge-strong.
- **Raise** (`5px 5px 14px var(--neu-dark), -5px -5px 14px var(--neu-light)`): Robot tiles and the shift ring only.
- **Well** (`inset 2px 2px 5px var(--neu-dark), inset -2px -2px 5px var(--neu-light)`): Search, reason field, segmented track, compare tracks, the selected robot tile (pressed in).
- **Glow** (`--glow-blue`, `--glow-red`): Coloured lift under primary and danger buttons, with a 1px inner top highlight; removed when disabled.

Dark mode retunes every one of these (heavier black shadows, a 4% white light side); values are in the sidecar.

### Named Rules
**The Hairline Rule.** Every surface is outlined at 0.5px, never 1px; separators are 0.5px inset shadows, not borders.

**The Pressed-In Selection Rule.** A raised tile shows selection by sinking into a well with a 2px blue inner ring, not by lifting higher.

**The Few Raised Rule.** The paired raise belongs to tactile objects you tap or watch (robot tiles, the ring). Lists and cards stay at sm.

## Shapes

Continuous, gently rounded rectangles. 14px is the house corner (cards, buttons, robot tiles, toasts); larger objects get larger corners (16px large button, 22px sheet); small inner controls step down (12px fields, 11px segmented track, 10px nav items and tooltip, 9px row icons, 8px segmented pill). Pills (999px) are reserved for tags, small buttons, icon buttons, avatars and data bars. Circles hold the shift ring, avatars and done marks.

## Components

### Buttons
- **Shape:** House corner (14px); large 16px; small buttons are pills.
- **Primary:** Action Blue fill, white text (dark ink #062e6f in dark mode), 600 weight at 1.0625rem, 50px tall (58px for the docked Check in/out), with the blue glow.
- **Hover / Focus:** Hover deepens the fill on fine pointers only; press scales to 0.97; focus is a 2px blue outline offset 2px.
- **Danger:** Left-Early Red with red glow; used for checking out before the shift ends.
- **Plain:** Surface with edge and sm; the secondary action ("This week", "Today", next person).

### Chips (Tags)
- **Style:** Pill, label type, soft tint background with text-tone words, optional 12px icon.
- **State:** Three tones only: on site (green), attention (yellow), left early (red).

### Cards / Containers (Grouped lists)
- **Corner Style:** 14px, overflow clipped.
- **Background:** Surface on the grey ground.
- **Shadow Strategy:** Edge plus sm.
- **Border:** None; rows separated by 0.5px inset hairlines.
- **Internal Padding:** Rows 10px 16px, 52px minimum; title above at 16px inset; footer note below in subtitle type.

### Inputs / Fields
- **Style:** Inside grouped lists, field rows are borderless (96px label, input fills). Standalone search and reason fields are Fill wells at 12px.
- **Focus:** Field rows tint to the raised tint with a 3px blue inset left bar; wells add a 2px blue ring.
- **Error:** Invalid input text turns red text tone.

### Segmented control
A Fill well with a 3px pad; the selected option is a surface pill (lighter grey #4a4c50 in dark) that slides between options.

### Navigation
- **Desktop sidebar:** 248px, raised tint, edge-strong right hairline. App name in title type; links 38px, 10px corners, 500 at 0.9375rem; active link is a surface chip with edge and sm and blue text and icon; hover fills grey.
- **Phone:** Translucent top bar with sync and settings; fixed four-column tab bar, 48px targets, micro labels, active tab in blue text. Icons are Lucide line icons throughout.

### Robot lanes (signature)
One lane per robot across the working day (7 AM to 7 PM), a 168px label column (robot name, "x hrs worked", optional attention tag) beside the track. Each person's span is a thin 3px rounded line labelled with initials above its start; live spans turn green with a breathing end dot, early spans end in a red tick. Beneath the people, the merged span of everyone's time is a 10px Action Blue bar: the robot's hours worked, so a pair working together visibly counts once. Hour gridlines are separator hairlines; today has a 2px ink now-line with a dot cap. Hovering a span shows an ink tooltip with name, times and hours. Short spans move their initials past the line end.

### Shift ring
A raised circle (up to 280px) holding a 14px-stroke ring: fill track, green progress (blue once the shift is complete), the elapsed time in display type, "of 6:00 shift" and a green station chip.

### Robot tiles
Two-column grid of raised 14px tiles (84px minimum) with robot name and overlapping 24px avatars of who's on it; selection sinks into a blue-ringed well with a popped blue check.

## Do's and Don'ts

### Do:
- **Do** open every view with a large title (2.125rem, 700) and a one-line lede in secondary ink.
- **Do** put content in inset grouped lists on the grey ground, rows at 52px minimum with 0.5px inset separators.
- **Do** give every surface its 0.5px edge, and reserve the paired raise for tactile objects.
- **Do** use the text tone of a job color for words and the soft tint behind it.
- **Do** tune any new color separately for light and dark, in both the media-query and `[data-theme]` blocks.
- **Do** show any per-robot timing as robot lanes: person lines over the merged hours-worked bar.
- **Do** follow `ux-behavior-spec.md` for every hover, press, transition and reduced-motion behaviour.

### Don't:
- **Don't** use a job color outside its job, or add decorative color.
- **Don't** use 1px borders or full-bleed dividers; hairlines are 0.5px and inset.
- **Don't** set yellow solid as text, or small text in tertiary ink on the grey ground (about 4.1:1); use secondary ink there.
- **Don't** add webfonts, display faces or brand marks; the client's logos and wordmarks are never used.
- **Don't** build the category default: a time-clock form beside stacked KPI cards. Status is a sentence and lanes, not tiles of numbers.
- **Don't** stack bars for a pair or sum their hours as hours worked; hours worked and operator hours are always labelled distinctly.
