import { prisma } from "../db/prisma";

export const getSettings = async () => {
  try {
    let settings = await prisma.settings.findMany({
        orderBy: {
            id: 'asc',
        },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};


export const updateSettings = async (settingsToUpdate: { id: number; key: string; value: string }[]) => {
  try {
    const updatePromises = settingsToUpdate.map(async (setting) => {
      // Update existing or create if not exists
      return prisma.settings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      });
    });

    // Wait for all updates to complete
    const updatedSettings = await Promise.all(updatePromises);

    return updatedSettings;
  } catch (error) {
    throw error;
  }
};