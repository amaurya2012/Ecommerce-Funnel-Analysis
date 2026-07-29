# Funnel Analytics

Reads `user_behavior_logs.csv` (written by the Express backend) and produces a
funnel drop-off report: step-by-step conversion, device-type breakdown, an
A/B test significance check on the "Add to Cart" vs "Add to Bag" button, and
where abandoned sessions are stopping.

## Setup

```bash
cd analytics
pip install -r requirements.txt
```

## Usage

Make sure the backend has logged at least one session's worth of events
(run the shop manually, or run `simulator/simulate_traffic.js` for a larger
sample), then:

```bash
python generate_report.py
```

By default this reads `../backend/user_behavior_logs.csv`. To point at a
different file:

```bash
python generate_report.py /path/to/other_logs.csv
```

## Output

Everything is written to `analytics/output/`:

- `funnel_chart.png` — sessions reached at each step, with drop-off %
- `device_conversion_chart.png` — conversion rate by device type
- `abandonment_chart.png` — where non-converting sessions stop
- `ab_test_chart.png` — variant A vs B conversion rate, with a 95% CI error bar
  (only generated if the CSV has a `variant` column with both A and B present)
- `funnel_report.md` — full report with all tables, embeds the charts above,
  and calls out the single biggest drop-off point to investigate first

## How the A/B test is computed

`ab_testing.py` implements a two-proportion z-test from scratch (using
`math.erf` for the normal CDF, no `scipy` dependency):

1. Split sessions into variant A and variant B groups
2. Compute each group's conversion rate (reached `checkout` via a `purchase` event)
3. Test the null hypothesis that the two underlying conversion rates are equal,
   using a pooled standard error for the z-statistic and an unpooled standard
   error for the 95% confidence interval on the difference — standard practice
   for this kind of test
4. Report is flagged significant at α = 0.05 if the two-sided p-value is below 0.05

If the CSV doesn't have a `variant` column, or only has one variant present,
`run_ab_test()` returns `None` and the report simply omits that section rather
than erroring — so it's safe to run against older logs too.

## How a session's funnel depth is determined

Each row in the CSV is one event, not one session. `funnel_engine.py`
groups all events by `sessionId` and works out:

- **Deepest step reached** — the furthest `targetStep`/`currentStep` any
  event for that session touched, in funnel order (`browse` →
  `product_detail` → `cart` → `checkout`)
- **Converted** — whether any event for that session has `action: purchase`
- **Abandoned** — whether any event for that session has `action: abandon`

This means the analysis works whether the data came from real visitors,
manual testing, or `simulate_traffic.js` — it doesn't assume anything about
how the session got there, only what's in the log.

## Re-running after more data comes in

This script is stateless and safe to re-run any time — it always reads the
full CSV fresh and overwrites the files in `output/`. There's no need to
clear anything between runs.