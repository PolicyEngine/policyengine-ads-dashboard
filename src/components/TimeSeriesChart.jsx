import { useMemo } from 'react';
import { Text, SegmentedControl, Group } from '@mantine/core';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const formatCurrency = (value) => `$${value.toFixed(0)}`;
const formatNumber = (value) => value.toLocaleString('en-US');

export default function TimeSeriesChart({ daily }) {
  const [metric, setMetric] = useState('spend');
  const [timeRange, setTimeRange] = useState('30');

  const filteredData = useMemo(() => {
    const days = parseInt(timeRange);
    if (days === 0) return daily;
    return daily.slice(-days);
  }, [daily, timeRange]);

  const metricConfig = {
    spend: { label: 'Spend', color: '#319795', format: formatCurrency },
    impressions: { label: 'Impressions', color: '#3182ce', format: formatNumber },
    clicks: { label: 'Clicks', color: '#38a169', format: formatNumber },
    conversions: { label: 'Conversions', color: '#d69e2e', format: formatNumber },
  };

  const config = metricConfig[metric];

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>Performance Over Time</Text>
        <Group>
          <SegmentedControl
            size="xs"
            value={timeRange}
            onChange={setTimeRange}
            data={[
              { label: '30 days', value: '30' },
              { label: '90 days', value: '90' },
              { label: '1 year', value: '365' },
              { label: 'All', value: '0' },
            ]}
          />
          <SegmentedControl
            size="xs"
            value={metric}
            onChange={setMetric}
            data={[
              { label: 'Spend', value: 'spend' },
              { label: 'Impressions', value: 'impressions' },
              { label: 'Clicks', value: 'clicks' },
              { label: 'Conversions', value: 'conversions' },
            ]}
          />
        </Group>
      </Group>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={config.format}
            width={80}
          />
          <Tooltip
            formatter={(value) => [config.format(value), config.label]}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey={metric}
            stroke={config.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
