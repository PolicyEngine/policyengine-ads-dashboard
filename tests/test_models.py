"""Tests for data models."""

import pytest
from datetime import datetime
from policyengine_ads_dashboard.models import (
    Ad,
    AdGroup,
    Campaign,
    DailyMetrics,
    GeographicMetrics,
    Keyword,
    PlatformData,
    Summary,
)


class TestCampaign:
    def test_create_campaign(self):
        campaign = Campaign(
            id="123",
            name="Test Campaign",
            status="ENABLED",
            spend=1000.50,
            impressions=50000,
            clicks=1500,
            conversions=100,
            ctr=0.03,
        )
        assert campaign.id == "123"
        assert campaign.name == "Test Campaign"
        assert campaign.spend == 1000.50

    def test_campaign_defaults(self):
        campaign = Campaign(
            id="123",
            name="Test",
            status="ENABLED",
            spend=0,
            impressions=0,
            clicks=0,
            conversions=0,
            ctr=0,
        )
        assert campaign.conversions == 0


class TestAdGroup:
    def test_create_ad_group(self):
        ad_group = AdGroup(
            id="456",
            name="Tax Calculator",
            campaign_id="123",
            campaign_name="PolicyEngine: US",
            spend=500.25,
            impressions=25000,
            clicks=750,
            conversions=50,
        )
        assert ad_group.campaign_id == "123"
        assert ad_group.spend == 500.25


class TestAd:
    def test_create_ad_with_copy(self):
        ad = Ad(
            ad_id="789",
            ad_group_id="456",
            ad_group_name="Tax Calculator",
            campaign_id="123",
            campaign_name="PolicyEngine: US",
            status="ENABLED",
            final_urls=["https://policyengine.org/us"],
            headlines=["Free Tax Calculator", "Policy Analysis Tool"],
            descriptions=["Calculate your taxes instantly"],
            spend=100.00,
            impressions=5000,
            clicks=150,
            conversions=10,
        )
        assert ad.headlines == ["Free Tax Calculator", "Policy Analysis Tool"]
        assert ad.final_urls == ["https://policyengine.org/us"]

    def test_ad_empty_headlines(self):
        ad = Ad(
            ad_id="789",
            ad_group_id="456",
            ad_group_name="Test",
            campaign_id="123",
            campaign_name="Test",
            status="ENABLED",
            final_urls=[],
            headlines=[],
            descriptions=[],
            spend=0,
            impressions=0,
            clicks=0,
            conversions=0,
        )
        assert ad.headlines == []


class TestKeyword:
    def test_create_keyword(self):
        keyword = Keyword(
            text="tax calculator",
            match_type="BROAD",
            campaign_name="PolicyEngine: US",
            spend=200.00,
            impressions=10000,
            clicks=300,
            ctr=0.03,
        )
        assert keyword.text == "tax calculator"
        assert keyword.match_type == "BROAD"


class TestGeographicMetrics:
    def test_create_geo_metrics(self):
        geo = GeographicMetrics(
            location_name="United States",
            country_code="US",
            spend=5000.00,
            impressions=100000,
            clicks=3000,
            conversions=200,
        )
        assert geo.country_code == "US"


class TestDailyMetrics:
    def test_create_daily_metrics(self):
        daily = DailyMetrics(
            date="2026-01-24",
            spend=100.00,
            impressions=5000,
            clicks=150,
            conversions=10,
        )
        assert daily.date == "2026-01-24"


class TestSummary:
    def test_create_summary(self):
        summary = Summary(
            total_spend=27412.92,
            total_impressions=124684,
            total_clicks=4714,
            ctr=0.0378,
            conversions=1132,
            avg_cpc=5.82,
        )
        assert summary.total_spend == 27412.92
        assert summary.ctr == 0.0378


class TestPlatformData:
    def test_create_platform_data(self):
        data = PlatformData(
            platform="google_ads",
            platform_name="Google Ads",
            last_updated=datetime.now(),
            date_range_start="2025-01-24",
            date_range_end="2026-01-24",
            summary=Summary(
                total_spend=1000,
                total_impressions=50000,
                total_clicks=1500,
                ctr=0.03,
                conversions=100,
                avg_cpc=0.67,
            ),
            campaigns=[],
            ad_groups=[],
            ads=[],
            keywords=[],
            geography=[],
            daily=[],
        )
        assert data.platform == "google_ads"
        assert data.summary.total_spend == 1000

    def test_platform_data_to_dict(self):
        data = PlatformData(
            platform="google_ads",
            platform_name="Google Ads",
            last_updated=datetime(2026, 1, 24, 12, 0, 0),
            date_range_start="2025-01-24",
            date_range_end="2026-01-24",
            summary=Summary(
                total_spend=1000,
                total_impressions=50000,
                total_clicks=1500,
                ctr=0.03,
                conversions=100,
                avg_cpc=0.67,
            ),
            campaigns=[],
            ad_groups=[],
            ads=[],
            keywords=[],
            geography=[],
            daily=[],
        )
        result = data.to_json_dict()
        assert result["platform"] == "google_ads"
        assert "date_range" in result
        assert result["date_range"]["start"] == "2025-01-24"
