"""Tests for Google Ads data fetcher."""

import pytest
from unittest.mock import Mock, patch, MagicMock
from policyengine_ads_dashboard.fetcher import GoogleAdsFetcher, COUNTRY_NAMES


class TestCountryNames:
    def test_us_mapping(self):
        assert COUNTRY_NAMES[2840] == ("United States", "US")

    def test_uk_mapping(self):
        assert COUNTRY_NAMES[2826] == ("United Kingdom", "UK")

    def test_has_common_countries(self):
        # Verify common countries are mapped
        assert 2124 in COUNTRY_NAMES  # Canada
        assert 2036 in COUNTRY_NAMES  # Australia
        assert 2276 in COUNTRY_NAMES  # Germany
        assert 2250 in COUNTRY_NAMES  # France


class TestGoogleAdsFetcher:
    @pytest.fixture
    def mock_config(self):
        return {
            "client_id": "test_client_id",
            "client_secret": "test_secret",
            "refresh_token": "test_token",
            "developer_token": "test_dev_token",
            "login_customer_id": "123456789",
        }

    @pytest.fixture
    def fetcher(self, mock_config):
        with patch(
            "policyengine_ads_dashboard.fetcher.GoogleAdsClient"
        ) as mock_client_class:
            mock_client = Mock()
            mock_client_class.load_from_dict.return_value = mock_client
            return GoogleAdsFetcher(mock_config, customer_id="9682183278")

    def test_init_creates_client(self, mock_config):
        with patch(
            "policyengine_ads_dashboard.fetcher.GoogleAdsClient"
        ) as mock_client_class:
            fetcher = GoogleAdsFetcher(mock_config, customer_id="123")
            mock_client_class.load_from_dict.assert_called_once()

    def test_fetch_campaigns(self, fetcher):
        # Mock the search response
        mock_row = Mock()
        mock_row.campaign.id = 123
        mock_row.campaign.name = "Test Campaign"
        mock_row.campaign.status.name = "ENABLED"
        mock_row.metrics.cost_micros = 1000000000  # $1000
        mock_row.metrics.impressions = 50000
        mock_row.metrics.clicks = 1500
        mock_row.metrics.conversions = 100.5
        mock_row.metrics.ctr = 0.03

        mock_service = Mock()
        mock_service.search.return_value = [mock_row]
        fetcher.client.get_service.return_value = mock_service

        campaigns = fetcher.fetch_campaigns("2025-01-01", "2026-01-24")

        assert len(campaigns) == 1
        assert campaigns[0].id == "123"
        assert campaigns[0].name == "Test Campaign"
        assert campaigns[0].spend == 1000.0
        assert campaigns[0].impressions == 50000

    def test_fetch_ads_with_headlines(self, fetcher):
        # Mock ad response with responsive search ad
        mock_row = Mock()
        mock_row.campaign.id = 123
        mock_row.campaign.name = "Campaign"
        mock_row.ad_group.id = 456
        mock_row.ad_group.name = "Ad Group"
        mock_row.ad_group_ad.ad.id = 789
        mock_row.ad_group_ad.status.name = "ENABLED"
        mock_row.ad_group_ad.ad.final_urls = ["https://example.com"]

        # Mock headlines
        headline1 = Mock()
        headline1.text = "Headline 1"
        headline2 = Mock()
        headline2.text = "Headline 2"
        mock_row.ad_group_ad.ad.responsive_search_ad.headlines = [
            headline1,
            headline2,
        ]

        # Mock descriptions
        desc1 = Mock()
        desc1.text = "Description 1"
        mock_row.ad_group_ad.ad.responsive_search_ad.descriptions = [desc1]

        mock_row.metrics.cost_micros = 500000000
        mock_row.metrics.impressions = 10000
        mock_row.metrics.clicks = 300
        mock_row.metrics.conversions = 25.0

        mock_service = Mock()
        mock_service.search.return_value = [mock_row]
        fetcher.client.get_service.return_value = mock_service

        ads = fetcher.fetch_ads("2025-01-01", "2026-01-24")

        assert len(ads) == 1
        assert ads[0].headlines == ["Headline 1", "Headline 2"]
        assert ads[0].descriptions == ["Description 1"]
        assert ads[0].final_urls == ["https://example.com"]
        assert ads[0].spend == 500.0

    def test_fetch_geography_resolves_country_names(self, fetcher):
        mock_row = Mock()
        mock_row.geographic_view.country_criterion_id = 2840  # US
        mock_row.metrics.cost_micros = 1000000000
        mock_row.metrics.impressions = 50000
        mock_row.metrics.clicks = 1500
        mock_row.metrics.conversions = 100

        mock_service = Mock()
        mock_service.search.return_value = [mock_row]
        fetcher.client.get_service.return_value = mock_service

        geography = fetcher.fetch_geography("2025-01-01", "2026-01-24")

        assert len(geography) == 1
        assert geography[0].location_name == "United States"
        assert geography[0].country_code == "US"

    def test_fetch_geography_unknown_country(self, fetcher):
        mock_row = Mock()
        mock_row.geographic_view.country_criterion_id = 9999  # Unknown
        mock_row.metrics.cost_micros = 100000
        mock_row.metrics.impressions = 100
        mock_row.metrics.clicks = 5
        mock_row.metrics.conversions = 0

        mock_service = Mock()
        mock_service.search.return_value = [mock_row]
        fetcher.client.get_service.return_value = mock_service

        geography = fetcher.fetch_geography("2025-01-01", "2026-01-24")

        assert geography[0].location_name == "Country 9999"
        assert geography[0].country_code == "9999"

    def test_fetch_all_returns_platform_data(self, fetcher):
        # Mock all responses
        mock_service = Mock()
        mock_service.search.return_value = []
        fetcher.client.get_service.return_value = mock_service

        data = fetcher.fetch_all("2025-01-01", "2026-01-24")

        assert data.platform == "google_ads"
        assert data.platform_name == "Google Ads"
        assert data.date_range_start == "2025-01-01"
        assert data.date_range_end == "2026-01-24"


class TestFetcherFromEnv:
    def test_from_env_reads_environment(self):
        env_vars = {
            "GOOGLE_ADS_CLIENT_ID": "test_id",
            "GOOGLE_ADS_CLIENT_SECRET": "test_secret",
            "GOOGLE_ADS_REFRESH_TOKEN": "test_token",
            "GOOGLE_ADS_DEVELOPER_TOKEN": "test_dev",
            "GOOGLE_ADS_CUSTOMER_ID": "123456789",
            "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "987654321",
        }
        with patch.dict("os.environ", env_vars):
            with patch(
                "policyengine_ads_dashboard.fetcher.GoogleAdsClient"
            ) as mock_client:
                fetcher = GoogleAdsFetcher.from_env()
                assert fetcher.customer_id == "123456789"
