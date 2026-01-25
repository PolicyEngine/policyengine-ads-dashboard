import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useAdsData from './useAdsData';

const mockData = {
  platform: 'google_ads',
  last_updated: '2026-01-24T06:00:00Z',
  summary: {
    total_spend: 12500.5,
    total_impressions: 1500000,
    total_clicks: 45000,
    ctr: 0.03,
    conversions: 1200,
  },
  daily: [],
  campaigns: [],
  keywords: [],
  geography: [],
};

describe('useAdsData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns loading state initially', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useAdsData());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('returns data after successful fetch', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const { result } = renderHook(() => useAdsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('returns error on fetch failure', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    const { result } = renderHook(() => useAdsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeTruthy();
  });
});
