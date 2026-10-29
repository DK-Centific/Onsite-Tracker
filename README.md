# On-site Check-in

Check-in/check-out tracker for the Google DeepMind on-site staffing project. React + Vite, built to static files for GitHub Pages. An Excel workbook on SharePoint holds the data, read and written through two Power Automate flows.

Two separate pages:

- **Check-in page** (`/`), for everyone on site: pick your robot and tap Check in. A ring then shows your shift so far and your partner. Checking out before the shift ends asks for a reason and alerts the leads. It works on a personal phone (remembers you) or a shared tablet (pick your name each time).
- **Admin** (`/#/admin`), for leads:

| View | What it does |
|---|---|
| **Today** | **Needs a backfill** (robots whose scheduled person hasn't arrived, with a one-tap backfill). Robot lanes for the day: each person's time, scheduled people who haven't arrived as dashed outlines, and the robot's merged hours worked. **Needs attention**: not here yet, no-shows, left early, missed check-ins or check-outs, and check-ins with no shift on the schedule. **On site**: who is here now. |
| **Schedule** | The week's plan by day and robot, with each person's status. Understaffed robots are flagged; add, remove or backfill shifts. |
| **Hours** | Hours worked (robot time) vs client successful hours for the week, operator hours, totals to date, and per-operator daily hours against scheduled hours. |
| **Records** | Every check-in grouped by day, a Flags filter, and CSV exports: check-in log, shifts, and schedule vs actual, for badge reconciliation. |

Light and dark appearance follow the system, or can be set in Settings.

## Develop

```bash
npm install
```

```bash
npm run dev
```

With `readUrl` / `writeUrl` empty in [public/config.js](public/config.js), the app runs in **demo mode**: sample data saved in the browser, which you can reset in Settings.

## Go live

1. Build the two flows from [docs/power-automate-flows.md](docs/power-automate-flows.md).
2. Put the trigger URLs into `public/config.js`, and set `stations` and `shiftHours` to match the site.
3. Run `npm run build` and publish `dist/` to GitHub Pages. `config.js` is copied into `dist/` as is, so you can change settings later without rebuilding.

## Design

- [PRODUCT.md](PRODUCT.md): who it's for and the product rules.
- [ux-behavior-spec.md](ux-behavior-spec.md): motion and interaction rules, shared with the Atlas projects.
- `DESIGN.md`: the visual system.
