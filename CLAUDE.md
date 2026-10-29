# On-site Check-in project rules

Its own project, separate from Atlas/Twilight.

- Product truth lives in PRODUCT.md, and the visual system in DESIGN.md.
- Follow ux-behavior-spec.md for all motion, hover/press, sync/status feedback, notifications, reduced motion and responsive behavior, without being asked. If a request conflicts with it, say so before deviating.
- Hours worked (labelled "Hours worked", formerly "delivered") merge everyone's time per robot per day: never double-count a pair. Keep "Hours worked" and "Operator hours" labelled distinctly everywhere; never use "hours worked" for one operator's own time.
- The people on site are "Operators", never "workers".
- Check-in time is the server's (Power Automate `utcNow()`), never the device clock.
- Demo data is synthetic and must stay labelled as demo.
