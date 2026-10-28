# On-site Check-in

Check-in/check-out tracker for the Google DeepMind on-site staffing project. React + Vite, built to static files for GitHub Pages. An Excel workbook on SharePoint holds the data, read and written through two Power Automate flows.

| View | For | What it does |
|---|---|---|
| **Check in** | Moderators and contractors | Pick your robot and tap Check in. A ring then shows your shift so far and your partner. Checking out before the shift ends asks for a reason and alerts the leads. Works on a personal phone (remembers you) or a shared tablet (pick your name each time). |
| **Today** | Leads | Robot lanes for the day: each person's time and the robot's merged delivered time. Also who's on site, and anything that needs attention (left early, no check-out, no check-in). |
| **Hours** | Leads | Delivered vs client successful hours for the week, person hours, totals to date, and per-person daily hours. Tap a person to see their shifts. |
| **Records** | Leads | Every check-in grouped by day, a Flags filter, and CSV exports (check-in log, shifts) for badge reconciliation. |

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
