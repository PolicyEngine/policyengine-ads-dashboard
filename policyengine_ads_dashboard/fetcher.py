"""Google Ads data fetcher."""

import os
from datetime import datetime, timezone
from typing import Any

from google.ads.googleads.client import GoogleAdsClient

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

# Google Ads geo target criterion ID to country name/code mapping
COUNTRY_NAMES: dict[int, tuple[str, str]] = {
    2004: ("Afghanistan", "AF"),
    2008: ("Albania", "AL"),
    2012: ("Algeria", "DZ"),
    2020: ("Andorra", "AD"),
    2024: ("Angola", "AO"),
    2031: ("Azerbaijan", "AZ"),
    2032: ("Argentina", "AR"),
    2036: ("Australia", "AU"),
    2040: ("Austria", "AT"),
    2048: ("Bahrain", "BH"),
    2050: ("Bangladesh", "BD"),
    2051: ("Armenia", "AM"),
    2056: ("Belgium", "BE"),
    2068: ("Bolivia", "BO"),
    2070: ("Bosnia and Herzegovina", "BA"),
    2076: ("Brazil", "BR"),
    2100: ("Bulgaria", "BG"),
    2104: ("Myanmar", "MM"),
    2116: ("Cambodia", "KH"),
    2124: ("Canada", "CA"),
    2144: ("Sri Lanka", "LK"),
    2152: ("Chile", "CL"),
    2156: ("China", "CN"),
    2158: ("Taiwan", "TW"),
    2170: ("Colombia", "CO"),
    2188: ("Costa Rica", "CR"),
    2191: ("Croatia", "HR"),
    2196: ("Cyprus", "CY"),
    2203: ("Czech Republic", "CZ"),
    2208: ("Denmark", "DK"),
    2214: ("Dominican Republic", "DO"),
    2218: ("Ecuador", "EC"),
    2233: ("Estonia", "EE"),
    2246: ("Finland", "FI"),
    2250: ("France", "FR"),
    2268: ("Georgia", "GE"),
    2276: ("Germany", "DE"),
    2288: ("Ghana", "GH"),
    2300: ("Greece", "GR"),
    2320: ("Guatemala", "GT"),
    2344: ("Hong Kong", "HK"),
    2348: ("Hungary", "HU"),
    2352: ("Iceland", "IS"),
    2356: ("India", "IN"),
    2360: ("Indonesia", "ID"),
    2364: ("Iran", "IR"),
    2368: ("Iraq", "IQ"),
    2372: ("Ireland", "IE"),
    2376: ("Israel", "IL"),
    2380: ("Italy", "IT"),
    2384: ("Ivory Coast", "CI"),
    2392: ("Japan", "JP"),
    2398: ("Kazakhstan", "KZ"),
    2400: ("Jordan", "JO"),
    2404: ("Kenya", "KE"),
    2410: ("South Korea", "KR"),
    2414: ("Kuwait", "KW"),
    2422: ("Lebanon", "LB"),
    2428: ("Latvia", "LV"),
    2440: ("Lithuania", "LT"),
    2442: ("Luxembourg", "LU"),
    2458: ("Malaysia", "MY"),
    2470: ("Malta", "MT"),
    2484: ("Mexico", "MX"),
    2498: ("Moldova", "MD"),
    2504: ("Morocco", "MA"),
    2528: ("Netherlands", "NL"),
    2554: ("New Zealand", "NZ"),
    2558: ("Nicaragua", "NI"),
    2566: ("Nigeria", "NG"),
    2578: ("Norway", "NO"),
    2586: ("Pakistan", "PK"),
    2591: ("Panama", "PA"),
    2600: ("Paraguay", "PY"),
    2604: ("Peru", "PE"),
    2608: ("Philippines", "PH"),
    2616: ("Poland", "PL"),
    2620: ("Portugal", "PT"),
    2630: ("Puerto Rico", "PR"),
    2634: ("Qatar", "QA"),
    2642: ("Romania", "RO"),
    2643: ("Russia", "RU"),
    2682: ("Saudi Arabia", "SA"),
    2686: ("Senegal", "SN"),
    2688: ("Serbia", "RS"),
    2702: ("Singapore", "SG"),
    2703: ("Slovakia", "SK"),
    2704: ("Vietnam", "VN"),
    2705: ("Slovenia", "SI"),
    2710: ("South Africa", "ZA"),
    2724: ("Spain", "ES"),
    2752: ("Sweden", "SE"),
    2756: ("Switzerland", "CH"),
    2764: ("Thailand", "TH"),
    2784: ("United Arab Emirates", "AE"),
    2788: ("Tunisia", "TN"),
    2792: ("Turkey", "TR"),
    2804: ("Ukraine", "UA"),
    2818: ("Egypt", "EG"),
    2826: ("United Kingdom", "UK"),
    2834: ("Tanzania", "TZ"),
    2840: ("United States", "US"),
    2854: ("Burkina Faso", "BF"),
    2858: ("Uruguay", "UY"),
    2860: ("Uzbekistan", "UZ"),
    2862: ("Venezuela", "VE"),
}


class GoogleAdsFetcher:
    """Fetches advertising data from Google Ads API."""

    def __init__(self, config: dict[str, Any], customer_id: str):
        """Initialize with config dict and customer ID."""
        config["use_proto_plus"] = True
        self.client = GoogleAdsClient.load_from_dict(config)
        self.customer_id = customer_id

    @classmethod
    def from_env(cls) -> "GoogleAdsFetcher":
        """Create fetcher from environment variables."""
        config = {
            "client_id": os.environ["GOOGLE_ADS_CLIENT_ID"],
            "client_secret": os.environ["GOOGLE_ADS_CLIENT_SECRET"],
            "refresh_token": os.environ["GOOGLE_ADS_REFRESH_TOKEN"],
            "developer_token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
            "login_customer_id": os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
        }
        customer_id = os.environ["GOOGLE_ADS_CUSTOMER_ID"]
        return cls(config, customer_id)

    def fetch_campaigns(self, start_date: str, end_date: str) -> list[Campaign]:
        """Fetch campaign-level performance metrics."""
        ga_service = self.client.get_service("GoogleAdsService")

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
        for row in ga_service.search(customer_id=self.customer_id, query=query):
            campaigns.append(
                Campaign(
                    id=str(row.campaign.id),
                    name=row.campaign.name,
                    status=row.campaign.status.name,
                    spend=row.metrics.cost_micros / 1_000_000,
                    impressions=row.metrics.impressions,
                    clicks=row.metrics.clicks,
                    conversions=row.metrics.conversions,
                    ctr=row.metrics.ctr,
                )
            )

        return campaigns

    def fetch_ad_groups(self, start_date: str, end_date: str) -> list[AdGroup]:
        """Fetch ad group-level performance metrics."""
        ga_service = self.client.get_service("GoogleAdsService")

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
        for row in ga_service.search(customer_id=self.customer_id, query=query):
            ad_groups.append(
                AdGroup(
                    id=str(row.ad_group.id),
                    name=row.ad_group.name,
                    campaign_id=str(row.campaign.id),
                    campaign_name=row.campaign.name,
                    spend=row.metrics.cost_micros / 1_000_000,
                    impressions=row.metrics.impressions,
                    clicks=row.metrics.clicks,
                    conversions=row.metrics.conversions,
                )
            )

        return ad_groups

    def fetch_ads(self, start_date: str, end_date: str) -> list[Ad]:
        """Fetch ad-level details including copy and URLs."""
        ga_service = self.client.get_service("GoogleAdsService")

        query = f"""
            SELECT
                campaign.id,
                campaign.name,
                ad_group.id,
                ad_group.name,
                ad_group_ad.ad.id,
                ad_group_ad.ad.final_urls,
                ad_group_ad.ad.responsive_search_ad.headlines,
                ad_group_ad.ad.responsive_search_ad.descriptions,
                ad_group_ad.status,
                metrics.cost_micros,
                metrics.impressions,
                metrics.clicks,
                metrics.conversions
            FROM ad_group_ad
            WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
            AND ad_group_ad.status != 'REMOVED'
        """

        ads = []
        for row in ga_service.search(customer_id=self.customer_id, query=query):
            ad = row.ad_group_ad.ad
            headlines = []
            descriptions = []

            if ad.responsive_search_ad:
                for headline in ad.responsive_search_ad.headlines:
                    headlines.append(headline.text)
                for desc in ad.responsive_search_ad.descriptions:
                    descriptions.append(desc.text)

            final_urls = list(ad.final_urls) if ad.final_urls else []

            ads.append(
                Ad(
                    ad_id=str(ad.id),
                    ad_group_id=str(row.ad_group.id),
                    ad_group_name=row.ad_group.name,
                    campaign_id=str(row.campaign.id),
                    campaign_name=row.campaign.name,
                    status=row.ad_group_ad.status.name,
                    final_urls=final_urls,
                    headlines=headlines,
                    descriptions=descriptions,
                    spend=row.metrics.cost_micros / 1_000_000,
                    impressions=row.metrics.impressions,
                    clicks=row.metrics.clicks,
                    conversions=row.metrics.conversions,
                )
            )

        return ads

    def fetch_keywords(
        self, start_date: str, end_date: str, limit: int = 50
    ) -> list[Keyword]:
        """Fetch top keywords by spend."""
        ga_service = self.client.get_service("GoogleAdsService")

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
        for row in ga_service.search(customer_id=self.customer_id, query=query):
            keywords.append(
                Keyword(
                    text=row.ad_group_criterion.keyword.text,
                    match_type=row.ad_group_criterion.keyword.match_type.name,
                    campaign_name=row.campaign.name,
                    spend=row.metrics.cost_micros / 1_000_000,
                    impressions=row.metrics.impressions,
                    clicks=row.metrics.clicks,
                    ctr=row.metrics.ctr,
                )
            )

        return keywords

    def fetch_geography(
        self, start_date: str, end_date: str
    ) -> list[GeographicMetrics]:
        """Fetch geographic performance breakdown."""
        ga_service = self.client.get_service("GoogleAdsService")

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

        geography: dict[int, GeographicMetrics] = {}
        for row in ga_service.search(customer_id=self.customer_id, query=query):
            country_id = row.geographic_view.country_criterion_id
            if country_id not in geography:
                name, code = COUNTRY_NAMES.get(
                    country_id, (f"Country {country_id}", str(country_id))
                )
                geography[country_id] = GeographicMetrics(
                    location_name=name,
                    country_code=code,
                    spend=0,
                    impressions=0,
                    clicks=0,
                    conversions=0,
                )

            geo = geography[country_id]
            geography[country_id] = GeographicMetrics(
                location_name=geo.location_name,
                country_code=geo.country_code,
                spend=geo.spend + row.metrics.cost_micros / 1_000_000,
                impressions=geo.impressions + row.metrics.impressions,
                clicks=geo.clicks + row.metrics.clicks,
                conversions=geo.conversions + row.metrics.conversions,
            )

        return list(geography.values())

    def fetch_daily(self, start_date: str, end_date: str) -> list[DailyMetrics]:
        """Fetch daily performance time series."""
        ga_service = self.client.get_service("GoogleAdsService")

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
        for row in ga_service.search(customer_id=self.customer_id, query=query):
            daily.append(
                DailyMetrics(
                    date=row.segments.date,
                    spend=row.metrics.cost_micros / 1_000_000,
                    impressions=row.metrics.impressions,
                    clicks=row.metrics.clicks,
                    conversions=row.metrics.conversions,
                )
            )

        return daily

    def fetch_all(self, start_date: str, end_date: str) -> PlatformData:
        """Fetch all data and return complete PlatformData."""
        campaigns = self.fetch_campaigns(start_date, end_date)
        ad_groups = self.fetch_ad_groups(start_date, end_date)
        ads = self.fetch_ads(start_date, end_date)
        keywords = self.fetch_keywords(start_date, end_date)
        geography = self.fetch_geography(start_date, end_date)
        daily = self.fetch_daily(start_date, end_date)

        # Calculate summary from campaigns
        total_spend = sum(c.spend for c in campaigns)
        total_impressions = sum(c.impressions for c in campaigns)
        total_clicks = sum(c.clicks for c in campaigns)
        total_conversions = sum(c.conversions for c in campaigns)
        ctr = total_clicks / total_impressions if total_impressions > 0 else 0
        avg_cpc = total_spend / total_clicks if total_clicks > 0 else 0

        summary = Summary(
            total_spend=round(total_spend, 2),
            total_impressions=total_impressions,
            total_clicks=total_clicks,
            ctr=round(ctr, 4),
            conversions=int(total_conversions),
            avg_cpc=round(avg_cpc, 2),
        )

        return PlatformData(
            platform="google_ads",
            platform_name="Google Ads",
            last_updated=datetime.now(timezone.utc),
            date_range_start=start_date,
            date_range_end=end_date,
            summary=summary,
            campaigns=campaigns,
            ad_groups=ad_groups,
            ads=ads,
            keywords=keywords,
            geography=geography,
            daily=daily,
        )
