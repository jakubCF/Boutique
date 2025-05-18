// src/services/poshmarkScraper.ts
import axios from "axios";
import { fetchSettingsMap } from "../utils/settings";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type NewItem = {
  web_url: string;
  name: string;
  posh_size?: string | null;
  brand?: string | null;
  posh_category?: string | null;
  posh_picture_url?: string | null;
  listing_price?: number | null;
  posh_created_at: Date;
  posh_root_ancestor_post_id: string;
  posh_user: string;
  sysdate: Date;
};

const DEFAULT_INTERVAL_HOURS = 12;

export const runScraper = async () => {
  try {
    const settings = await fetchSettingsMap();
    const poshUrl = settings["posh_url"];
    const poshUser = settings["posh_user"];

    if (!poshUrl || !poshUser) {
      throw new Error("Missing required settings: posh_url and/or posh_user.");
    }

    const endpoint = `${poshUrl}/vm-rest/users/${poshUser}/posts/filtered`;
    
    const params = {
        app_version: "2.55",
        pm_version: "2025.20.1",
        summarize: "true",
        request: JSON.stringify({
            filters: {
            department: "All",
            inventory_status: ["available"]
            },
            sort_by: "added_desc",
            experience: "all",
            count: 48,
        })
        };

    const response = await axios.get(endpoint, {
        params, // query parameters
        headers: {
            'accept': 'application/json,text/*;q=0.99',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',
            // you can add more headers if necessary
        },
        timeout: 3600000, // 1 hour
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: true }),
        decompress: true, // enable gzip/deflate (default true for axios)
    });

    const data = response.data?.data;
    if (!Array.isArray(data)) {
        console.log(response);
      throw new Error("Unexpected response format. Expected an array in data field.");
    }

    console.log(`Successfully scraped ${data.length} items from Poshmark.`);

    // Select only specific keys from each object
    const scrapedItems : NewItem[] = data.map(item => ({
    web_url: poshUrl + "/listing/" + item.id,
    name: item.title,
    posh_size: item.size,
    brand: item.brand,
    posh_category: item.category,
    posh_picture_url: item.picture_url,
    listing_price: item.price,
    posh_created_at: new Date(item.created_at),
    posh_root_ancestor_post_id: item.root_ancestor_post_id,
    posh_user: item.posh_user,
    sysdate: new Date()
    }));

    const existingItems = await prisma.item.findMany({
        where: {
            OR: [
            { web_url: { in: scrapedItems.map(i => i.web_url) } },
            { posh_root_ancestor_post_id: { in: scrapedItems.map(i => i.posh_root_ancestor_post_id) } },
            ]
        },
        select: {
            web_url: true,
            posh_root_ancestor_post_id: true,
        }
    });

    const existingUrls = new Set(existingItems.map(i => i.web_url));
    const existingPostIds = new Set(existingItems.map(i => i.posh_root_ancestor_post_id));

    const newItems = scrapedItems.filter(
    item => !existingUrls.has(item.web_url) && !existingPostIds.has(item.posh_root_ancestor_post_id)
    );

    const relistedItems = scrapedItems.filter(
    item => !existingUrls.has(item.web_url) && existingPostIds.has(item.posh_root_ancestor_post_id)
    );

    // ✅ Save all new items
    if (newItems.length) {
    await prisma.item.createMany({
        data: newItems,
        skipDuplicates: true, // just in case
    });

    console.log(`${newItems.length} new items inserted.`);
    } else {
    console.log("No new items to insert.");
    }

    // ✅ Update all relisted items
    if (relistedItems.length) {
    console.log(`${relistedItems.length} relisted items to update.`);
        for (const item of relistedItems) {
            await prisma.item.updateMany({
                where: {
                posh_root_ancestor_post_id: item.posh_root_ancestor_post_id
                },
                data: {
                web_url: item.web_url,
                name: item.name,
                posh_size: item.posh_size,
                brand: item.brand,
                posh_category: item.posh_category,
                posh_picture_url: item.posh_picture_url,
                listing_price: item.listing_price,
                posh_created_at: item.posh_created_at,
                posh_user: item.posh_user
                }
            });
        }
    } else {
    console.log("No relisted items to update.");
    }

    return true;
  } catch (err) {
    console.error("Error during scraping:", err);
    return null;
  }
};

// Interval runner
export const startScraperScheduler = () => {
    runScraper();
    const intervalHours = parseInt(fetchSettingsMap["scrape_interval"] || `${DEFAULT_INTERVAL_HOURS}`, 10);
    setInterval(async () => {
        await runScraper();
    }, intervalHours * 60 * 60 * 1000); // Default 12h, can be adjusted later per-db
};