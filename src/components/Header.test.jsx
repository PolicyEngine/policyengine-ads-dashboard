import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import Header from './Header';
import { theme } from '../theme';

const renderWithMantine = (component) => {
  return render(<MantineProvider theme={theme}>{component}</MantineProvider>);
};

describe('Header', () => {
  it('renders the title', () => {
    renderWithMantine(<Header />);
    expect(screen.getByText('Ads transparency dashboard')).toBeInTheDocument();
  });

  it('displays last updated date when provided', () => {
    renderWithMantine(<Header lastUpdated="2026-01-24T06:00:00Z" />);
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
  });

  it('shows PolicyEngine branding', () => {
    renderWithMantine(<Header />);
    expect(screen.getByText('PolicyEngine')).toBeInTheDocument();
  });
});
