import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import SummaryCards from './SummaryCards';
import { theme } from '../theme';

const renderWithMantine = (component) => {
  return render(<MantineProvider theme={theme}>{component}</MantineProvider>);
};

const mockSummary = {
  total_spend: 12500.5,
  total_impressions: 1500000,
  total_clicks: 45000,
  ctr: 0.03,
  conversions: 1200,
  avg_cpc: 0.28,
};

describe('SummaryCards', () => {
  it('renders without crashing', () => {
    renderWithMantine(<SummaryCards summary={mockSummary} />);
  });

  it('formats currency correctly', () => {
    renderWithMantine(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('$12,500.50')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    renderWithMantine(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('1,500,000')).toBeInTheDocument();
  });

  it('formats percentages correctly', () => {
    renderWithMantine(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('3.00%')).toBeInTheDocument();
  });

  it('displays all metric labels', () => {
    renderWithMantine(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('Total spend')).toBeInTheDocument();
    expect(screen.getByText('Impressions')).toBeInTheDocument();
    expect(screen.getByText('Clicks')).toBeInTheDocument();
    expect(screen.getByText('CTR')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    const zeroSummary = { ...mockSummary, total_clicks: 0 };
    renderWithMantine(<SummaryCards summary={zeroSummary} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
