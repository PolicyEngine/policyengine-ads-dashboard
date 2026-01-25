import { Table, Text, Progress } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SortableHeader, sortData, useTableSort, formatCurrency, formatNumber } from './SortableTable';

export default function GeographyChart({ geography }) {
  const { sort, handleSort } = useTableSort('spend', true);

  // Sort for table
  const sortedGeo = sortData(geography, sort.sortBy, sort.reversed);

  // Top 20 by spend for chart (always sorted by spend)
  const topGeo = [...geography].sort((a, b) => b.spend - a.spend).slice(0, 20);
  const maxSpend = Math.max(...geography.map((g) => g.spend));

  return (
    <>
      <Text size="lg" fw={600} mb="md">Spend by country (top 20)</Text>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topGeo} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}`} />
          <YAxis type="category" dataKey="location_name" tick={{ fontSize: 12 }} width={90} />
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spend']} />
          <Bar dataKey="spend" fill="#319795" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <Text size="lg" fw={600} mt="xl" mb="md">All countries</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <SortableHeader sorted={sort.sortBy === 'location_name'} reversed={!sort.reversed} onSort={() => handleSort('location_name')}>Country</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'country_code'} reversed={!sort.reversed} onSort={() => handleSort('country_code')}>Code</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'spend'} reversed={sort.reversed} onSort={() => handleSort('spend')} align="right">Spend</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'impressions'} reversed={sort.reversed} onSort={() => handleSort('impressions')} align="right">Impressions</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'clicks'} reversed={sort.reversed} onSort={() => handleSort('clicks')} align="right">Clicks</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'conversions'} reversed={sort.reversed} onSort={() => handleSort('conversions')} align="right">Conversions</SortableHeader>
            <Table.Th w={150}>Share</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedGeo.map((geo) => (
            <Table.Tr key={geo.country_code}>
              <Table.Td><Text fw={500}>{geo.location_name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{geo.country_code}</Text></Table.Td>
              <Table.Td ta="right">{formatCurrency(geo.spend)}</Table.Td>
              <Table.Td ta="right">{formatNumber(geo.impressions)}</Table.Td>
              <Table.Td ta="right">{formatNumber(geo.clicks)}</Table.Td>
              <Table.Td ta="right">{formatNumber(Math.round(geo.conversions))}</Table.Td>
              <Table.Td>
                <Progress value={(geo.spend / maxSpend) * 100} color="teal" size="sm" />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
