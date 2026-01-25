import { Table, Text, Badge, Group } from '@mantine/core';

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatNumber = (value) => value.toLocaleString('en-US');
const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

export default function CampaignTable({ campaigns, adGroups }) {
  return (
    <>
      <Text size="lg" fw={600} mb="md">Campaigns</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Campaign</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th ta="right">Spend</Table.Th>
            <Table.Th ta="right">Impressions</Table.Th>
            <Table.Th ta="right">Clicks</Table.Th>
            <Table.Th ta="right">CTR</Table.Th>
            <Table.Th ta="right">Conversions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {campaigns.map((campaign) => (
            <Table.Tr key={campaign.id}>
              <Table.Td>
                <Text fw={500}>{campaign.name}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={campaign.status === 'ENABLED' ? 'green' : 'gray'} size="sm">
                  {campaign.status}
                </Badge>
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

      <Text size="lg" fw={600} mt="xl" mb="md">Ad Groups</Text>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Ad Group</Table.Th>
            <Table.Th>Campaign</Table.Th>
            <Table.Th ta="right">Spend</Table.Th>
            <Table.Th ta="right">Impressions</Table.Th>
            <Table.Th ta="right">Clicks</Table.Th>
            <Table.Th ta="right">Conversions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {adGroups
            .sort((a, b) => b.spend - a.spend)
            .map((ag) => (
              <Table.Tr key={ag.id}>
                <Table.Td>
                  <Text fw={500}>{ag.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">{ag.campaign_name}</Text>
                </Table.Td>
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
