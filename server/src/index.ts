import "dotenv/config";
import express from "express";
import RouteHandler from "./Routes/RouteHandlerV1";
import cors from "cors"
import morgan from "morgan";
import { PrismaClient } from '@prisma/client';
import { runScraper } from "./services/poshmarkScraper";
import { fetchSettingsMap } from "./utils/settings";

const prisma = new PrismaClient();

const REQUIRED_SETTINGS = ["posh_url", "posh_user", "scrape_interval"];

const startScraperScheduler = async () => {
  try {
  const settings = await fetchSettingsMap();
  const intervalHours = parseInt(settings["scrape_interval"] || "12", 10);
  const intervalMs = intervalHours * 60 * 60 * 1000;

  console.log(`Starting scraper every ${intervalHours} hours`);

  // Initial run
  await runScraper();

// Schedule next run based on current DB value
    setTimeout(startScraperScheduler, intervalMs);
  } catch (error) {
    console.error("Scraper error:", error);

    // Retry after default 12h if something fails
    setTimeout(startScraperScheduler, 12 * 60 * 60 * 1000);
  }
};

// Check if required settings in db are present
async function startupCheck() {
  try {
    const existingSettings = await prisma.settings.findMany({
      where: {
        key: {
          in: REQUIRED_SETTINGS,
        },
      },
    });

    const foundKeys = existingSettings.map((s) => s.key);
    const missingKeys = REQUIRED_SETTINGS.filter((key) => !foundKeys.includes(key));

    if (missingKeys.length > 0) {
      console.warn("⚠️ Missing settings:", missingKeys);

      // Optional: insert default values for missing keys
      const defaultSettings = missingKeys.map((key) => ({
        key,
        value: getDefaultValueForKey(key),
      }));

      await prisma.settings.createMany({
        data: defaultSettings,
        skipDuplicates: true, // In case another process already added them
      });

      console.log("✅ Default settings inserted for missing keys.");
    } else {
      console.log("✅ All required settings are present.");
    }

  } catch (error) {
    console.error("❌ Error during settings check:", error);
  }
}

// Helper: Define default values for settings here
function getDefaultValueForKey(key: string): string {
  const defaults: Record<string, string> = {
    posh_url: "https://poshmark.ca",
    posh_user: "",
    scrape_interval: "1",
  };
  return defaults[key] || "";
}

// Main
const main = async () => {
  const app = express();
  const port = 3000;

  app.use(morgan("dev"))
  app.use(express.json());
  app.use(cors({
    origin: "*",
  }));
  // Routes
  app.use("/v1", RouteHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

async function startServer() {
  await startupCheck();
  // Start scraper
  startScraperScheduler();
  // ... start Express app, HTTP server, etc.
  main();
}

startServer();
