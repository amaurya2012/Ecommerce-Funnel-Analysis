"""
Generates the full funnel analysis report for the AURELLE telemetry pipeline.

Usage:
    python generate_report.py [path_to_csv]

If no path is given, defaults to ../backend/user_behavior_logs.csv relative
to this script's location. Outputs are written to ./output/:
    - funnel_chart.png
    - device_conversion_chart.png
    - abandonment_chart.png
    - funnel_report.md
"""

from __future__ import annotations

import os
import sys
from datetime import datetime

import matplotlib
import matplotlib.pyplot as plt
import pandas as pd

matplotlib.use("Agg")

from funnel_engine import (
    FUNNEL_STEPS,
    build_session_summary,
    compute_abandonment_breakdown,
    compute_device_breakdown,
    compute_funnel_counts,
    load_logs,
    overall_conversion_rate,
)

NAVY = "#17223B"
ORANGE = "#E2793D"
INK_MID = "#635C4E"
LINE = "#E6E0D0"
PAPER = "#F7F4EC"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CSV_PATH = os.path.join(SCRIPT_DIR, "..", "backend", "user_behavior_logs.csv")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")


def style_axes(ax):
    ax.set_facecolor(PAPER)
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color(LINE)
    ax.tick_params(colors=INK_MID, labelsize=9)
    ax.yaxis.grid(True, color=LINE, linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)


def plot_funnel_chart(funnel_df: pd.DataFrame, output_path: str):
    fig, ax = plt.subplots(figsize=(8, 5), facecolor=PAPER)
    style_axes(ax)

    labels = funnel_df["label"]
    counts = funnel_df["sessions_reached"]
    max_count = counts.max()

    bars = ax.barh(labels, counts, color=NAVY, height=0.55, zorder=3)
    bars[-1].set_color(ORANGE)

    for i, (count, pct) in enumerate(zip(counts, funnel_df["pct_of_total_sessions"])):
        ax.text(count + max_count * 0.02, i, f"{count} sessions ({pct}%)", va="center", fontsize=9.5, color="#1C1B17")

    ax.invert_yaxis()
    ax.set_xlim(0, max_count * 135 / 100 + 1)
    ax.set_title("Funnel Drop-off by Step", fontsize=13, color="#1C1B17", pad=14, fontweight="bold")
    ax.set_xlabel("Sessions")

    fig.tight_layout()
    fig.savefig(output_path, dpi=160, facecolor=PAPER)
    plt.close(fig)


def plot_device_chart(device_df: pd.DataFrame, output_path: str):
    fig, ax = plt.subplots(figsize=(7, 4.5), facecolor=PAPER)
    style_axes(ax)

    x = range(len(device_df))
    bars = ax.bar(x, device_df["conversion_rate_pct"], color=NAVY, width=0.5, zorder=3)
    for bar, device_type in zip(bars, device_df["deviceType"]):
        if device_type == "mobile":
            bar.set_color(ORANGE)

    ax.set_xticks(list(x))
    ax.set_xticklabels([d.capitalize() for d in device_df["deviceType"]])

    for i, (rate, sessions) in enumerate(zip(device_df["conversion_rate_pct"], device_df["sessions"])):
        ax.text(i, rate + 0.5, f"{rate}%\n(n={sessions})", ha="center", fontsize=9.5, color="#1C1B17")

    ax.set_ylim(0, max(device_df["conversion_rate_pct"].max() * 1.35, 5))
    ax.set_title("Conversion Rate by Device Type", fontsize=13, color="#1C1B17", pad=14, fontweight="bold")
    ax.set_ylabel("Conversion rate (%)")

    fig.tight_layout()
    fig.savefig(output_path, dpi=160, facecolor=PAPER)
    plt.close(fig)


def plot_abandonment_chart(abandon_df: pd.DataFrame, output_path: str):
    fig, ax = plt.subplots(figsize=(7, 4.5), facecolor=PAPER)
    style_axes(ax)

    colors = [NAVY, NAVY, ORANGE, ORANGE]
    ax.bar(abandon_df["label"], abandon_df["abandoned_sessions"], color=colors[: len(abandon_df)], width=0.5, zorder=3)

    for i, (count, pct) in enumerate(zip(abandon_df["abandoned_sessions"], abandon_df["pct_of_abandoned"])):
        ax.text(i, count + 0.3, f"{count}\n({pct}%)", ha="center", fontsize=9.5, color="#1C1B17")

    ax.set_title("Where Non-Converting Sessions Stop", fontsize=13, color="#1C1B17", pad=14, fontweight="bold")
    ax.set_ylabel("Abandoned sessions")
    plt.setp(ax.get_xticklabels(), rotation=12, ha="right")

    fig.tight_layout()
    fig.savefig(output_path, dpi=160, facecolor=PAPER)
    plt.close(fig)


def write_markdown_report(
    funnel_df: pd.DataFrame,
    device_df: pd.DataFrame,
    abandon_df: pd.DataFrame,
    overall_rate: float,
    total_sessions: int,
    report_path: str,
):
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    lines = []
    lines.append("# Funnel Analysis Report")
    lines.append("")
    lines.append(f"Generated {generated_at} · {total_sessions} sessions analyzed")
    lines.append("")
    lines.append(f"**Overall conversion rate: {overall_rate}%** (visits that reached Place Order)")
    lines.append("")
    lines.append("## Funnel by step")
    lines.append("")
    lines.append("![Funnel chart](output/funnel_chart.png)")
    lines.append("")
    lines.append("| Step | Sessions reached | % of total | % of previous step | Drop-off |")
    lines.append("|---|---|---|---|---|")
    for _, row in funnel_df.iterrows():
        lines.append(
            f"| {row['label']} | {row['sessions_reached']} | {row['pct_of_total_sessions']}% "
            f"| {row['pct_of_previous_step']}% | {row['drop_off_pct']}% |"
        )
    lines.append("")
    lines.append("## Conversion by device type")
    lines.append("")
    lines.append("![Device conversion chart](output/device_conversion_chart.png)")
    lines.append("")
    lines.append("| Device | Sessions | Share of traffic | Conversions | Conversion rate |")
    lines.append("|---|---|---|---|---|")
    for _, row in device_df.iterrows():
        lines.append(
            f"| {row['deviceType'].capitalize()} | {row['sessions']} | {row['share_of_traffic_pct']}% "
            f"| {row['conversions']} | {row['conversion_rate_pct']}% |"
        )
    lines.append("")
    lines.append("## Where abandoned sessions stop")
    lines.append("")
    lines.append("![Abandonment chart](output/abandonment_chart.png)")
    lines.append("")
    lines.append("| Step reached | Abandoned sessions | % of all abandons |")
    lines.append("|---|---|---|")
    for _, row in abandon_df.iterrows():
        lines.append(f"| {row['label']} | {row['abandoned_sessions']} | {row['pct_of_abandoned']}% |")
    lines.append("")

    biggest_drop_row = funnel_df.iloc[1:].loc[funnel_df.iloc[1:]["drop_off_pct"].idxmax()]
    lines.append("## Key takeaway")
    lines.append("")
    lines.append(
        f"The steepest drop-off happens between **{funnel_df.iloc[funnel_df.index.get_loc(biggest_drop_row.name) - 1]['label']}** "
        f"and **{biggest_drop_row['label']}**, losing **{biggest_drop_row['drop_off_pct']}%** of sessions at that transition. "
        "This is the highest-leverage point to investigate first — e.g. pricing clarity, page load time, or "
        "unclear next-step CTAs at that stage."
    )
    lines.append("")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    csv_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CSV_PATH
    csv_path = os.path.abspath(csv_path)

    if not os.path.exists(csv_path):
        print(f"Could not find telemetry CSV at: {csv_path}")
        print("Run the backend and simulator (or use the live shop) to generate data first.")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Reading telemetry log: {csv_path}")
    df = load_logs(csv_path)
    session_summary = build_session_summary(df)

    funnel_df = compute_funnel_counts(session_summary)
    device_df = compute_device_breakdown(session_summary)
    abandon_df = compute_abandonment_breakdown(session_summary)
    overall_rate = overall_conversion_rate(session_summary)
    total_sessions = len(session_summary)

    plot_funnel_chart(funnel_df, os.path.join(OUTPUT_DIR, "funnel_chart.png"))
    plot_device_chart(device_df, os.path.join(OUTPUT_DIR, "device_conversion_chart.png"))
    plot_abandonment_chart(abandon_df, os.path.join(OUTPUT_DIR, "abandonment_chart.png"))

    report_path = os.path.join(OUTPUT_DIR, "funnel_report.md")
    write_markdown_report(funnel_df, device_df, abandon_df, overall_rate, total_sessions, report_path)

    print(f"\nTotal sessions analyzed: {total_sessions}")
    print(f"Overall conversion rate: {overall_rate}%")
    print("\nFunnel by step:")
    print(funnel_df[["label", "sessions_reached", "pct_of_total_sessions", "drop_off_pct"]].to_string(index=False))
    print("\nConversion by device type:")
    print(device_df[["deviceType", "sessions", "conversion_rate_pct"]].to_string(index=False))
    print(f"\nCharts and report written to: {OUTPUT_DIR}")
    print(f"Full report: {report_path}")


if __name__ == "__main__":
    main()