
# POSHMARK ITEMS INFORMATION SYSTEM

Build on top of app made by [Scott-Duby](https://github.com/Scott-Duby/Boutique)
First take on node.js and typescript (I don't know what I'm doing here)

Demo with dummy data available: [Boutique App](https://demo-boutique.jakubvlcek.cz/)

## ADDED

- additional fields for items
- edit popup for all fields at one place
- column selector
- filter for sold
- data scraper
- basic data logging on DB level (no API endpoint)

## Fields Item

id
name
brand  
buy_price
listing_price
item_desc
purchase_date
sold_date
sold
web_url
made_in
posh_category
posh_picture_url
posh_created_at
posh_root_ancestor_post_id
posh_size
posh_user
bin
bin_id
sysdate

## Disclaimer

Disclaimer: This data scraper is intended for educational purposes only. Users are responsible for ensuring compliance with each website’s terms of service and must check the site's robots.txt file before scraping any data.


# 🛍️ Boutique

![License](https://img.shields.io/github/license/Scott-Duby/Boutique?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/Scott-Duby/Boutique?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/Scott-Duby/Boutique?style=flat-square)
![Issues](https://img.shields.io/github/issues/Scott-Duby/Boutique?style=flat-square)
![ShadCN UI](https://img.shields.io/badge/ui-shadcn/ui-blueviolet?logo=tailwindcss&style=flat-square)

> Inventory management app for organizing items and bins with inline editing, filters, and state persistence.

---

## 🧠 Features

- 🔍 Filterable & sortable item table
- ✏️ Inline editing (name, sold status, bin assignment)
- 📦 Bin management modal
- ♻️ Zustand state management
- 🪄 Table state persistence (filters, pagination)
- 💅 Built with ShadCN UI, TanStack Table, and Tailwind CSS
- 💾 Bulk item creation via modal dialog

---

## 🛠️ Tech Stack

- **React 18**
- **Zustand** – global state
- **TanStack Table** – table rendering
- **ShadCN/UI** – component library
- **Tailwind CSS** – styling
- **TypeScript** – type safety

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
Download docker-compose.yaml & nginx.conf
docker compose up -d
Go to http://hsot:8000 in your browser.
```

🧪 API Reference

```bash

Bin
type Bin = {
  id: number
  name: string
  is_full: boolean
  items: Item[]
}

Item
type Item = {
    id: number;
    name: string;
    binId: number;
    bin?: {
        id: number,
        name: string,
        is_full: boolean
    };
    sold: boolean;
    web_url: string;
    buy_price: number;
    listing_price: number;
    item_desc: string;
    brand: string;
    purchase_date: Date;
    sold_date: Date;
    made_in: string;
    posh_category: string;
    posh_picture_url: string;
    posh_created_at: Date;
    posh_size: string;
    posh_root_ancestor_post_id: string;
}

Settings
type Setting {
  key: string;
  value: string;
}

```

```bash
🧠 Zustand Store (useBoutiqueStore)
```

🙏 Credits
💅 ShadCN/UI

🧠 TanStack Table

⚡ Zustand

🎨 Tailwind CSS

📄 License
MIT © Scott Duby
