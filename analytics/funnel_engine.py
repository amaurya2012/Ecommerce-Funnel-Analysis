"""
Funnel analysis engine for the E-Commerce User Behavior Funnel Analysis project.

Reads user_behavior_logs.csv (written by the Express telemetry backend) and
reconstructs, per session, how far each visitor progressed through the
instrumented funnel: browse -> product_detail -> cart -> checkout.

A session is considered to have "reached" a step if any event's targetStep
equals that step. A session is considered "abandoned" at a step if its final
logged event for that session has action == 'abandon'. A session is
considered "converted" if it has a 'purchase' action logged.
"""

from __future__ import annotations

import pandas as pd

FUNNEL_STEPS = ["browse", "product_detail", "cart", "checkout"]

STEP_LABELS = {
    "browse": "Browse Items",
    "product_detail": "View Item Details",
    "cart": "Add to Cart",
    "checkout": "Place Order",
}


def load_logs(csv_path: str) -> pd.DataFrame:
    """Loads the telemetry CSV and parses timestamps."""
    df = pd.read_csv(csv_path)
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    return df


def build_session_summary(df: pd.DataFrame) -> pd.DataFrame:
    """
    Collapses the raw event log into one row per session, capturing:
      - deepest funnel step reached
      - whether the session converted (purchase)
      - whether the session ended in an explicit abandon event
      - device type
      - session start/end timestamps
    """
    records = []

    for session_id, group in df.groupby("sessionId"):
        group = group.sort_values("timestamp")

        reached_steps = set(group["targetStep"]).union(set(group["currentStep"]))
        deepest_index = -1
        for i, step in enumerate(FUNNEL_STEPS):
            if step in reached_steps:
                deepest_index = i
        deepest_step = FUNNEL_STEPS[deepest_index] if deepest_index >= 0 else None

        converted = (group["action"] == "purchase").any()
        abandoned = (group["action"] == "abandon").any()
        device_type = group["deviceType"].iloc[0] if not group.empty else "unknown"
        user_id = group["userId"].iloc[0] if not group.empty else None

        records.append(
            {
                "sessionId": session_id,
                "userId": user_id,
                "deepestStep": deepest_step,
                "deepestStepIndex": deepest_index,
                "converted": converted,
                "abandoned": abandoned,
                "deviceType": device_type,
                "startedAt": group["timestamp"].min(),
                "endedAt": group["timestamp"].max(),
                "eventCount": len(group),
            }
        )

    return pd.DataFrame(records)


def compute_funnel_counts(session_summary: pd.DataFrame) -> pd.DataFrame:
    """
    For each funnel step, counts how many sessions reached at least that
    step, and derives step-over-step conversion and drop-off percentages.
    """
    total_sessions = len(session_summary)
    rows = []

    for i, step in enumerate(FUNNEL_STEPS):
        reached_count = (session_summary["deepestStepIndex"] >= i).sum()
        pct_of_total = (reached_count / total_sessions * 100) if total_sessions else 0
        rows.append(
            {
                "step": step,
                "label": STEP_LABELS[step],
                "sessions_reached": int(reached_count),
                "pct_of_total_sessions": round(pct_of_total, 1),
            }
        )

    funnel_df = pd.DataFrame(rows)

    # Step-over-step conversion: what fraction of the PREVIOUS step's
    # sessions made it to this step.
    step_over_step = [100.0]
    for i in range(1, len(funnel_df)):
        prev = funnel_df.loc[i - 1, "sessions_reached"]
        curr = funnel_df.loc[i, "sessions_reached"]
        rate = (curr / prev * 100) if prev else 0
        step_over_step.append(round(rate, 1))
    funnel_df["pct_of_previous_step"] = step_over_step

    funnel_df["drop_off_pct"] = (100 - funnel_df["pct_of_previous_step"]).round(1)
    funnel_df.loc[0, "drop_off_pct"] = 0.0

    return funnel_df


def compute_device_breakdown(session_summary: pd.DataFrame) -> pd.DataFrame:
    """Conversion rate and session share broken down by device type."""
    total = len(session_summary)
    rows = []
    for device, group in session_summary.groupby("deviceType"):
        session_count = len(group)
        conversions = group["converted"].sum()
        rows.append(
            {
                "deviceType": device,
                "sessions": session_count,
                "share_of_traffic_pct": round(session_count / total * 100, 1) if total else 0,
                "conversions": int(conversions),
                "conversion_rate_pct": round(conversions / session_count * 100, 1) if session_count else 0,
            }
        )
    return pd.DataFrame(rows).sort_values("sessions", ascending=False).reset_index(drop=True)


def compute_abandonment_breakdown(session_summary: pd.DataFrame) -> pd.DataFrame:
    """Where non-converted sessions are dropping off, by deepest step reached."""
    abandoned = session_summary[~session_summary["converted"]]
    total_abandoned = len(abandoned)
    rows = []
    for step_index, step in enumerate(FUNNEL_STEPS):
        count = (abandoned["deepestStepIndex"] == step_index).sum()
        pct = round(count / total_abandoned * 100, 1) if total_abandoned else 0
        rows.append({"step": step, "label": STEP_LABELS[step], "abandoned_sessions": int(count), "pct_of_abandoned": pct})
    return pd.DataFrame(rows)


def overall_conversion_rate(session_summary: pd.DataFrame) -> float:
    total = len(session_summary)
    converted = session_summary["converted"].sum()
    return round(converted / total * 100, 1) if total else 0.0