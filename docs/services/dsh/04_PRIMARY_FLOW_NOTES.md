# 04_PRIMARY_FLOW_NOTES

## Primary DSH Flow

The current primary DSH bootstrap flow is:

1. customer discovers a store or category in `app-client`
2. customer adds items and reaches checkout in `app-client`
3. customer confirms the order intent
4. partner receives and progresses the order in `app-partner`
5. captain receives or accepts the job in `app-captain`
6. captain executes delivery and uploads proof where required
7. participating actors observe clear status updates
8. ops can oversee or intervene through `control-panel` when needed

## Optional Support Path

If the journey requires activation or field support, `app-field` participates as an optional support surface rather than a mandatory baseline surface.

## Flow Rule

This service foundation assumes one clear primary job per actor and avoids competing primary CTAs for the same stage of the flow.
