import { useState } from 'react';
import { Table, Text, UnstyledButton } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';

export function SortableHeader({ children, sorted, reversed, onSort, align = 'left' }) {
  const Icon = sorted ? (reversed ? IconChevronDown : IconChevronUp) : IconSelector;
  return (
    <Table.Th style={{ textAlign: align }}>
      <UnstyledButton
        onClick={onSort}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
          width: '100%'
        }}
      >
        <Text fw={600} size="sm">{children}</Text>
        <Icon size={14} stroke={1.5} style={{ opacity: sorted ? 1 : 0.5 }} />
      </UnstyledButton>
    </Table.Th>
  );
}

export function sortData(data, sortBy, reversed) {
  if (!sortBy) return data;
  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'string') {
      return reversed ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return reversed ? bVal - aVal : aVal - bVal;
  });
}

export function useTableSort(defaultSortBy = null, defaultReversed = true) {
  const [sort, setSort] = useState({ sortBy: defaultSortBy, reversed: defaultReversed });

  const handleSort = (field) => {
    setSort(prev => ({
      sortBy: field,
      reversed: prev.sortBy === field ? !prev.reversed : true,
    }));
  };

  return { sort, handleSort };
}

// Formatting utilities
export const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatNumber = (value) => value.toLocaleString('en-US');

export const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;
