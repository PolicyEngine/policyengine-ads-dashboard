import { Table, Text, Badge, Group, Anchor, Stack, Paper, Spoiler } from '@mantine/core';

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatNumber = (value) => value.toLocaleString('en-US');

const statusColors = {
  ENABLED: 'green',
  PAUSED: 'yellow',
  REMOVED: 'red',
};

export default function AdsTable({ ads }) {
  // Sort by spend descending
  const sortedAds = [...ads].sort((a, b) => b.spend - a.spend);

  return (
    <>
      <Text size="lg" fw={600} mb="md">Ads with Copy and Landing Pages</Text>
      <Stack gap="md">
        {sortedAds.map((ad) => (
          <Paper key={ad.ad_id} shadow="xs" p="md" withBorder>
            <Group justify="space-between" mb="xs">
              <div>
                <Text fw={600}>{ad.ad_group_name}</Text>
                <Text size="sm" c="dimmed">{ad.campaign_name}</Text>
              </div>
              <Group gap="xs">
                <Badge color={statusColors[ad.status] || 'gray'} size="sm">
                  {ad.status}
                </Badge>
                <Badge color="teal" variant="light">
                  {formatCurrency(ad.spend)}
                </Badge>
              </Group>
            </Group>

            {ad.final_urls.length > 0 && (
              <Group gap="xs" mb="sm">
                <Text size="sm" fw={500}>URL:</Text>
                {ad.final_urls.map((url, i) => (
                  <Anchor key={i} href={url} target="_blank" size="sm">
                    {url.replace('https://', '')}
                  </Anchor>
                ))}
              </Group>
            )}

            {ad.headlines.length > 0 && (
              <div mb="xs">
                <Text size="sm" fw={500} mb={4}>Headlines:</Text>
                <Spoiler maxHeight={60} showLabel="Show all" hideLabel="Hide">
                  <Group gap="xs" wrap="wrap">
                    {ad.headlines.map((headline, i) => (
                      <Badge key={i} variant="outline" color="blue" size="sm">
                        {headline}
                      </Badge>
                    ))}
                  </Group>
                </Spoiler>
              </div>
            )}

            {ad.descriptions.length > 0 && (
              <div>
                <Text size="sm" fw={500} mb={4}>Descriptions:</Text>
                <Spoiler maxHeight={40} showLabel="Show all" hideLabel="Hide">
                  <Stack gap={4}>
                    {ad.descriptions.map((desc, i) => (
                      <Text key={i} size="sm" c="dimmed">
                        {desc}
                      </Text>
                    ))}
                  </Stack>
                </Spoiler>
              </div>
            )}

            <Group mt="sm" gap="xl">
              <Text size="xs" c="dimmed">
                {formatNumber(ad.impressions)} impressions
              </Text>
              <Text size="xs" c="dimmed">
                {formatNumber(ad.clicks)} clicks
              </Text>
              <Text size="xs" c="dimmed">
                {formatNumber(Math.round(ad.conversions))} conversions
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>
    </>
  );
}
