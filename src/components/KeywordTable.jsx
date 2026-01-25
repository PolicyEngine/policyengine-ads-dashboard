import { Table, Text, Badge } from '@mantine/core';

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatNumber = (value) => value.toLocaleString('en-US');
const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

const matchTypeColors = {
  BROAD: 'blue',
  PHRASE: 'violet',
  EXACT: 'green',
};

export default function KeywordTable({ keywords }) {
  return (
    <>
      <Text size="lg" fw={600} mb="md">Top Keywords by Spend</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Keyword</Table.Th>
            <Table.Th>Match Type</Table.Th>
            <Table.Th>Campaign</Table.Th>
            <Table.Th ta="right">Spend</Table.Th>
            <Table.Th ta="right">Impressions</Table.Th>
            <Table.Th ta="right">Clicks</Table.Th>
            <Table.Th ta="right">CTR</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {keywords.map((kw, index) => (
            <Table.Tr key={`${kw.text}-${index}`}>
              <Table.Td>
                <Text fw={500}>{kw.text}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={matchTypeColors[kw.match_type] || 'gray'} size="sm">
                  {kw.match_type}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{kw.campaign_name}</Text>
              </Table.Td>
              <Table.Td ta="right">{formatCurrency(kw.spend)}</Table.Td>
              <Table.Td ta="right">{formatNumber(kw.impressions)}</Table.Td>
              <Table.Td ta="right">{formatNumber(kw.clicks)}</Table.Td>
              <Table.Td ta="right">{formatPercent(kw.ctr)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
