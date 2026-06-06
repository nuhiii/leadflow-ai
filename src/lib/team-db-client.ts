import { execSync } from 'child_process';

export function queryTeamDb(sql: string) {
  try {
    const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error('team-db query error:', error);
    return null;
  }
}
