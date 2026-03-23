// TODO: Replace with your actual skills before going live

export interface SkillsData {
  [category: string]: string[];
}

export const skills: SkillsData = {
  languages: ['Python', 'SQL', 'Bash'],
  frameworks: ['FastAPI', 'Airflow', 'dbt'],
  data: ['PostgreSQL', 'PostGIS', 'Pandas', 'SQLite'],
  infra: ['Docker', 'GitHub Actions'],
};
