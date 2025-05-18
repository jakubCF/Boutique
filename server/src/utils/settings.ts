import { getSettings } from '../Controllers/settings.controller';

export const fetchSettingsMap = async (): Promise<Record<string, string>> => {
  const settings = await getSettings();
  return Object.fromEntries(settings.map(({ key, value }) => [key, value]));
};