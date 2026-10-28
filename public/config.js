// Site settings, read at page load. Edit this file on GitHub (or in dist/ after a
// build) to reconfigure the live site; no rebuild needed.
window.ONSITE_CONFIG = {
  // Power Automate HTTP trigger URLs (see docs/power-automate-flows.md).
  // Leave either empty and the app runs in demo mode: sample data, saved only in this browser.
  readUrl: '',
  writeUrl: '',

  project: 'Google DeepMind on-site',

  // What people pick when they check in. Two people on the same robot on the
  // same day count once toward delivered hours.
  stations: ['Robot 1', 'Robot 2', 'Robot 3', 'Robot 4'],

  // A check-out sooner than this after check-in asks for a reason, is flagged
  // "Left early", and emails the leads (from the Write flow).
  shiftHours: 6,
  earlyGraceMinutes: 15,
};
