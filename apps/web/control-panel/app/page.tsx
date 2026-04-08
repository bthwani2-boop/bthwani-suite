import Link from 'next/link';

const primarySections = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/operations', label: 'Operations' },
  { href: '/finance', label: 'Finance' },
  { href: '/catalogs', label: 'Catalogs' },
  { href: '/support', label: 'Support' },
  { href: '/partners', label: 'Partners' },
  { href: '/marketing', label: 'Marketing' },
  { href: '/control', label: 'Control' },
];

const controlSubSections = [
  { href: '/control/platform', label: 'Platform' },
  { href: '/control/administration', label: 'Administration' },
  { href: '/control/governance', label: 'Governance' },
  { href: '/control/hr', label: 'HR' },
];

export default function Page() {
  return (
    <main>
      <h1>BThwani Control Panel</h1>
      <p>Unified Next.js shell is active.</p>

      <h2>Primary Sections</h2>
      <ul>
        {primarySections.map((section) => (
          <li key={section.href}>
            <Link href={section.href}>{section.label}</Link>
          </li>
        ))}
      </ul>

      <h2>Control Subsections</h2>
      <ul>
        {controlSubSections.map((section) => (
          <li key={section.href}>
            <Link href={section.href}>{section.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
