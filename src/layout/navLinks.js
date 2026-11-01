// In-page navigation targets, shared by the navbar, the depth rail and scroll tracking.
export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const SECTION_IDS = ['hero', ...NAV_LINKS.map((link) => link.href.slice(1))];
