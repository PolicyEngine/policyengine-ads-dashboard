import { Table, Text, Badge } from '@mantine/core';
import { SortableHeader, sortData, useTableSort, formatCurrency, formatNumber, formatPercent } from './SortableTable';

export default function CampaignTable({ campaigns, adGroups }) {
  const { sort: campaignSort, handleSort: handleCampaignSort } = useTableSort('spend', true);
  const { sort: adGroupSort, handleSort: handleAdGroupSort } = useTableSort('spend', true);

  const sortedCampaigns = sortData(campaigns, campaignSort.sortBy, campaignSort.reversed);
  const sortedAdGroups = sortData(adGroups, adGroupSort.sortBy, adGroupSort.reversed);

  return (
    <>
      <Text size="lg" fw={600} mb="md">Campaigns</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <SortableHeader sorted={campaignSort.sortBy === 'name'} reversed={!campaignSort.reversed} onSort={() => handleCampaignSort('name')}>Campaign</SortableHeader>
            <SortableHeader sorted={campaignSort.sortBy === 'status'} reversed={!campaignSort.reversed} onSort={() => handleCampaignSort('status')}>Status</SortableHeader>
            <SortableHeader sorted={campaignSort.sortBy === 'spend'} reversed={campaignSort.reversed} onSort={() => handleCampaignSort('spend')} align="right">Spend</SortableHeader>
            <SortableHeader sorted={campaignSort.sortBy === 'impressions'} reversed={campaignSort.reversed} onSort={() => handleCampaignSort('impressions')} align="right">Impressions</SortableHeader>
            <SortableHeader sorted={campaignSort.sortBy === 'clicks'} reversed={campaignSort.reversed} onSort={() => handleCampaignSort('clicks')} align="right">Clicks</SortableHeader>
            <SortableHeader sorted={campaignSort.sortBy === 'ctr'} reversed={campaignSort.reversed} onSort={() => handleCampaignSort('ctr')} align="right">CTR</SortableHeader>
            <SortableHeader sorted={campaignSort.sortBy === 'conversions'} reversed={campaignSort.reversed} onSort={() => handleCampaignSort('conversions')} align="right">Conversions</SortableHeader>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedCampaigns.map((campaign) => (
            <Table.Tr key={campaign.id}>
              <Table.Td><Text fw={500}>{campaign.name}</Text></Table.Td>
              <Table.Td>
                <Badge color={campaign.status === 'ENABLED' ? 'green' : 'gray'} size="sm">{campaign.status}</Badge>
              </Table.Td>
              <Table.Td ta="right">{formatCurrency(campaign.spend)}</Table.Td>
              <Table.Td ta="right">{formatNumber(campaign.impressions)}</Table.Td>
              <Table.Td ta="right">{formatNumber(campaign.clicks)}</Table.Td>
              <Table.Td ta="right">{formatPercent(campaign.ctr)}</Table.Td>
              <Table.Td ta="right">{formatNumber(Math.round(campaign.conversions))}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Text size="lg" fw={600} mt="xl" mb="md">Ad groups</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <SortableHeader sorted={adGroupSort.sortBy === 'name'} reversed={!adGroupSort.reversed} onSort={() => handleAdGroupSort('name')}>Ad group</SortableHeader>
            <SortableHeader sorted={adGroupSort.sortBy === 'campaign_name'} reversed={!adGroupSort.reversed} onSort={() => handleAdGroupSort('campaign_name')}>Campaign</SortableHeader>
            <SortableHeader sorted={adGroupSort.sortBy === 'spend'} reversed={adGroupSort.reversed} onSort={() => handleAdGroupSort('spend')} align="right">Spend</SortableHeader>
            <SortableHeader sorted={adGroupSort.sortBy === 'impressions'} reversed={adGroupSort.reversed} onSort={() => handleAdGroupSort('impressions')} align="right">Impressions</SortableHeader>
            <SortableHeader sorted={adGroupSort.sortBy === 'clicks'} reversed={adGroupSort.reversed} onSort={() => handleAdGroupSort('clicks')} align="right">Clicks</SortableHeader>
            <SortableHeader sorted={adGroupSort.sortBy === 'conversions'} reversed={adGroupSort.reversed} onSort={() => handleAdGroupSort('conversions')} align="right">Conversions</SortableHeader>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedAdGroups.map((ag) => (
            <Table.Tr key={ag.id}>
              <Table.Td><Text fw={500}>{ag.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{ag.campaign_name}</Text></Table.Td>
              <Table.Td ta="right">{formatCurrency(ag.spend)}</Table.Td>
              <Table.Td ta="right">{formatNumber(ag.impressions)}</Table.Td>
              <Table.Td ta="right">{formatNumber(ag.clicks)}</Table.Td>
              <Table.Td ta="right">{formatNumber(Math.round(ag.conversions))}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
