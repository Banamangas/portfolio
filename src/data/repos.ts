// TODO: Replace with your actual repos before going live

export interface Repo {
  name: string;
  description: string;
  href: string;
  language: string;
  stars?: number;
}

export const repos: Repo[] = [
  {
    name: 'repo-name',
    description: 'Short description of what this repo does.',
    href: 'https://github.com/Banamangas/repo-name',
    language: 'Python',
    stars: 0,
  },
];
