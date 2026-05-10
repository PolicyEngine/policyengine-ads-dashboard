'use client';

import { Header as PolicyEngineSiteHeader } from '@policyengine/ui-kit';

const navItems = [
  { label: 'Research', href: 'https://policyengine.org/us/research' },
  { label: 'Model', href: 'https://policyengine.org/us/model' },
  { label: 'API', href: 'https://policyengine.org/us/api' },
  {
    label: 'About',
    href: 'https://policyengine.org/us/team',
    children: [
      { label: 'Team', href: 'https://policyengine.org/us/team' },
      { label: 'Supporters', href: 'https://policyengine.org/us/supporters' },
    ],
  },
  { label: 'Donate', href: 'https://policyengine.org/us/donate' },
];

const countries = [
  { id: 'us', label: 'United States' },
  { id: 'uk', label: 'United Kingdom' },
];

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
    <>
      <PolicyEngineSiteHeader
        navItems={navItems}
        countries={countries}
        currentCountry="us"
        logoHref="https://policyengine.org/us"
        onCountryChange={(countryId) => {
          window.location.href = `https://policyengine.org/${countryId}`;
        }}
      />
      <div className="ads-dashboard-shellbar" aria-label="Ads dashboard status">
        <span>Ads transparency dashboard</span>
        {formattedDate && <span>Last updated: {formattedDate}</span>}
      </div>
    </>
  );
}
