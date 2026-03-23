// TODO: Replace with your actual experience before going live

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color?: 'green' | 'cyan' | 'purple' | 'orange';
}

export const timeline: TimelineEntry[] = [
  {
    year: '2024',
    title: 'Role Title @ Company',
    description: 'Short description of what you did and what you shipped.',
    color: 'green',
  },
  {
    year: '2023',
    title: 'Role Title @ Company',
    description: 'Short description of what you did and what you shipped.',
    color: 'cyan',
  },
  {
    year: '2021',
    title: 'Degree — University',
    description: 'Specialisation or relevant focus area.',
    color: 'purple',
  },
];
