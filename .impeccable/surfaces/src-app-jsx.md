---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

## Scope
Whole app: Check in (personal phone or shared tablet), Today, Hours, Records. Mode: Operate.

## Direction contract
THESIS: The robot is the unit. One app where a person's tap at the door becomes a mark in their robot's lane. It refuses the category default of a time-clock form beside a KPI dashboard with stacked cards.
OWN-WORLD: Apple's system grammar: system type with large titles, inset grouped lists on a grey ground, hairline separators, sheets that rise from the bottom, a sidebar on desktop and a tab bar on phone. Google-inspired colors do the jobs: blue for actions and selection, green for on site, yellow for attention, red for left early. Light and dark modes each have their own tuned colors.
STORY: A moderator checks in with one tap and sees their robot and partner. A lead opens Today and sees, before any number, which robots are staffed, who's missing and who left early. Hours answers "how much did we deliver this week" next to the client's successful hours. Records exports to compare with badge data.
FIRST VIEWPORT: Check in, phone: a large greeting and date, then robot tiles showing who's already on each robot, then a full-width blue Check in button at thumb height. Once checked in, the shift ring sits centred with elapsed time, the robot and partner below it, and a Check out button. Today, desktop: sidebar; a large title and a one-sentence status ("6 on site · 3 robots running"); robot lanes across the width, 7 AM to 7 PM, with a now-line.
FORM: Pinned by user brief (Apple-inspired, Google-inspired colors); the pin governs wherever the roll differs. seed:d125fa315dc4a303
Depth (user, 2026-10-28): Twilight/Atlas-style definition: 0.5px edges on every surface, a soft paired-shadow raise on raised surfaces, inset wells for inputs and tracks, sm/md/lg elevation steps. Desktop gets its own check-in layout.
Signature move: robot lanes. Each person's span is a thin line labelled with initials, and the merged span beneath is delivered time, so "pairs count once" is visible.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
