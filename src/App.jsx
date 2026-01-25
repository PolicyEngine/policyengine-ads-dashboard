import '@mantine/core/styles.css';
import { useState } from 'react';
import { MantineProvider, Container, Tabs, Text, Center, Loader, Alert, Box } from '@mantine/core';
import {
  IconChartBar,
  IconList,
  IconWorld,
  IconInfoCircle,
  IconAlertCircle,
  IconAd,
} from '@tabler/icons-react';
import { theme } from './theme';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TimeSeriesChart from './components/TimeSeriesChart';
import CampaignTable from './components/CampaignTable';
import KeywordTable from './components/KeywordTable';
import GeographyChart from './components/GeographyChart';
import AdsTable from './components/AdsTable';
import useAdsData from './hooks/useAdsData';

function LoadingState() {
  return (
    <Center h={400}>
      <Loader size="xl" color="teal" />
    </Center>
  );
}

function ErrorState({ error }) {
  return (
    <Container size="lg" py="md">
      <Alert icon={<IconAlertCircle size={16} />} title="Error loading data" color="red">
        {error}
      </Alert>
    </Container>
  );
}

function AboutSection() {
  return (
    <Box maw={700}>
      <Text size="lg" mb="md">
        PolicyEngine is a nonprofit organization that builds open-source tools for tax and benefit
        policy analysis.
      </Text>
      <Text mb="md">
        This dashboard provides transparency into our advertising spend through the Google Ads Grant
        program, which provides $10,000 USD per month in free advertising credits to eligible
        nonprofits.
      </Text>
      <Text mb="md">
        Our advertising helps people discover free tools to understand how tax and benefit policies
        affect their households.
      </Text>
      <Text size="sm" c="dimmed">
        Data is updated daily via automated processes. For questions, contact{' '}
        <a href="mailto:hello@policyengine.org">hello@policyengine.org</a>.
      </Text>
    </Box>
  );
}

function Dashboard({ data }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <Header lastUpdated={data.last_updated} />
      <Container size="lg" py="md" px="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List mb="md">
            <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="campaigns" leftSection={<IconList size={16} />}>
              Campaigns
            </Tabs.Tab>
            <Tabs.Tab value="keywords" leftSection={<IconList size={16} />}>
              Keywords
            </Tabs.Tab>
            <Tabs.Tab value="ads" leftSection={<IconAd size={16} />}>
              Ads
            </Tabs.Tab>
            <Tabs.Tab value="geography" leftSection={<IconWorld size={16} />}>
              Geography
            </Tabs.Tab>
            <Tabs.Tab value="about" leftSection={<IconInfoCircle size={16} />}>
              About
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview">
            <SummaryCards summary={data.summary} />
            <Box mt="lg">
              <TimeSeriesChart daily={data.daily} />
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="campaigns">
            <CampaignTable campaigns={data.campaigns} adGroups={data.ad_groups} />
          </Tabs.Panel>

          <Tabs.Panel value="keywords">
            <KeywordTable keywords={data.keywords} />
          </Tabs.Panel>

          <Tabs.Panel value="ads">
            <AdsTable ads={data.ads} />
          </Tabs.Panel>

          <Tabs.Panel value="geography">
            <GeographyChart geography={data.geography} />
          </Tabs.Panel>

          <Tabs.Panel value="about">
            <AboutSection />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}

export default function App() {
  const { data, loading, error } = useAdsData();

  return (
    <MantineProvider theme={theme}>
      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {data && <Dashboard data={data} />}
    </MantineProvider>
  );
}
