"""Data models for ads dashboard."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class Campaign(BaseModel):
    """Campaign-level metrics."""

    id: str
    name: str
    status: str
    spend: float
    impressions: int
    clicks: int
    conversions: float
    ctr: float


class AdGroup(BaseModel):
    """Ad group-level metrics."""

    id: str
    name: str
    campaign_id: str
    campaign_name: str
    spend: float
    impressions: int
    clicks: int
    conversions: float


class Ad(BaseModel):
    """Ad-level details including copy and URLs."""

    ad_id: str
    ad_group_id: str
    ad_group_name: str
    campaign_id: str
    campaign_name: str
    status: str
    final_urls: list[str] = Field(default_factory=list)
    headlines: list[str] = Field(default_factory=list)
    descriptions: list[str] = Field(default_factory=list)
    spend: float
    impressions: int
    clicks: int
    conversions: float


class Keyword(BaseModel):
    """Keyword performance metrics."""

    text: str
    match_type: str
    campaign_name: str
    spend: float
    impressions: int
    clicks: int
    ctr: float


class GeographicMetrics(BaseModel):
    """Geographic performance breakdown."""

    location_name: str
    country_code: str
    spend: float
    impressions: int
    clicks: int
    conversions: float


class DailyMetrics(BaseModel):
    """Daily performance time series."""

    date: str
    spend: float
    impressions: int
    clicks: int
    conversions: float


class Summary(BaseModel):
    """Aggregate summary metrics."""

    total_spend: float
    total_impressions: int
    total_clicks: int
    ctr: float
    conversions: int
    avg_cpc: float


class PlatformData(BaseModel):
    """Complete platform data for the dashboard."""

    platform: str
    platform_name: str
    last_updated: datetime
    date_range_start: str
    date_range_end: str
    summary: Summary
    campaigns: list[Campaign]
    ad_groups: list[AdGroup]
    ads: list[Ad]
    keywords: list[Keyword]
    geography: list[GeographicMetrics]
    daily: list[DailyMetrics]

    def to_json_dict(self) -> dict[str, Any]:
        """Convert to JSON-serializable dict matching dashboard schema."""
        return {
            "platform": self.platform,
            "platform_name": self.platform_name,
            "last_updated": self.last_updated.isoformat().replace("+00:00", "Z"),
            "date_range": {
                "start": self.date_range_start,
                "end": self.date_range_end,
            },
            "summary": self.summary.model_dump(),
            "daily": [d.model_dump() for d in self.daily],
            "campaigns": [c.model_dump() for c in self.campaigns],
            "ad_groups": [ag.model_dump() for ag in self.ad_groups],
            "ads": [a.model_dump() for a in self.ads],
            "keywords": [k.model_dump() for k in self.keywords],
            "geography": [g.model_dump() for g in self.geography],
        }
