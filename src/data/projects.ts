export interface Project {
  name: string;
  description: string;
  year: string;
  href?: string;
}

export const projects: Project[] = [
  {
    name: 'This website',
    description: 'A static blog built with Astro, MDX, and a monochrome design system.',
    year: '2026',
    href: 'https://github.com/daniyal-sh/daniyal-sh.github.io',
  },
  // {
  //   name: 'Another project',
  //   description: 'A short description of what it is and why it exists.',
  //   year: '2025',
  //   href: 'https://github.com/daniyal-sh/another-project',
  // },
];
