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
    <header style={{ backgroundColor: '#319795', padding: '1rem 0' }}>
      <Container size="xl">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Text c="white" fw={700} size="lg">
              PolicyEngine
            </Text>
            <Title order={1} c="white" size="h3">
              Ads transparency dashboard
            </Title>
          </Group>
          {formattedDate && (
            <Badge variant="light" color="white" size="lg">
              Last updated: {formattedDate}
            </Badge>
          )}
        </Group>
      </Container>
    </header>
  );
}
