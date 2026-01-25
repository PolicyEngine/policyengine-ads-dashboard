import { SimpleGrid, Card, Text, Group, ThemeIcon } from '@mantine/core';
import {
  IconCoin,
  IconEye,
  IconClick,
  IconTarget,
  IconPercentage,
} from '@tabler/icons-react';

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatNumber = (value) => value.toLocaleString('en-US');

const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

export default function SummaryCards({ summary }) {
  const metrics = [
    {
      label: 'Total spend',
      value: formatCurrency(summary.total_spend),
      icon: IconCoin,
      color: 'teal',
    },
    {
      label: 'Impressions',
      value: formatNumber(summary.total_impressions),
      icon: IconEye,
      color: 'blue',
    },
    {
      label: 'Clicks',
      value: formatNumber(summary.total_clicks),
      icon: IconClick,
      color: 'green',
    },
    {
      label: 'CTR',
      value: formatPercent(summary.ctr),
      icon: IconPercentage,
      color: 'orange',
    },
    {
      label: 'Conversions',
      value: formatNumber(summary.conversions),
      icon: IconTarget,
      color: 'violet',
    },
    {
      label: 'Avg. CPC',
      value: formatCurrency(summary.avg_cpc),
      icon: IconCoin,
      color: 'gray',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md" mb="xl">
      {metrics.map((metric) => (
        <Card key={metric.label} shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              {metric.label}
            </Text>
            <ThemeIcon color={metric.color} variant="light" size="sm">
              <metric.icon size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>
            {metric.value}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
