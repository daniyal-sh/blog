export interface SocialLink {
  label: string;
  href: string;
}

interface SiteConfig {
  name: string;
  description: string;
  author: string;
  location: string;
  email: string;
  social: {
    github: string;
    x: string;
    linkedin: string;
  };
  analytics: {
    goatcounter: string;
  };
}

export const SITE: SiteConfig = {
  name: 'Untitled',
  description: 'Notes on design, code, and everything in between.',
  author: 'Daniyal',
  location: 'Houston, TX',
  // Fill this in to show an email link in the footer and on the About page.
  email: '',
  social: {
    github: 'https://github.com/daniyal-sh',
    // Fill these in to show X and LinkedIn links.
    x: '',
    linkedin: '',
  },
  analytics: {
    // Your GoatCounter site code, e.g. "daniyal" for daniyal.goatcounter.com.
    // Leave empty to load no analytics script.
    goatcounter: '',
  },
};

export const NAV = [
  { label: 'Archive', href: '/archive/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Now', href: '/now/' },
] as const;

const socialLinks: Array<SocialLink | undefined> = [
  SITE.social.github ? { label: 'GitHub', href: SITE.social.github } : undefined,
  SITE.social.x ? { label: 'X', href: SITE.social.x } : undefined,
  SITE.social.linkedin ? { label: 'LinkedIn', href: SITE.social.linkedin } : undefined,
  SITE.email ? { label: 'Email', href: `mailto:${SITE.email}` } : undefined,
];

export const SOCIALS = socialLinks.filter((link): link is SocialLink => link !== undefined);
