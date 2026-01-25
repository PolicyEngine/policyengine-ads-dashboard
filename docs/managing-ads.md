# Managing Google Ads via MCP

This guide explains how to manage PolicyEngine's Google Ads campaigns using Claude Code and the Google Ads MCP.

## Prerequisites

### MCP configuration

Ensure your `~/.claude/settings.json` has the complete MCP configured:

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "uv",
      "args": [
        "run",
        "--directory",
        "/Users/maxghenis/tmp/google-ads-mcp-complete",
        "python",
        "-m",
        "google_ads_mcp_complete.server"
      ],
      "env": {
        "GOOGLE_ADS_CONFIG_PATH": "/Users/maxghenis/tmp/google-ads-mcp-complete/config.json"
      }
    }
  }
}
```

### Account IDs

- **Customer ID**: `9682183278` (PolicyEngine account)
- **Login Customer ID**: `8928125449` (MCC/manager account)

### Campaigns

| Campaign | ID | Target |
|----------|-----|--------|
| PolicyEngine: US | 19638300165 | United States |
| PolicyEngine: UK and rest of world | 19645727936 | Non-US countries |

## Common operations

### Adding keywords to an ad group

```
Use the add_keywords tool with:
- customer_id: "9682183278"
- ad_group_id: "<ad_group_id>"
- keywords: [{"text": "your keyword", "match_type": "BROAD"}]
```

Example for UK Policy Calculator ad group (ID: 197796293248):
```
add_keywords(
  customer_id="9682183278",
  ad_group_id="197796293248",
  keywords=[
    {"text": "uk tax calculator", "match_type": "BROAD"},
    {"text": "income tax calculator uk", "match_type": "BROAD"},
    {"text": "benefits calculator uk", "match_type": "BROAD"}
  ]
)
```

### UK campaign ad groups

| Ad Group | ID | Purpose |
|----------|-----|---------|
| Homepage (non-US) | 142647852621 | Generic policy searches |
| Benefit cliffs | 149834826441 | Benefit cliff analysis |
| UK Benefits API | 193621027353 | Developer-focused |
| Universal Credit Calculator | 193704169122 | UC benefits |
| Local Area Policy Impact | 193704175082 | Regional analysis |
| UK Policy Analysis | 193706665642 | General UK policy |
| Scottish Budget Calculator | 194886175569 | Scotland-specific |
| UK Budget Calculator | 194886182609 | Budget impact |
| UK Policy Calculator - Trusted by Government | 197796293248 | **Main UK ad group** |
| Two-Child Limit Calculator | 197796308528 | Two-child limit policy |

### Adding negative keywords

To exclude irrelevant searches at the campaign level:

```
add_negative_keywords(
  customer_id="9682183278",
  campaign_id="19645727936",
  keywords=["free", "download", "pdf"]
)
```

### Listing current keywords

```
list_keywords(
  customer_id="9682183278",
  ad_group_id="197796293248"
)
```

### Getting keyword performance

```
get_keyword_performance(
  customer_id="9682183278",
  ad_group_id="197796293248",
  date_range="LAST_30_DAYS"
)
```

## UK keyword strategy

Given PolicyEngine's usage by the UK PM's office, prioritize high-volume UK keywords:

### News-driven keywords (timely)
- "number 10 policy tool"
- "downing street calculator"
- "uk government policy software"
- "prime minister budget tool"

### High-volume UK keywords
- "uk tax calculator"
- "income tax calculator uk"
- "national insurance calculator"
- "universal credit calculator"
- "uk benefits calculator"
- "benefits calculator uk"
- "tax calculator 2025 uk"

### Budget-related keywords
- "uk budget 2025"
- "budget calculator uk"
- "how will budget affect me"
- "spring budget calculator"

## Monitoring performance

After adding keywords, monitor with:

1. **Dashboard**: Check https://policyengine.org/ads-dashboard
2. **Direct query**: Use `get_keyword_performance` tool
3. **Search terms**: Use `get_search_terms_insights` to find new keyword opportunities

## Refreshing dashboard data

The dashboard data is refreshed daily at 6am UTC via GitHub Actions. To manually refresh:

```bash
cd /path/to/policyengine-ads-dashboard
python -m policyengine_ads_dashboard.fetch --output public/data/google-ads.json
git add public/data/google-ads.json
git commit -m "Update ads data [manual]"
git push
```
