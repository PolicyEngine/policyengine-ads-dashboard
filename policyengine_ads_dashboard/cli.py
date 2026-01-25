"""CLI for fetching ads data."""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

from policyengine_ads_dashboard.fetcher import GoogleAdsFetcher


def main() -> int:
    """Fetch Google Ads data and write to JSON file."""
    # Date range: last 365 days
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")

    print("Fetching Google Ads data...")
    print(f"Date range: {start_date} to {end_date}")

    try:
        fetcher = GoogleAdsFetcher.from_env()
    except KeyError as e:
        print(f"Missing environment variable: {e}")
        return 1

    print("Fetching campaigns...")
    data = fetcher.fetch_all(start_date, end_date)

    # Write to file
    output_path = Path(__file__).parent.parent / "public" / "data" / "google-ads.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(data.to_json_dict(), f, indent=2)

    print(f"Data written to {output_path}")
    print(f"Summary: ${data.summary.total_spend:,.2f} spend")
    print(f"  {data.summary.total_impressions:,} impressions")
    print(f"  {data.summary.total_clicks:,} clicks")
    print(f"  {data.summary.conversions:,} conversions")
    print(f"  {len(data.campaigns)} campaigns")
    print(f"  {len(data.ad_groups)} ad groups")
    print(f"  {len(data.ads)} ads")

    return 0


if __name__ == "__main__":
    sys.exit(main())
