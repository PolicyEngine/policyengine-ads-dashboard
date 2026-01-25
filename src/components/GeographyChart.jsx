import { Table, Text, Progress, Group } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatNumber = (value) => value.toLocaleString('en-US');

export default function GeographyChart({ geography }) {
  // Sort by spend and get top 20 for chart
  const sortedGeo = [...geography].sort((a, b) => b.spend - a.spend);
  const topGeo = sortedGeo.slice(0, 20);
  const maxSpend = Math.max(...geography.map((g) => g.spend));

  return (
    <>
      <Text size="lg" fw={600} mb="md">Spend by Country (Top 20)</Text>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topGeo} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}`} />
          <YAxis type="category" dataKey="location_name" tick={{ fontSize: 12 }} width={90} />
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spend']} />
          <Bar dataKey="spend" fill="#319795" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <Text size="lg" fw={600} mt="xl" mb="md">All Countries</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Country</Table.Th>
            <Table.Th>Code</Table.Th>
            <Table.Th ta="right">Spend</Table.Th>
            <Table.Th ta="right">Impressions</Table.Th>
            <Table.Th ta="right">Clicks</Table.Th>
            <Table.Th ta="right">Conversions</Table.Th>
            <Table.Th w={150}>Share</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedGeo.map((geo) => (
            <Table.Tr key={geo.country_code}>
              <Table.Td>
                <Text fw={500}>{geo.location_name}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{geo.country_code}</Text>
              </Table.Td>
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
