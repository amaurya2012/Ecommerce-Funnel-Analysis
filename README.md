# AURELLE — E-Commerce User Behavior Funnel Analysis

An end-to-end telemetry pipeline: a simulated premium boutique storefront (React + Tailwind, light
navy/champagne theme) streams every step transition to a Node/Express backend, which appends each
event as a row in `user_behavior_logs.csv`. A traffic simulator can generate 200 realistic sessions
with proper conversion drop-off at each stage, and a Python analytics module turns that raw log into
funnel charts, device-level conversion rates, and a written report.

## Directory structure

```
ecommerce-funnel-analysis/
├── backend/                  Express telemetry logger → CSV
│   ├── server.js
│   ├── csvLogger.js
│   └── package.json
├── frontend/                 React + Tailwind storefront
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── context/TelemetryContext.jsx
│   │   ├── hooks/useTelemetry.js
│   │   ├── components/
│   │   │   ├── NavHeader.jsx
│   │   │   ├── SessionTrail.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CategoryTiles.jsx
│   │   │   ├── BrowseProducts.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductArt.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── CartOverview.jsx
│   │   │   └── CheckoutConfirmation.jsx
│   │   └── data/products.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── simulator/                 Automated traffic generator
│   ├── simulate_traffic.js
│   └── package.json
├── analytics/                 Python funnel analysis
│   ├── funnel_engine.py
│   ├── generate_report.py
│   ├── requirements.txt
│   └── output/                (generated: charts + report)
└── README.md
```

## Running it

### 1. Backend (start this first)

```bash
cd backend
npm install
npm start
```

Listens on `http://localhost:4000`. On first request it creates `backend/user_behavior_logs.csv`
with the header row; every subsequent event is appended without touching existing rows.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. It talks to the backend at `http://localhost:4000/api/telemetry/log`
by default — override with `VITE_TELEMETRY_API_URL` in a `.env` file (see `.env.example`) if the backend
runs elsewhere.

### 3. Traffic simulator (optional, backend must already be running)

```bash
cd simulator
npm install
node simulate_traffic.js
```

Fires 200 synthetic sessions with nested conversion rates (100% browse → 70% product view → 40%
cart → 15% checkout) and prints a funnel summary to the terminal when done.

### 4. Analytics report (run after there's data in the CSV)

```bash
cd analytics
pip install -r requirements.txt
python generate_report.py
```

Reads `backend/user_behavior_logs.csv` and writes three charts plus a full markdown report to
`analytics/output/`. See `analytics/README.md` for details on how session funnel depth is derived
from the raw event log.

## Telemetry schema

Every row in `user_behavior_logs.csv`:

| field        | description                                              |
|--------------|-----------------------------------------------------------|
| `userId`     | Synthetic visitor identifier, generated client-side       |
| `sessionId`  | Identifier for one browsing session (regenerated on abandon or after checkout) |
| `currentStep`| Step the user was on before this event (`entry`, `browse`, `product_detail`, `cart`, `checkout`) |
| `targetStep` | Step the user moved to (same as `currentStep` for `abandon` events) |
| `action`     | One of `view`, `add_to_cart`, `purchase`, `abandon`       |
| `deviceType` | `desktop`, `mobile`, or `tablet`, detected from the user agent |
| `timestamp`  | ISO 8601 event time                                       |

## Design notes

The storefront uses a light "quiet e-commerce" theme: a warm paper background, a navy header and
category tiles, and a single orange accent reserved for commitment actions (Add to Cart, Place
Order, View Details). Product imagery is real photography where available, with hand-drawn line-art
illustrations as a same-layout fallback if an image ever fails to load. The `SessionTrail` component
at the top of every view mirrors the exact funnel step the visitor is on, and doubles as a visual
explanation of what the telemetry pipeline is recording underneath.

## Analytics notes

`analytics/funnel_engine.py` collapses the raw per-event CSV into one row per session — deepest step
reached, converted or not, device type — then `generate_report.py` turns that into a funnel chart, a
device-conversion chart, an abandonment breakdown, and a markdown report that calls out the single
biggest drop-off point. It's safe to re-run any time; it always reads the CSV fresh.