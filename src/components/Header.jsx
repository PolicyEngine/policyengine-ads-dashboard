import { Container, Group, Text, Title, Badge } from '@mantine/core';

export default function Header({ lastUpdated }) {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <header style={{ backgroundColor: '#319795', padding: '0.75rem 0' }}>
      <Container fluid px="xl">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <Text c="white" fw={700} size="md">
              PolicyEngine
            </Text>
            <Title order={1} c="white" size="h4">
              Ads transparency dashboard
            </Title>
          </Group>
          {formattedDate && (
            <Badge variant="light" color="white" size="md">
              Last updated: {formattedDate}
            </Badge>
          )}
        </Group>
      </Container>
    </header>
  );
}
