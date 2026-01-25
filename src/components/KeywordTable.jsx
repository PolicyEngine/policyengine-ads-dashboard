import { Table, Text, Badge } from '@mantine/core';
import { SortableHeader, sortData, useTableSort, formatCurrency, formatNumber, formatPercent } from './SortableTable';

const matchTypeColors = {
  BROAD: 'blue',
  PHRASE: 'violet',
  EXACT: 'green',
};

export default function KeywordTable({ keywords }) {
  const { sort, handleSort } = useTableSort('spend', true);
  const sortedKeywords = sortData(keywords, sort.sortBy, sort.reversed);

  return (
    <>
      <Text size="lg" fw={600} mb="md">Top keywords by spend</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <SortableHeader sorted={sort.sortBy === 'text'} reversed={!sort.reversed} onSort={() => handleSort('text')}>Keyword</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'match_type'} reversed={!sort.reversed} onSort={() => handleSort('match_type')}>Match type</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'campaign_name'} reversed={!sort.reversed} onSort={() => handleSort('campaign_name')}>Campaign</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'spend'} reversed={sort.reversed} onSort={() => handleSort('spend')} align="right">Spend</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'impressions'} reversed={sort.reversed} onSort={() => handleSort('impressions')} align="right">Impressions</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'clicks'} reversed={sort.reversed} onSort={() => handleSort('clicks')} align="right">Clicks</SortableHeader>
            <SortableHeader sorted={sort.sortBy === 'ctr'} reversed={sort.reversed} onSort={() => handleSort('ctr')} align="right">CTR</SortableHeader>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedKeywords.map((kw, index) => (
            <Table.Tr key={`${kw.text}-${index}`}>
              <Table.Td><Text fw={500}>{kw.text}</Text></Table.Td>
              <Table.Td>
                <Badge color={matchTypeColors[kw.match_type] || 'gray'} size="sm">{kw.match_type}</Badge>
              </Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{kw.campaign_name}</Text></Table.Td>
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
