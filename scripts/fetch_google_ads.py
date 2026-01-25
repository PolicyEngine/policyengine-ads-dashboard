#!/usr/bin/env python3
"""Fetch Google Ads performance data and save to JSON."""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException


def get_client():
    """Create Google Ads client from environment variables."""
    config = {
        "client_id": os.environ["GOOGLE_ADS_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token": os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
        "developer_token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "login_customer_id": os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
        "use_proto_plus": True,
    }
    return GoogleAdsClient.load_from_dict(config)


def fetch_campaign_performance(client, customer_id, start_date, end_date):
    """Fetch campaign-level performance metrics."""
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.ctr
        FROM campaign
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
        AND campaign.status != 'REMOVED'
    """

    campaigns = []
    response = ga_service.search(customer_id=customer_id, query=query)

    for row in response:
        campaigns.append({
            "id": str(row.campaign.id),
            "name": row.campaign.name,
            "status": row.campaign.status.name,
            "spend": row.metrics.cost_micros / 1_000_000,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "conversions": row.metrics.conversions,
            "ctr": row.metrics.ctr,
        })

    return campaigns


def fetch_ad_group_performance(client, customer_id, start_date, end_date):
    """Fetch ad group-level performance metrics."""
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            campaign.id,
            campaign.name,
            ad_group.id,
            ad_group.name,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions
        FROM ad_group
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
        AND ad_group.status != 'REMOVED'
    """

    ad_groups = []
    response = ga_service.search(customer_id=customer_id, query=query)

    for row in response:
        ad_groups.append({
            "campaign_id": str(row.campaign.id),
            "campaign_name": row.campaign.name,
            "id": str(row.ad_group.id),
            "name": row.ad_group.name,
            "spend": row.metrics.cost_micros / 1_000_000,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "conversions": row.metrics.conversions,
        })

    return ad_groups


def fetch_keyword_performance(client, customer_id, start_date, end_date, limit=50):
    """Fetch top keywords by spend."""
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            campaign.name,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr
        FROM keyword_view
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
        ORDER BY metrics.cost_micros DESC
        LIMIT {limit}
    """

    keywords = []
    response = ga_service.search(customer_id=customer_id, query=query)

    for row in response:
        keywords.append({
            "text": row.ad_group_criterion.keyword.text,
            "match_type": row.ad_group_criterion.keyword.match_type.name,
            "campaign_name": row.campaign.name,
            "spend": row.metrics.cost_micros / 1_000_000,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "ctr": row.metrics.ctr,
        })

    return keywords


def fetch_geographic_performance(client, customer_id, start_date, end_date):
    """Fetch geographic performance breakdown."""
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            geographic_view.country_criterion_id,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions
        FROM geographic_view
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
    """

    # Country ID to name mapping (common ones)
    country_names = {
        2840: ("United States", "US"),
        2826: ("United Kingdom", "UK"),
        2124: ("Canada", "CA"),
        2036: ("Australia", "AU"),
    }

    geography = {}
    response = ga_service.search(customer_id=customer_id, query=query)

    for row in response:
        country_id = row.geographic_view.country_criterion_id
        if country_id not in geography:
            name, code = country_names.get(country_id, (f"Country {country_id}", str(country_id)))
            geography[country_id] = {
                "location_name": name,
                "country_code": code,
                "spend": 0,
                "impressions": 0,
                "clicks": 0,
                "conversions": 0,
            }

        geography[country_id]["spend"] += row.metrics.cost_micros / 1_000_000
        geography[country_id]["impressions"] += row.metrics.impressions
        geography[country_id]["clicks"] += row.metrics.clicks
        geography[country_id]["conversions"] += row.metrics.conversions

    return list(geography.values())


def fetch_daily_performance(client, customer_id, start_date, end_date):
    """Fetch daily performance time series."""
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            segments.date,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions
        FROM customer
        WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
        ORDER BY segments.date
    """

    daily = []
    response = ga_service.search(customer_id=customer_id, query=query)

    for row in response:
        daily.append({
            "date": row.segments.date,
            "spend": row.metrics.cost_micros / 1_000_000,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "conversions": row.metrics.conversions,
        })

    return daily


def main():
    customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]

    # Date range: last 365 days
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")

    print(f"Fetching Google Ads data for customer {customer_id}")
    print(f"Date range: {start_date} to {end_date}")

    client = get_client()

    # Fetch all data
    print("Fetching campaign performance...")
    campaigns = fetch_campaign_performance(client, customer_id, start_date, end_date)

    print("Fetching ad group performance...")
    ad_groups = fetch_ad_group_performance(client, customer_id, start_date, end_date)

    print("Fetching keyword performance...")
    keywords = fetch_keyword_performance(client, customer_id, start_date, end_date)

    print("Fetching geographic performance...")
    geography = fetch_geographic_performance(client, customer_id, start_date, end_date)

    print("Fetching daily performance...")
    daily = fetch_daily_performance(client, customer_id, start_date, end_date)

    # Calculate summary
    total_spend = sum(c["spend"] for c in campaigns)
    total_impressions = sum(c["impressions"] for c in campaigns)
    total_clicks = sum(c["clicks"] for c in campaigns)
    total_conversions = sum(c["conversions"] for c in campaigns)
    ctr = total_clicks / total_impressions if total_impressions > 0 else 0
    avg_cpc = total_spend / total_clicks if total_clicks > 0 else 0

    # Build output
    output = {
        "platform": "google_ads",
        "platform_name": "Google Ads",
        "last_updated": datetime.utcnow().isoformat() + "Z",
        "date_range": {
            "start": start_date,
            "end": end_date,
        },
        "summary": {
            "total_spend": round(total_spend, 2),
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "ctr": round(ctr, 4),
            "conversions": int(total_conversions),
            "avg_cpc": round(avg_cpc, 2),
        },
        "daily": daily,
        "campaigns": campaigns,
        "ad_groups": ad_groups,
        "keywords": keywords,
        "geography": geography,
    }

    # Write to file
    output_path = Path(__file__).parent.parent / "public" / "data" / "google-ads.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Data written to {output_path}")
    print(f"Summary: ${total_spend:.2f} spend, {total_impressions:,} impressions, {total_clicks:,} clicks")


if __name__ == "__main__":
    try:
        main()
    except GoogleAdsException as e:
        print(f"Google Ads API error: {e}")
        raise
