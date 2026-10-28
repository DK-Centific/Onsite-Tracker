# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite, static build deployed to GitHub Pages. Data: an Excel workbook on SharePoint (DataCollectionUSHUB site) read and written through two Power Automate HTTP flows (Onsite Read, Onsite Write). With no flow URLs configured, the app runs in demo mode on sample data kept in the browser.

## Users

- **On-site moderators, later contractors**, staffed by Centific on the Google DeepMind on-site project. They work in pairs on a robot, typically on 6-hour shifts. They check in on arrival and check out on leaving, on their own phone, or on a shared tablet at the site entrance.
- **Leads (David Kang, Kate Young)**: during the day they watch who is on site and catch early departures. Weekly, they report totals per person and delivered vs. successful hours. They reconcile the log against the client's badge in/out records.

## Product Purpose

Gives the team its own reliable record of who is at the client site and when. The trigger was a moderator who left a shift early without telling anyone; the team heard about it from the client. Success means:

- the team knows about absences and early departures before the client does;
- backfills can be planned;
- weekly hours per person are known;
- delivered hours can be compared with the client's successful hours and badge records. This matters more once contractors are involved.

## Positioning

The unit is the robot, not the person. Two people working the same robot at the same time deliver robot-hours once: delivered hours merge everyone's overlapping time per robot per day. Person hours are still tracked for each individual.

## Operating Context

- Check-ins happen at the door, standing up, often in a hurry. They have to work in one or two taps on a phone, or on a shared tablet where each person identifies themselves.
- Leads check the app on laptops and phones throughout the day.
- Weekly reporting and badge reconciliation work from CSV exports and the Excel sheet.

## Capabilities and Constraints

- Each check-in records name, email, date, time, in/out, and robot/station. The time comes from the server (`utcNow()` in the flow), not the device clock.
- A check-out sooner than the shift length (default 6 h, with 15 min grace) needs a reason. It is flagged, and the leads get an email.
- Flags: left early, no check-out (an IN still open after its day ends counts no hours), no check-in (an OUT with no matching IN).
- Client "successful hours" are entered weekly by a lead.
- Exports: the raw check-in log and per-shift sessions, as CSV.
- Undecided (waiting on Kate): robot names and count, shift times, the site time zone (assumed Pacific), alert recipients, and the badge-record format.
- The Team view has no sign-in yet. Anyone with the link can see it.

## Brand Commitments

Centific internal tool for a client engagement. Do not use client logos, wordmarks or other branding assets; the project name appears only as plain text.

User-pinned (2026-10-28):
- Apple-inspired: simple, uncluttered, one integrated system.
- A light mode and a dark mode, both with a color scheme lightly inspired by Google's four-color palette (blue, red, yellow, green), used for the colors' jobs rather than as branding.

## Evidence on Hand

No real check-in data yet. Demo data is synthetic and must stay labelled as demo. There are no client numbers to show beyond what leads enter.

## Product Principles

1. Checking in is the smallest possible action. Anything that slows it at the door is a cost paid every shift.
2. Show what needs a lead's attention first (who's missing, who left early), then totals.
3. Never double-count a pair. Delivered hours and person hours are always labelled distinctly.
4. The record has to be trustworthy enough to set beside the client's badge data: server time, nothing hidden or edited silently.

## Accessibility & Inclusion

Large touch targets for use at the door, and readable on a shared tablet at arm's length. UX and motion follow `ux-behavior-spec.md`, including reduced motion.
